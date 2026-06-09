import { useEffect, useMemo, useRef, useState } from 'react';
import { AiCoachMessage } from '../components/ai/AiCoachMessage';
import { AiModeSelector } from '../components/ai/AiModeSelector';
import { AudioButton } from '../components/ai/AudioButton';
import { CoachToneSelector } from '../components/ai/CoachToneSelector';
import { MicrophoneButton } from '../components/ai/MicrophoneButton';
import { RolePlayCard } from '../components/ai/RolePlayCard';
import { SpeakingFeedbackCard } from '../components/ai/SpeakingFeedbackCard';
import { VoiceWave } from '../components/ai/VoiceWave';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { CATEGORIES } from '../data/categories';
import { parseAiResponse, parseSpeakingFeedback } from '../lib/aiResponseParser';
import { getTodayLesson } from '../lib/lesson';
import { speakText } from '../lib/speech';
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  type SpeechRecognitionState,
} from '../lib/speechRecognition';
import { askTutor, type TutorMessage } from '../lib/tutorApi';
import type {
  AiCoachMode,
  Category,
  CoachTone,
  Settings,
  SpeakingAttempt,
  SpeakingFeedback,
  TutorChatMessage,
  UserProgress,
  Word,
} from '../types';

const quickActions: Array<{ label: string; mode: AiCoachMode; text: string }> = [
  { label: 'Bugungi reja', mode: 'dailyCoach', text: 'Bugungi rejamni 5-10 daqiqalik qilib ber.' },
  { label: 'Xatolarim', mode: 'mistakes', text: 'Xatolarimni tushuntir va 3 ta repair mashq ber.' },
  { label: 'Menga quiz ber', mode: 'quiz', text: 'Shu listdagi sozlardan bitta quiz savol ber va javobimni kut.' },
  { label: 'Shu sozni tushuntir', mode: 'explain', text: 'Fokus sozni oddiy qilib tushuntir.' },
  { label: 'Misol gaplar', mode: 'examples', text: 'Fokus soz bilan 3 ta oddiy ruscha gap ber.' },
  { label: 'Qattiq motivatsiya', mode: 'strictMotivator', text: 'Progressimni tahlil qil va qattiqroq motivatsiya bilan 3 ta vazifa ber.' },
];

const modePrompts: Record<AiCoachMode, string> = {
  chat: 'Savolimga qisqa va aniq javob ber.',
  explain: 'Fokus sozni tushuntir.',
  examples: 'Fokus soz bilan misol gaplar ber.',
  quiz: 'Shu listdan bitta quiz savol ber.',
  mistakes: 'Xatolarimni tahlil qil.',
  dailyCoach: 'Bugungi oquv rejamni ber.',
  lessonFeedback: 'Darsim haqida feedback ber.',
  grammarHelp: 'Kerakli grammatikani tushuntir.',
  adaptivePlan: 'Menga adaptive plan tuz.',
  speakingPractice: 'Menga ruscha speaking savol ber. Javobimni bahola.',
  listeningPractice: 'Menga listening mashq ber: bitta ruscha gap ber, men tarjima qilaman.',
  ieltsSpeaking: 'IELTS Speaking Part 1 uslubida ruscha savol ber. Javobimni JSON bilan bahola.',
  rolePlay: "Dokonda xarid qilish role-play boshlang. Siz sotuvchi bo'ling.",
  audioConversation: 'Men bilan qisqa audio conversation boshlang.',
  strictMotivator: 'Meni qattiqroq, lekin hurmat bilan motivatsiya qil.',
};

type TutorContext =
  | { kind: 'today'; title: string }
  | { kind: 'mistakes'; title: string }
  | { kind: 'category'; title: string; category: Category }
  | { kind: 'page'; title: string; category: Category; page: number };

export function TutorPage({
  words,
  progress,
  settings,
  stats,
  savedMessages,
  addTutorMessage,
  clearTutorChat,
  addSpeakingAttempt,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  settings: Settings;
  stats: {
    learned: number;
    todayCount: number;
    accuracy: number;
    streak: number;
    hardWords: Word[];
  };
  savedMessages: TutorChatMessage[];
  addTutorMessage: (message: Omit<TutorChatMessage, 'created_at'>) => Promise<TutorChatMessage>;
  clearTutorChat: () => Promise<void>;
  addSpeakingAttempt: (attempt: SpeakingAttempt) => Promise<void>;
}) {
  const [mode, setMode] = useState<AiCoachMode>('chat');
  const [tone, setTone] = useState<CoachTone>(settings.ai.coachTone);
  const [context, setContext] = useState<TutorContext>({ kind: 'today', title: 'Bugungi dars' });
  const contextWords = useMemo(() => getContextWords(context, words, progress, settings), [context, progress, settings, words]);
  const focusWords = useMemo(() => (contextWords.length ? contextWords.slice(0, 80) : words.slice(0, 12)), [contextWords, words]);
  const [activeWordId, setActiveWordId] = useState('');
  const activeWord = words.find((word) => word.id === activeWordId) ?? focusWords[0];
  const [input, setInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('Что ты делал сегодня?');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [speechState, setSpeechState] = useState<SpeechRecognitionState>(() =>
    isSpeechRecognitionSupported() ? 'idle' : 'unsupported',
  );
  const [speechError, setSpeechError] = useState('');
  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer> | null>(null);

  useEffect(() => {
    setTone(settings.ai.coachTone);
  }, [settings.ai.coachTone]);

  useEffect(() => {
    setMessages(
      savedMessages.length
        ? savedMessages
        : [
            {
              id: 'welcome',
              role: 'assistant',
              text:
                "Salom. Men Ruscha Tez AI Coach'iman. Chat, Speaking, Listening, IELTS yoki Role Play tanlang. Ovoz bilan ham javob bera olasiz.",
            },
          ],
    );
  }, [savedMessages]);

  const pageOptions = useMemo(
    () =>
      CATEGORIES.flatMap((category) =>
        [...new Set(words.filter((word) => word.category === category.id).map((word) => word.page))].map((page) => ({
          category: category.id,
          title: `${category.title} - ${page}-varaq`,
          page,
        })),
      ),
    [words],
  );

  const wantsJson = mode === 'speakingPractice' || mode === 'ieltsSpeaking';
  const rolePlaySituation =
    mode === 'rolePlay'
      ? "Do'konda xarid qilish"
      : mode === 'listeningPractice'
        ? 'Listening: eshiting va tarjima qiling'
        : 'Speaking practice';

  function appendLocalMessage(message: TutorMessage) {
    setMessages((current) => [...current, message]);
  }

  async function saveMessage(message: TutorMessage) {
    await addTutorMessage(message);
    appendLocalMessage(message);
  }

  async function send(text: string, nextMode = mode, options: { wantsJson?: boolean } = {}) {
    if (!text.trim() || loading) return;
    const userMessage: TutorMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      text,
    };
    await saveMessage(userMessage);
    setInput('');
    setLoading(true);
    setFeedback(null);

    try {
      const shouldRequestJson =
        options.wantsJson ?? (nextMode === 'speakingPractice' || nextMode === 'ieltsSpeaking');
      const answer = await askTutor({
        message: text,
        mode: nextMode,
        tone,
        wantsJson: shouldRequestJson,
        answerLength: settings.ai.answerLength,
        context: {
          currentQuestion,
          speechLanguage: settings.ai.speechLanguage,
          ieltsScoring: settings.ai.ieltsScoring,
          strictCorrection: settings.ai.strictCorrection,
          dailyGoalXp: settings.ai,
        },
        word: activeWord,
        stats,
        contextTitle: context.title,
        contextWords: contextWords.slice(0, 40),
        history: messages.slice(-10),
        recentMistakes: stats.hardWords.map((word) => ({
          ...word,
          wrong_count: progress[word.id]?.wrong_count ?? 0,
        })),
      });

      const parsedFeedback = parseSpeakingFeedback(answer.answer);
      if (parsedFeedback) {
        setFeedback(parsedFeedback);
        setCurrentQuestion(parsedFeedback.nextQuestion_ru || currentQuestion);
        const summary = [
          `Score: ${parsedFeedback.score}/100, IELTS ${parsedFeedback.ieltsBand}`,
          parsedFeedback.motivation_uz,
          parsedFeedback.nextQuestion_ru ? `Keyingi savol: ${parsedFeedback.nextQuestion_ru}` : '',
        ].filter(Boolean).join('\n\n');
        const assistantMessage: TutorMessage = {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          text: summary,
        };
        await saveMessage(assistantMessage);
        await addSpeakingAttempt({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          created_at: new Date().toISOString(),
          mode: nextMode,
          question_ru: currentQuestion,
          user_transcript: text,
          feedback: parsedFeedback,
          score: parsedFeedback.score,
          ieltsBand: parsedFeedback.ieltsBand,
        });
        if (settings.ai.autoSpeak && parsedFeedback.nextQuestion_ru) {
          void speakText(parsedFeedback.nextQuestion_ru, { lang: 'ru-RU' });
        }
        return;
      }

      const parsed = parseAiResponse(answer.answer);
      const assistantText = parsed.kind === 'json' ? JSON.stringify(parsed.data, null, 2) : parsed.text;
      const assistantMessage: TutorMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        text: assistantText || 'AI bosh javob qaytardi. Qayta urinib koring.',
      };
      await saveMessage(assistantMessage);
      if (settings.ai.autoSpeak) void speakText(assistantMessage.text, { lang: nextMode === 'listeningPractice' ? 'ru-RU' : 'uz-UZ' });
    } catch {
      const errorMessage: TutorMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        text: 'AI Coach hozir javob bera olmadi. GEMINI_API_KEY yoki internet holatini tekshiring. Matnli mashqni davom ettirishingiz mumkin.',
      };
      await saveMessage(errorMessage);
    } finally {
      setLoading(false);
      setSpeechState(isSpeechRecognitionSupported() ? 'idle' : 'unsupported');
    }
  }

  function startSpeech() {
    if (!isSpeechRecognitionSupported()) {
      setSpeechState('unsupported');
      setSpeechError("Brauzeringiz ovozli javobni qo'llamayapti. Javobni yozma kiriting.");
      return;
    }

    setSpeechError('');
    setSpeechState('listening');
    const recognizer = createSpeechRecognizer({
      lang: settings.ai.speechLanguage,
      interimResults: true,
      onResult: (transcript, interim) => {
        if (transcript) setInput((current) => `${current} ${transcript}`.trim());
        if (interim) setSpeechError(`Eshitilmoqda: ${interim}`);
      },
      onError: (error) => {
        setSpeechState(error === 'unsupported' ? 'unsupported' : 'error');
        setSpeechError(
          error === 'not-allowed'
            ? 'Mikrofon permission rad etildi. Browser permissionni yoqing yoki javobni yozma kiriting.'
            : "Ovoz yozishda xato bo'ldi. Javobni yozma kiritishingiz mumkin.",
        );
      },
      onEnd: () => {
        setSpeechState((current) => (current === 'error' || current === 'unsupported' ? current : 'idle'));
      },
    });
    recognizerRef.current = recognizer;
    recognizer.start();
  }

  function stopSpeech() {
    setSpeechState('processing');
    recognizerRef.current?.stop();
  }

  async function startModePrompt(nextMode: AiCoachMode) {
    setMode(nextMode);
    const prompt = modePrompts[nextMode];
    if (nextMode === 'speakingPractice' || nextMode === 'ieltsSpeaking' || nextMode === 'listeningPractice' || nextMode === 'rolePlay') {
      await send(prompt, nextMode, { wantsJson: false });
    }
  }

  return (
    <>
      <PageHeader title="AI Coach" subtitle="Audio speaking, IELTS-style feedback, listening, role-play va strict motivator." />

      <section className="grid gap-4 xl:grid-cols-[390px_1fr]">
        <div className="space-y-4">
          <Card className="overflow-hidden bg-slate-950 text-white">
            <div className="rounded-2xl bg-gradient-to-br from-brand-500 via-blue-500 to-purple-600 p-4">
              <p className="text-sm font-bold opacity-85">Ruscha Tez AI Coach</p>
              <h2 className="mt-2 text-2xl font-black">{context.title}</h2>
              <p className="mt-2 text-sm opacity-90">{contextWords.length} ta soz kontekstda</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <MiniPill label="Aniqlik" value={`${stats.accuracy}%`} />
                <MiniPill label="Streak" value={`${stats.streak} kun`} />
                <MiniPill label="Organilgan" value={stats.learned} />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-black">Mode</h2>
            <div className="mt-3">
              <AiModeSelector value={mode} onChange={(next) => void startModePrompt(next)} />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-black">Coach tone</h2>
            <div className="mt-3">
              <CoachToneSelector value={tone} onChange={setTone} />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Strict tone motivatsion bo'ladi, lekin haqorat, kamsitish va profanity ishlatilmaydi.
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-black">Kontekst</h2>
            <select
              value={contextToValue(context)}
              onChange={(event) => setContext(valueToContext(event.target.value, pageOptions))}
              className="mt-3 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="today">Bugungi dars</option>
              <option value="mistakes">Xato sozlar</option>
              {CATEGORIES.map((category) => (
                <option key={category.id} value={`category:${category.id}`}>
                  {category.title}
                </option>
              ))}
              {pageOptions.map((option) => (
                <option key={`${option.category}:${option.page}`} value={`page:${option.category}:${option.page}`}>
                  {option.title}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-sm font-bold">
              Fokus soz
              <select
                value={activeWord?.id ?? ''}
                onChange={(event) => setActiveWordId(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950"
              >
                {focusWords.map((word) => (
                  <option key={word.id} value={word.id}>
                    {word.russian} - {word.uzbek}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button key={action.label} variant="secondary" className="px-2 text-xs" onClick={() => void send(action.text, action.mode)}>
                  {action.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {(mode === 'speakingPractice' || mode === 'ieltsSpeaking' || mode === 'audioConversation') ? (
            <Card className="border-brand-100 bg-brand-50 dark:border-brand-900 dark:bg-brand-950/30">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-brand-700 dark:text-brand-200">Ruscha savol</p>
                  <h2 className="mt-2 text-xl font-black">{currentQuestion}</h2>
                </div>
                <AudioButton text={currentQuestion} />
              </div>
            </Card>
          ) : null}

          {(mode === 'rolePlay' || mode === 'listeningPractice') ? <RolePlayCard situation={rolePlaySituation} /> : null}

          {feedback ? <SpeakingFeedbackCard feedback={feedback} /> : null}

          <Card className="flex min-h-[68vh] flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{messages.length} ta xabar saqlangan</p>
              <Button
                variant="ghost"
                className="min-h-10 px-3 py-2 text-xs"
                onClick={async () => {
                  await clearTutorChat();
                  setMessages([]);
                  setFeedback(null);
                }}
              >
                Chatni tozalash
              </Button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {messages.map((message) => (
                <AiCoachMessage key={message.id} role={message.role} text={message.text} />
              ))}
              {loading ? <div className="max-w-[80%] rounded-2xl bg-slate-100 p-3 text-sm font-bold dark:bg-slate-800">AI oylayapti...</div> : null}
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
              <div className="mb-3 flex items-center justify-between gap-3">
                <MicrophoneButton state={speechState} onStart={startSpeech} onStop={stopSpeech} />
                <VoiceWave active={speechState === 'listening' || loading} />
              </div>
              {speechError ? <p className="mb-2 text-xs font-bold text-amber-700 dark:text-amber-200">{speechError}</p> : null}
              {speechState === 'unsupported' ? (
                <p className="mb-2 text-xs text-slate-500">
                  Brauzeringiz ovozli javobni qo'llamayapti. Javobni yozma kiriting.
                </p>
              ) : null}

              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  void send(input);
                }}
              >
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Javobingizni yozing yoki mikrofon orqali ayting..."
                  rows={2}
                  className="min-h-14 flex-1 resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-950"
                />
                <Button disabled={loading || !input.trim()} className="px-5">
                  Yubor
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}

function MiniPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white/15 p-2">
      <p className="text-[10px] font-bold opacity-80">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

function getContextWords(
  context: TutorContext,
  words: Word[],
  progress: Record<string, UserProgress>,
  settings: Settings,
) {
  if (context.kind === 'today') return getTodayLesson(words, progress, settings);
  if (context.kind === 'mistakes') {
    return words
      .filter((word) => (progress[word.id]?.wrong_count ?? 0) > 0)
      .sort((a, b) => (progress[b.id]?.wrong_count ?? 0) - (progress[a.id]?.wrong_count ?? 0));
  }
  if (context.kind === 'category') return words.filter((word) => word.category === context.category);
  return words.filter((word) => word.category === context.category && word.page === context.page);
}

function contextToValue(context: TutorContext) {
  if (context.kind === 'category') return `category:${context.category}`;
  if (context.kind === 'page') return `page:${context.category}:${context.page}`;
  return context.kind;
}

function valueToContext(value: string, pageOptions: Array<{ category: Category; page: number; title: string }>): TutorContext {
  if (value === 'today') return { kind: 'today', title: 'Bugungi dars' };
  if (value === 'mistakes') return { kind: 'mistakes', title: 'Xato sozlar' };
  if (value.startsWith('category:')) {
    const category = value.split(':')[1] as Category;
    const meta = CATEGORIES.find((item) => item.id === category);
    return { kind: 'category', title: meta?.title ?? category, category };
  }
  const [, category, page] = value.split(':') as [string, Category, string];
  const option = pageOptions.find((item) => item.category === category && item.page === Number(page));
  return { kind: 'page', title: option?.title ?? `${category} - ${page}-varaq`, category, page: Number(page) };
}
