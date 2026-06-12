import { useEffect, useMemo, useRef, useState } from 'react';
import { AiCoachMessage } from '../components/ai/AiCoachMessage';
import { MicrophoneButton } from '../components/ai/MicrophoneButton';
import { SpeakingFeedbackCard } from '../components/ai/SpeakingFeedbackCard';
import { VoiceWave } from '../components/ai/VoiceWave';
import { PrimaryActionButton } from '../components/ui/ActionButtons';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientCard } from '../components/ui/GradientCard';
import { Screen } from '../components/ui/Screen';
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
  Settings,
  SpeakingAttempt,
  SpeakingFeedback,
  TutorChatMessage,
  UserProgress,
  Word,
} from '../types';

const promptCards: Array<{ title: string; text: string; tone: string }> = [
  { title: 'Savol berish', text: "Shu mavzu bo'yicha ruscha so'zlarni tushuntir.", tone: 'from-brand-500 to-sky-500' },
  { title: 'Speaking mashq', text: 'Menga bitta oddiy ruscha speaking savol ber.', tone: 'from-violet-500 to-purple-500' },
  { title: 'Xatolarni tuzatish', text: 'Xatolarimni tushuntir va quiz qildir.', tone: 'from-rose-500 to-orange-500' },
  { title: 'Bugungi reja', text: 'Bugungi darsimni 10 daqiqalik qilib tuzib ber.', tone: 'from-slate-900 to-slate-700' },
];

const quickPrompts = [
  "Bugungi darsimni tuzib ber",
  "Menga 5 ta ruscha savol ber",
  "Xatolarimni tushuntir",
  "Men bilan do'konda role-play qil",
];

export function TutorPage({
  words,
  progress,
  settings,
  stats,
  savedMessages,
  addTutorMessage,
  clearTutorChat,
  addSpeakingAttempt,
  draftPrompt,
  clearDraftPrompt,
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
  draftPrompt?: string;
  clearDraftPrompt?: () => void;
}) {
  const [input, setInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('Что ты делал сегодня?');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [speechState, setSpeechState] = useState<SpeechRecognitionState>(() =>
    isSpeechRecognitionSupported() ? 'idle' : 'unsupported',
  );
  const [speechError, setSpeechError] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer> | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setMessages(
      savedMessages.length
        ? savedMessages
        : [
            {
              id: 'welcome',
              role: 'assistant',
              text:
                "Men ruscha so'zlarni tushuntiraman, xatolaringni tuzataman, speaking mashq qildiraman va bugungi rejangni tuzaman. Hech narsa tanlash shart emas, nima kerakligini yozing.",
            },
          ],
    );
  }, [savedMessages]);

  useEffect(() => {
    if (!draftPrompt) return;
    setInput(draftPrompt);
    clearDraftPrompt?.();
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, [clearDraftPrompt, draftPrompt]);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length, loading, feedback]);

  const todayWords = useMemo(() => getTodayLesson(words, progress, settings), [progress, settings, words]);
  const hardWords = stats.hardWords;

  async function saveMessage(message: TutorMessage) {
    await addTutorMessage(message);
    setMessages((current) => [...current, message]);
  }

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const request = inferRequest(text, words, progress, settings, todayWords, hardWords);
    const userMessage: TutorMessage = { id: `${Date.now()}-user`, role: 'user', text };
    await saveMessage(userMessage);
    setInput('');
    setLoading(true);
    setFeedback(null);
    resizeInput();

    try {
      const answer = await askTutor({
        message: text,
        mode: request.mode,
        tone: settings.ai.coachTone,
        wantsJson: request.wantsJson,
        answerLength: settings.ai.answerLength,
        context: {
          currentQuestion,
          autoDetected: request.title,
          speechLanguage: settings.ai.speechLanguage,
          ieltsScoring: settings.ai.ieltsScoring,
          strictCorrection: settings.ai.strictCorrection,
        },
        word: request.activeWord,
        stats,
        contextTitle: request.title,
        contextWords: request.contextWords.slice(0, 40),
        history: messages.slice(-10),
        recentMistakes: hardWords.map((word) => ({
          ...word,
          wrong_count: progress[word.id]?.wrong_count ?? 0,
        })),
      });

      const parsedFeedback = parseSpeakingFeedback(answer.answer);
      if (parsedFeedback) {
        setFeedback(parsedFeedback);
        setCurrentQuestion(parsedFeedback.nextQuestion_ru || currentQuestion);
        await saveMessage({
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          text: [
            `Score: ${parsedFeedback.score}/100, IELTS ${parsedFeedback.ieltsBand}`,
            parsedFeedback.motivation_uz,
            parsedFeedback.nextQuestion_ru ? `Keyingi savol: ${parsedFeedback.nextQuestion_ru}` : '',
          ].filter(Boolean).join('\n\n'),
        });
        await addSpeakingAttempt({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          created_at: new Date().toISOString(),
          mode: request.mode,
          question_ru: currentQuestion,
          user_transcript: text,
          feedback: parsedFeedback,
          score: parsedFeedback.score,
          ieltsBand: parsedFeedback.ieltsBand,
        });
        if (settings.ai.autoSpeak && parsedFeedback.nextQuestion_ru) void speakText(parsedFeedback.nextQuestion_ru, { lang: 'ru-RU' });
        return;
      }

      const parsed = parseAiResponse(answer.answer);
      const assistantText = parsed.kind === 'json' ? JSON.stringify(parsed.data, null, 2) : parsed.text;
      await saveMessage({
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        text: assistantText || "AI bosh javob qaytardi. Qayta urinib ko'ring.",
      });
      if (settings.ai.autoSpeak) void speakText(assistantText, { lang: request.mode === 'listeningPractice' ? 'ru-RU' : 'uz-UZ' });
    } catch {
      await saveMessage({
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        text: 'AI Coach hozir javob bera olmadi. Internet yoki GEMINI_API_KEY holatini tekshiring. Yozma mashqni davom ettirishingiz mumkin.',
      });
    } finally {
      setLoading(false);
      setSpeechState(isSpeechRecognitionSupported() ? 'idle' : 'unsupported');
    }
  }

  function resizeInput() {
    requestAnimationFrame(() => {
      const node = textareaRef.current;
      if (!node) return;
      node.style.height = 'auto';
      node.style.height = `${Math.min(160, Math.max(56, node.scrollHeight))}px`;
    });
  }

  function scrollToBottom(behavior: ScrollBehavior = 'auto') {
    endRef.current?.scrollIntoView({ behavior, block: 'end' });
  }

  function onScroll() {
    const node = listRef.current;
    if (!node) return;
    const distance = node.scrollHeight - node.scrollTop - node.clientHeight;
    setShowScrollButton(distance > 180);
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
        if (transcript) {
          setInput((current) => `${current} ${transcript}`.trim());
          resizeInput();
        }
        if (interim) setSpeechError(`Eshitilmoqda: ${interim}`);
      },
      onError: (error) => {
        setSpeechState(error === 'unsupported' ? 'unsupported' : 'error');
        setSpeechError(error === 'not-allowed' ? 'Mikrofon permission rad etildi. Browser permissionni yoqing.' : "Ovoz yozishda xato bo'ldi. Yozma kiriting.");
      },
      onEnd: () => setSpeechState((current) => (current === 'error' || current === 'unsupported' ? current : 'idle')),
    });
    recognizerRef.current = recognizer;
    recognizer.start();
  }

  function stopSpeech() {
    setSpeechState('processing');
    recognizerRef.current?.stop();
  }

  return (
    <Screen className="max-w-6xl">
      <GradientCard variant="violet">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase opacity-80">AI Coach</p>
            <h1 className="mt-2 text-3xl font-black sm:text-5xl">Nima kerakligini yozing</h1>
            <p className="mt-2 max-w-2xl text-sm font-bold opacity-85">
              So'z tushuntirish, speaking, quiz, xato tahlili yoki reja. Tanlash shart emas.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <MiniPill label="AI" value={navigator.onLine ? 'online' : 'offline'} />
            <MiniPill label="Streak" value={`${stats.streak} kun`} />
            <MiniPill label="Aniqlik" value={`${stats.accuracy}%`} />
          </div>
        </div>
      </GradientCard>

      <section className="grid gap-4 lg:grid-cols-4">
        {promptCards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={() => void send(card.text)}
            className={`min-h-28 rounded-3xl bg-gradient-to-br ${card.tone} p-4 text-left text-white shadow-soft transition active:scale-[0.98]`}
          >
            <p className="text-lg font-black">{card.title}</p>
            <p className="mt-2 text-xs font-bold opacity-80">{card.text}</p>
          </button>
        ))}
      </section>

      {feedback ? <SpeakingFeedbackCard feedback={feedback} /> : null}

      <GlassCard className="relative flex h-[72vh] min-h-[560px] flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 p-4 dark:border-slate-800">
          <div>
            <p className="text-lg font-black">Chat</p>
            <p className="text-xs font-bold text-slate-500">AI o'zi kontekstni aniqlaydi</p>
          </div>
          <button
            type="button"
            className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            onClick={async () => {
              await clearTutorChat();
              setMessages([]);
              setFeedback(null);
            }}
          >
            Tozalash
          </button>
        </div>

        <div ref={listRef} onScroll={onScroll} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((message) => <AiCoachMessage key={message.id} role={message.role} text={message.text} />)}
          {loading ? <div className="max-w-[80%] rounded-2xl bg-slate-100 p-3 text-sm font-bold dark:bg-slate-800">AI o'ylayapti...</div> : null}
          <div ref={endRef} />
        </div>

        {showScrollButton ? (
          <button
            type="button"
            onClick={() => scrollToBottom('smooth')}
            className="absolute bottom-28 right-4 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white shadow-soft dark:bg-white dark:text-slate-950"
          >
            Pastga
          </button>
        ) : null}

        <div className="border-t border-slate-200/70 bg-white/90 p-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="mb-2 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void send(prompt)}
                className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2 rounded-3xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <MicrophoneButton state={speechState} onStart={startSpeech} onStop={stopSpeech} />
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                resizeInput();
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void send(input);
                }
              }}
              placeholder="Masalan: shu bugungi so'zlardan quiz qil..."
              rows={1}
              className="max-h-40 min-h-14 flex-1 resize-none rounded-2xl bg-transparent px-2 py-4 text-base font-bold outline-none"
            />
            <PrimaryActionButton disabled={loading || !input.trim()} className="min-h-14 px-5" onClick={() => void send(input)}>
              Yubor
            </PrimaryActionButton>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              {speechError ? <p className="text-xs font-bold text-amber-700 dark:text-amber-200">{speechError}</p> : null}
              {speechState === 'unsupported' ? <p className="text-xs text-slate-500">Brauzeringiz ovozli javobni qo'llamayapti. Yozma kiriting.</p> : null}
            </div>
            <VoiceWave active={speechState === 'listening' || loading} />
          </div>
        </div>
      </GlassCard>
    </Screen>
  );
}

function inferRequest(
  text: string,
  words: Word[],
  progress: Record<string, UserProgress>,
  settings: Settings,
  todayWords: Word[],
  hardWords: Word[],
) {
  const normalized = text.toLowerCase();
  const category = CATEGORIES.find((item) => normalized.includes(item.title.toLowerCase()) || normalized.includes(item.id));
  const mistakes = words
    .filter((word) => (progress[word.id]?.wrong_count ?? 0) > 0)
    .sort((a, b) => (progress[b.id]?.wrong_count ?? 0) - (progress[a.id]?.wrong_count ?? 0));
  const activeWord = words.find((word) => normalized.includes(word.russian.toLowerCase()) || normalized.includes(word.uzbek.toLowerCase()));

  let contextWords = todayWords.length ? todayWords : words.slice(0, 40);
  let title = 'Auto context: bugungi dars';
  if (normalized.includes('xato') || normalized.includes('mistake')) {
    contextWords = mistakes.length ? mistakes : hardWords;
    title = "Auto context: xato so'zlar";
  } else if (category) {
    contextWords = words.filter((word) => word.category === category.id).slice(0, 80);
    title = `Auto context: ${category.title}`;
  } else if (normalized.includes('shu') || normalized.includes('bugungi') || normalized.includes('list')) {
    contextWords = todayWords.length ? todayWords : getTodayLesson(words, progress, settings);
    title = 'Auto context: bugungi list';
  }

  let mode: AiCoachMode = 'chat';
  let wantsJson = false;
  if (normalized.includes('ielts') || normalized.includes('bahola') || normalized.includes('speaking') || normalized.includes('gapir')) {
    mode = normalized.includes('ielts') || normalized.includes('bahola') ? 'ieltsSpeaking' : 'speakingPractice';
    wantsJson = normalized.includes('bahola') || normalized.includes('javobim');
  } else if (normalized.includes('quiz') || normalized.includes('test') || normalized.includes('savol')) {
    mode = 'quiz';
  } else if (normalized.includes('listening') || normalized.includes('eshit')) {
    mode = 'listeningPractice';
  } else if (normalized.includes('role') || normalized.includes("do'kon") || normalized.includes('restoran')) {
    mode = 'rolePlay';
  } else if (normalized.includes('reja') || normalized.includes('dars')) {
    mode = 'dailyCoach';
  } else if (normalized.includes('misol')) {
    mode = 'examples';
  } else if (
    normalized.includes('qoida') ||
    normalized.includes('gram') ||
    normalized.includes('grammatika') ||
    normalized.includes('kelishik') ||
    normalized.includes("fe'l") ||
    normalized.includes('fel') ||
    normalized.includes('rod') ||
    normalized.includes('zamon')
  ) {
    mode = 'grammarHelp';
  } else if (normalized.includes('tushuntir')) {
    mode = 'explain';
  }

  return { mode, wantsJson, contextWords, activeWord, title };
}

function MiniPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white/15 p-2">
      <p className="text-[10px] font-bold opacity-80">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}
