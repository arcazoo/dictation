import { useEffect, useMemo, useRef, useState } from 'react';
import { SpeakingFeedbackCard } from '../components/ai/SpeakingFeedbackCard';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { GlassCard } from '../components/ui/GlassCard';
import { Icon, type IconName } from '../components/ui/icons';
import { Screen } from '../components/ui/Screen';
import { parseSpeakingFeedback } from '../lib/aiResponseParser';
import { speakText, stopSpeaking } from '../lib/speech';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../lib/speechRecognition';
import { askTutor, type TutorMessage } from '../lib/tutorApi';
import { computeStats, useAppStore } from '../store/appStore';
import type { SpeakingAttempt, SpeakingFeedback } from '../types';

type CallMode = 'free' | 'rolePlay' | 'ielts';
type CallState = 'idle' | 'connecting' | 'aiSpeaking' | 'listening' | 'thinking' | 'ended';

const SCENARIOS = [
  { id: 'shop', label: "Do'kon", ru: 'в магазине (продавец)' },
  { id: 'taxi', label: 'Taksi', ru: 'в такси (водитель)' },
  { id: 'cafe', label: 'Kafe', ru: 'в кафе (официант)' },
  { id: 'doctor', label: 'Shifokor', ru: 'у врача (врач)' },
  { id: 'job', label: 'Ish suhbati', ru: 'на собеседовании (работодатель)' },
  { id: 'friend', label: "Yangi do'st", ru: 'новый знакомый (друг)' },
];

const MODE_META: Record<CallMode, { title: string; subtitle: string; icon: IconName; lang: 'ru-RU' | 'en-US' }> = {
  free: { title: 'Erkin suhbat', subtitle: "Rus tilida kundalik mavzularda jonli gaplashish", icon: 'sparkles', lang: 'ru-RU' },
  rolePlay: { title: 'Role-play', subtitle: "Real vaziyat: do'kon, taksi, shifokor...", icon: 'user', lang: 'ru-RU' },
  ielts: { title: 'IELTS Speaking', subtitle: 'Ingliz tilida imtihon simulyatsiyasi + band ball', icon: 'trophy', lang: 'en-US' },
};

function liveInstruction(mode: CallMode, scenarioRu?: string) {
  if (mode === 'ielts') {
    return [
      'LIVE VOICE CALL MODE. You are an IELTS Speaking examiner on a phone call.',
      'Speak ONLY English. Ask Part 1 style questions first, then Part 2/3 as the call continues.',
      'Reply with ONLY your next spoken line: maximum 2 short sentences ending with exactly one question.',
      'No markdown, no lists, no translations, no explanations — only natural spoken English.',
    ].join(' ');
  }
  const scenario = scenarioRu ? `Role-play scenario: ${scenarioRu}. Stay in character.` : '';
  return [
    'LIVE VOICE CALL MODE. You are a friendly native Russian speaker on a phone call with an Uzbek learner.',
    scenario,
    'Speak ONLY simple A1-A2 Russian. Reply with ONLY your next spoken line: maximum 2 short sentences ending with exactly one question.',
    'If the learner makes a grammar mistake, first say the corrected sentence briefly (in Russian), then continue.',
    'No markdown, no lists, no Uzbek, no English, no explanations — only natural spoken Russian.',
  ].join(' ');
}

function openingMessage(mode: CallMode, scenarioRu?: string) {
  if (mode === 'ielts') return 'Start the IELTS speaking call now. Greet me briefly and ask the first Part 1 question.';
  if (mode === 'rolePlay' && scenarioRu) return `Начни разговор по сценарию: ${scenarioRu}. Поздоровайся и задай первый вопрос.`;
  return 'Начни телефонный разговор. Поздоровайся по-русски и задай простой первый вопрос.';
}

/** TTS uchun matnni tozalash: markdown, urg'u belgilari, ortiqcha qatorlar */
function cleanForSpeech(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[*_#`>]/g, '')
    .replace(/\n+/g, '. ')
    .normalize('NFD')
    .replace(/́/g, '')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();
}

export function VoiceCoachPage() {
  const settings = useAppStore((state) => state.settings);
  const words = useAppStore((state) => state.words);
  const progress = useAppStore((state) => state.progress);
  const events = useAppStore((state) => state.events);
  const addSpeakingAttempt = useAppStore((state) => state.addSpeakingAttempt);
  const speakingAttempts = useAppStore((state) => state.speakingAttempts);

  const [mode, setMode] = useState<CallMode>('free');
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [callState, setCallState] = useState<CallState>('idle');
  const [aiLine, setAiLine] = useState('');
  const [userInterim, setUserInterim] = useState('');
  const [lastUserLine, setLastUserLine] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [turns, setTurns] = useState(0);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const supported = useMemo(() => isSpeechRecognitionSupported(), []);
  const stats = useMemo(() => computeStats({ words, progress, events }), [words, progress, events]);

  const activeRef = useRef(false);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const historyRef = useRef<TutorMessage[]>([]);
  const recognizerRef = useRef<{ start: () => void; stop: () => void; abort: () => void } | null>(null);
  const gotFinalRef = useRef(false);
  const silenceRetriesRef = useRef(0);
  const timerRef = useRef<number | undefined>(undefined);
  const modeRef = useRef<CallMode>('free');
  const scenarioRef = useRef(SCENARIOS[0]);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      recognizerRef.current?.abort();
      stopSpeaking();
      window.clearInterval(timerRef.current);
    };
  }, []);

  async function askLive(message: string) {
    const response = await askTutor({
      message,
      mode: 'audioConversation',
      tone: settings.ai.coachTone,
      answerLength: 'short',
      context: liveInstruction(modeRef.current, modeRef.current === 'rolePlay' ? scenarioRef.current.ru : undefined),
      history: historyRef.current.slice(-12),
      stats,
    });
    return cleanForSpeech(response.answer ?? '');
  }

  async function speakLine(text: string) {
    if (!activeRef.current) return;
    setCallState('aiSpeaking');
    setAiLine(text);
    // Android'da uzun matn TTS'da uzilib qoladi — gaplarga bo'lib o'qiymiz
    const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text];
    for (const sentence of sentences) {
      if (!activeRef.current) return;
      await speakText(sentence.trim(), { lang: MODE_META[modeRef.current].lang, rate: settings.sound.speed === 'slow' ? 0.8 : 0.95 });
    }
  }

  function listen() {
    if (!activeRef.current) return;
    if (mutedRef.current) return;
    setCallState('listening');
    setUserInterim('');
    gotFinalRef.current = false;

    const recognizer = createSpeechRecognizer({
      lang: MODE_META[modeRef.current].lang,
      interimResults: true,
      onResult: (finalTranscript, interim) => {
        if (interim) setUserInterim(interim);
        if (finalTranscript) {
          gotFinalRef.current = true;
          silenceRetriesRef.current = 0;
          void handleUserTurn(finalTranscript);
        }
      },
      onError: (error) => {
        if (!activeRef.current) return;
        // Suhbat hech qachon avtomatik tugamaydi — faqat foydalanuvchi tugatadi
        if (error === 'not-allowed' || error === 'service-not-allowed') {
          setErrorText('Mikrofon ruxsati kerak. Pastdagi mikrofon tugmasini bosib qayta urinib ko‘ring.');
        }
        // 'no-speech', 'network', 'aborted' — onEnd qayta ishga tushiradi
      },
      onEnd: () => {
        if (!activeRef.current || mutedRef.current || gotFinalRef.current) return;
        silenceRetriesRef.current += 1;
        if (silenceRetriesRef.current >= 4) {
          silenceRetriesRef.current = 0;
          void nudge();
          return;
        }
        // Jimlik — qayta tinglaymiz
        window.setTimeout(() => {
          if (activeRef.current && !mutedRef.current && !gotFinalRef.current) recognizerRef.current?.start();
        }, 150);
      },
    });
    recognizerRef.current = recognizer;
    try {
      recognizer.start();
    } catch {
      // ba'zi brauzerlarda ketma-ket start xato beradi — bir martalik retry
      window.setTimeout(() => recognizer.start(), 250);
    }
  }

  /** Uzoq jimlikda AI o'zi gap tashlaydi */
  async function nudge() {
    if (!activeRef.current) return;
    recognizerRef.current?.abort();
    setCallState('thinking');
    try {
      const text = await askLive(
        modeRef.current === 'ielts'
          ? '(The candidate is silent. Encourage briefly and repeat or simplify your question.)'
          : '(Ученик молчит. Подбодри его коротко по-русски и повтори вопрос проще.)',
      );
      historyRef.current.push({ id: `a-${Date.now()}`, role: 'assistant', text });
      await speakLine(text);
    } catch {
      setErrorText('AI bilan aloqa uzildi. Internetni tekshiring.');
    }
    listen();
  }

  async function handleUserTurn(transcript: string) {
    if (!activeRef.current) return;
    recognizerRef.current?.abort();
    setUserInterim('');
    setLastUserLine(transcript);
    setTurns((value) => value + 1);
    historyRef.current.push({ id: `u-${Date.now()}`, role: 'user', text: transcript });
    setCallState('thinking');
    try {
      const text = await askLive(transcript);
      if (!activeRef.current) return;
      historyRef.current.push({ id: `a-${Date.now()}`, role: 'assistant', text });
      await speakLine(text);
    } catch {
      setErrorText('AI bilan aloqa uzildi. Internetni tekshiring.');
      await speakLine(modeRef.current === 'ielts' ? 'Sorry, can you repeat that?' : 'Извини, повтори, пожалуйста.');
    }
    listen();
  }

  async function startCall(selectedMode: CallMode) {
    setMode(selectedMode);
    modeRef.current = selectedMode;
    scenarioRef.current = scenario;
    setErrorText('');
    setFeedback(null);
    setAiLine('');
    setLastUserLine('');
    setTurns(0);
    setSeconds(0);
    historyRef.current = [];
    silenceRetriesRef.current = 0;
    mutedRef.current = false;
    setMuted(false);
    activeRef.current = true;
    setCallState('connecting');
    timerRef.current = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    try {
      const text = await askLive(openingMessage(selectedMode, selectedMode === 'rolePlay' ? scenario.ru : undefined));
      historyRef.current.push({ id: `a-${Date.now()}`, role: 'assistant', text });
      await speakLine(text);
      listen();
    } catch {
      setErrorText('AI bilan aloqa o‘rnatilmadi. Internetni tekshiring.');
      await endCall(false);
    }
  }

  async function endCall(withFeedback = true) {
    activeRef.current = false;
    recognizerRef.current?.abort();
    stopSpeaking();
    window.clearInterval(timerRef.current);
    setCallState('ended');

    if (!withFeedback || historyRef.current.filter((item) => item.role === 'user').length === 0) return;

    setFeedbackLoading(true);
    try {
      const transcript = historyRef.current
        .map((item) => `${item.role === 'user' ? 'LEARNER' : 'AI'}: ${item.text}`)
        .join('\n');
      const response = await askTutor({
        message: 'Evaluate the LEARNER speaking performance in this finished voice call transcript. Return the speakingFeedback JSON.',
        mode: 'speakingPractice',
        wantsJson: true,
        context: transcript,
        stats,
      });
      const parsed = parseSpeakingFeedback(response.answer ?? '');
      if (parsed) {
        setFeedback(parsed);
        const attempt: SpeakingAttempt = {
          id: `call-${Date.now()}`,
          created_at: new Date().toISOString(),
          mode: modeRef.current === 'ielts' ? 'ieltsSpeaking' : 'audioConversation',
          question_ru: historyRef.current.find((item) => item.role === 'assistant')?.text ?? '',
          user_transcript: historyRef.current.filter((item) => item.role === 'user').map((item) => item.text).join(' | '),
          feedback: parsed,
          score: parsed.score,
          ieltsBand: parsed.ieltsBand,
        };
        await addSpeakingAttempt(attempt);
      }
    } catch {
      // baho olinmasa ham suhbat yakuni ko'rsatiladi
    } finally {
      setFeedbackLoading(false);
    }
  }

  function toggleMute() {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    if (next) {
      recognizerRef.current?.abort();
    } else if (activeRef.current && callState === 'listening') {
      listen();
    }
  }

  /** Markaziy mikrofon tugmasi — qo'lda tinglashni qayta boshlash (user gesture) */
  function manualListen() {
    if (!activeRef.current) return;
    stopSpeaking();
    recognizerRef.current?.abort();
    mutedRef.current = false;
    setMuted(false);
    silenceRetriesRef.current = 0;
    setErrorText('');
    listen();
  }

  const inCall = callState !== 'idle' && callState !== 'ended';

  // ========================= QO'NG'IROQ EKRANI =========================
  if (inCall) {
    return (
      <Screen className="max-w-md">
        <div className="flex min-h-[70vh] flex-col items-center justify-between py-4">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              {MODE_META[mode].title}
              {mode === 'rolePlay' ? ` · ${scenario.label}` : ''}
            </p>
            <p className="mt-1 text-2xl font-black tabular-nums">{formatTime(seconds)}</p>
          </div>

          {/* Avatar + holat halqalari */}
          <div className="relative grid place-items-center py-6">
            {callState === 'listening' ? (
              <>
                <span className="absolute h-44 w-44 animate-ping rounded-full bg-success-500/20" />
                <span className="absolute h-36 w-36 rounded-full bg-success-500/15" />
              </>
            ) : null}
            {callState === 'aiSpeaking' ? (
              <>
                <span className="absolute h-44 w-44 animate-pulse rounded-full bg-brand-500/20" />
                <span className="absolute h-36 w-36 rounded-full bg-brand-500/15" />
              </>
            ) : null}
            <div
              className={`grid h-28 w-28 place-items-center rounded-full border-b-8 text-white transition-colors ${
                callState === 'listening'
                  ? 'border-success-800 bg-success-600'
                  : callState === 'thinking' || callState === 'connecting'
                    ? 'border-ink-900 bg-ink-700'
                    : 'border-brand-800 bg-brand-600'
              }`}
            >
              <Icon name={callState === 'listening' ? 'volume' : 'sparkles'} size={44} />
            </div>
          </div>

          {/* Holat va jonli matn */}
          <div className="w-full space-y-3 text-center">
            <p className="text-sm font-black uppercase tracking-wide text-slate-400">{stateLabel(callState, muted)}</p>
            {aiLine ? (
              <div className="rounded-2xl border-2 border-brand-600/20 bg-brand-50 p-4 dark:bg-brand-950/40">
                <p className="text-base font-black leading-snug">{aiLine}</p>
              </div>
            ) : null}
            {userInterim || lastUserLine ? (
              <div className="rounded-2xl border-2 border-ink-900/[0.08] bg-white p-3 dark:border-white/[0.08] dark:bg-ink-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Siz</p>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  {userInterim || lastUserLine}
                  {userInterim ? <span className="animate-pulse">…</span> : null}
                </p>
              </div>
            ) : null}
            {errorText ? <p className="text-sm font-black text-danger-600">{errorText}</p> : null}
          </div>

          {/* Boshqaruv: markazda MIKROFON, tugatish alohida pastda */}
          <div className="mt-6 w-full space-y-3">
            <div className="flex items-center justify-center gap-5">
              <CallButton
                icon="volume"
                label={muted ? 'Yoqish' : 'Pauza'}
                tone={muted ? 'border-warn-600 bg-warn-500' : 'border-ink-900/20 bg-white !text-ink-700 dark:border-white/20 dark:bg-ink-800 dark:!text-white'}
                onClick={toggleMute}
              />
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={manualListen}
                  aria-label="Gapirish"
                  className={`grid h-20 w-20 place-items-center rounded-full border-b-8 text-white transition active:translate-y-[3px] active:border-b-4 ${
                    callState === 'listening'
                      ? 'border-success-800 bg-success-600'
                      : 'border-brand-800 bg-brand-600'
                  }`}
                >
                  <Icon name="mic" size={34} />
                </button>
                <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                  {callState === 'listening' ? 'Eshityapman' : 'Bosib gapiring'}
                </span>
              </div>
              <CallButton
                icon="play"
                label="Qayta eshit"
                tone="border-ink-900/20 bg-white !text-ink-700 dark:border-white/20 dark:bg-ink-800 dark:!text-white"
                onClick={() => {
                  if (aiLine) void speakText(aiLine, { lang: MODE_META[mode].lang });
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => void endCall(true)}
              className="mx-auto flex min-h-12 w-full max-w-xs items-center justify-center gap-2 rounded-2xl border-b-4 border-danger-800 bg-danger-600 px-5 text-sm font-black uppercase tracking-wide text-white transition active:translate-y-[2px] active:border-b-2"
            >
              <Icon name="phoneDown" size={20} />
              Suhbatni tugatish
            </button>
          </div>
        </div>
      </Screen>
    );
  }

  // ========================= YAKUN EKRANI =========================
  if (callState === 'ended') {
    return (
      <Screen className="max-w-xl">
        <GlassCard className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border-b-4 border-brand-800 bg-brand-600 text-white">
            <Icon name="check" size={26} />
          </span>
          <h1 className="mt-3 text-2xl font-black">Suhbat yakunlandi</h1>
          <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
            {formatTime(seconds)} · {turns} ta javob
          </p>
        </GlassCard>

        {feedbackLoading ? (
          <GlassCard className="text-center">
            <p className="animate-pulse text-sm font-black text-slate-500">AI suhbatingizni baholayapti...</p>
          </GlassCard>
        ) : null}

        {feedback ? <SpeakingFeedbackCard feedback={feedback} /> : null}

        {historyRef.current.length ? (
          <details className="rounded-2xl border-2 border-ink-900/[0.07] bg-white p-4 dark:border-white/[0.07] dark:bg-ink-800">
            <summary className="cursor-pointer text-sm font-black">Suhbat matni</summary>
            <div className="mt-3 space-y-2">
              {historyRef.current.map((item) => (
                <div
                  key={item.id}
                  className={`max-w-[88%] rounded-xl p-2.5 text-sm font-bold ${
                    item.role === 'user'
                      ? 'ml-auto bg-brand-50 text-brand-800 dark:bg-brand-950/50 dark:text-brand-200'
                      : 'bg-ink-50 text-slate-700 dark:bg-ink-900 dark:text-slate-300'
                  }`}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </details>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          <SecondaryActionButton onClick={() => setCallState('idle')}>Menyu</SecondaryActionButton>
          <PrimaryActionButton onClick={() => void startCall(mode)}>Yana gaplashish</PrimaryActionButton>
        </div>
      </Screen>
    );
  }

  // ========================= LOBBI =========================
  const lastAttempts = speakingAttempts.slice(-3).reverse();
  return (
    <Screen className="max-w-xl">
      <GlassCard className="!p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black">AI bilan jonli suhbat</h1>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Gapiring — AI eshitadi, ovoz bilan javob beradi
            </p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
            <Icon name="volume" size={22} />
          </span>
        </div>
      </GlassCard>

      {!supported ? (
        <div className="rounded-2xl border-2 border-warn-500/30 bg-warn-100/60 p-4 text-sm font-bold text-warn-800 dark:bg-amber-950/40 dark:text-amber-200">
          Brauzeringiz ovozni aniqlashni qo'llamaydi. Chrome yoki Edge ishlating.
        </div>
      ) : null}

      <div className="space-y-3">
        {(Object.keys(MODE_META) as CallMode[]).map((item) => {
          const meta = MODE_META[item];
          const selected = mode === item;
          return (
            <div key={item}>
              <button
                type="button"
                onClick={() => setMode(item)}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 border-b-4 p-4 text-left transition active:translate-y-[2px] active:border-b-2 ${
                  selected
                    ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/40'
                    : 'border-ink-900/[0.09] bg-white dark:border-white/[0.09] dark:bg-ink-800'
                }`}
              >
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                    selected ? 'bg-brand-600 text-white' : 'bg-ink-50 text-slate-500 dark:bg-ink-900 dark:text-slate-400'
                  }`}
                >
                  <Icon name={meta.icon} size={24} />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-black">{meta.title}</span>
                  <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">{meta.subtitle}</span>
                </span>
              </button>
              {item === 'rolePlay' && selected ? (
                <div className="mt-2 flex flex-wrap gap-2 px-1">
                  {SCENARIOS.map((scene) => (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => setScenario(scene)}
                      className={`rounded-xl border-2 px-3 py-1.5 text-xs font-black transition active:scale-95 ${
                        scenario.id === scene.id
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-ink-900/10 bg-white text-slate-500 dark:border-white/10 dark:bg-ink-800 dark:text-slate-400'
                      }`}
                    >
                      {scene.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <PrimaryActionButton className="w-full !min-h-16 text-base" disabled={!supported} onClick={() => void startCall(mode)}>
        📞 Suhbatni boshlash
      </PrimaryActionButton>

      {lastAttempts.length ? (
        <GlassCard>
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-400">Oxirgi suhbatlar</h2>
          <div className="mt-3 space-y-2">
            {lastAttempts.map((attempt) => (
              <div key={attempt.id} className="flex items-center justify-between gap-3 rounded-xl bg-ink-50 px-3 py-2.5 dark:bg-ink-900">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">{attempt.question_ru || 'Suhbat'}</p>
                  <p className="text-[11px] font-bold text-slate-400">{new Date(attempt.created_at).toLocaleDateString()}</p>
                </div>
                {typeof attempt.score === 'number' ? (
                  <span className="shrink-0 rounded-lg bg-brand-50 px-2.5 py-1 text-sm font-black text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {attempt.score}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </GlassCard>
      ) : null}
    </Screen>
  );
}

function CallButton({ icon, label, tone, onClick }: { icon: IconName; label: string; tone: string; onClick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`grid h-14 w-14 place-items-center rounded-full border-b-4 text-white transition active:translate-y-[2px] active:border-b-2 ${tone}`}
      >
        <Icon name={icon} size={22} />
      </button>
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</span>
    </div>
  );
}

function stateLabel(state: CallState, muted: boolean) {
  if (muted) return 'Pauza — mikrofon o‘chiq';
  switch (state) {
    case 'connecting':
      return 'Ulanmoqda...';
    case 'aiSpeaking':
      return 'AI gapiryapti...';
    case 'listening':
      return 'Sizni eshityapman — gapiring!';
    case 'thinking':
      return "AI o'ylayapti...";
    default:
      return '';
  }
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
