import { useEffect, useMemo, useRef, useState } from 'react';
import { AiCoachMessage } from '../components/ai/AiCoachMessage';
import { AudioButton } from '../components/ai/AudioButton';
import { MicrophoneButton } from '../components/ai/MicrophoneButton';
import { SpeakingFeedbackCard } from '../components/ai/SpeakingFeedbackCard';
import { VoiceWave } from '../components/ai/VoiceWave';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientCard } from '../components/ui/GradientCard';
import { PillTabs } from '../components/ui/PillTabs';
import { Screen } from '../components/ui/Screen';
import { SectionHeader } from '../components/ui/SectionHeader';
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
  Settings,
  SpeakingAttempt,
  SpeakingFeedback,
  TutorChatMessage,
  UserProgress,
  Word,
} from '../types';

type AiMainTab = 'chat' | 'speaking' | 'practice' | 'plan';

const tabs: Array<{ id: AiMainTab; label: string }> = [
  { id: 'chat', label: 'Suhbat' },
  { id: 'speaking', label: 'Speaking' },
  { id: 'practice', label: 'Mashq' },
  { id: 'plan', label: 'Reja' },
];

const quickActions: Record<AiMainTab, Array<{ label: string; mode: AiCoachMode; text: string; json?: boolean }>> = {
  chat: [
    { label: "So'zni tushuntir", mode: 'explain', text: 'Fokus sozni qisqa va sodda tushuntir.' },
    { label: 'Misol gap ber', mode: 'examples', text: 'Fokus soz bilan 3 ta oddiy ruscha misol gap ber.' },
    { label: 'Tarjima qilib ber', mode: 'chat', text: 'Matnimni ruscha-o‘zbekcha tarjima qilishga yordam ber.' },
    { label: 'Qoidani tushuntir', mode: 'grammarHelp', text: 'Kerakli rus tili qoidasini sodda tushuntir.' },
  ],
  speaking: [
    { label: 'Oddiy speaking', mode: 'speakingPractice', text: 'Menga bitta oddiy ruscha speaking savol ber.', json: false },
    { label: 'IELTS uslubida bahola', mode: 'ieltsSpeaking', text: 'IELTS Speaking Part 1 uslubida savol ber. Javobimni keyin bahola.', json: false },
    { label: 'Role play boshlash', mode: 'rolePlay', text: "Do'konda xarid qilish role-play boshlang. Siz sotuvchi bo'ling.", json: false },
    { label: 'Javobimni tuzat', mode: 'speakingPractice', text: 'Mening ruscha javobimni grammar, vocabulary va fluency bo‘yicha tuzat.', json: true },
  ],
  practice: [
    { label: 'Xatolarimdan quiz', mode: 'mistakes', text: 'Xatolarimdan bitta quiz boshlang va javobimni kuting.' },
    { label: 'Listening mashq', mode: 'listeningPractice', text: 'Bitta qisqa ruscha listening mashq bering.' },
    { label: '5 ta tezkor savol', mode: 'quiz', text: 'Shu listdan 5 ta tezkor savol bilan mashq qildiring.' },
    { label: 'Grammatikani tekshir', mode: 'grammarHelp', text: 'Menga bitta mini grammar practice bering.' },
  ],
  plan: [
    { label: 'Bugungi reja', mode: 'dailyCoach', text: 'Bugungi darsimni 10 daqiqalik qilib tuzib ber.' },
    { label: 'Qiyin so‘zlarim', mode: 'adaptivePlan', text: 'Qiyin so‘zlarim bo‘yicha keyingi mashq rejasini ber.' },
    { label: 'Xatolarim tahlili', mode: 'mistakes', text: 'Xatolarimni tahlil qilib, 3 ta aniq vazifa ber.' },
    { label: '10 daqiqalik dars', mode: 'lessonFeedback', text: 'Hozir 10 daqiqada nima qilishim kerakligini ayt.' },
  ],
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
  const [tab, setTab] = useState<AiMainTab>('chat');
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
    setMessages(
      savedMessages.length
        ? savedMessages
        : [
            {
              id: 'welcome',
              role: 'assistant',
              text:
                "Men senga ruscha so'zlarni tushuntiraman, xatolaringni tuzataman va speaking mashq qildiraman. Nimadan boshlaymiz?",
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

  async function saveMessage(message: TutorMessage) {
    await addTutorMessage(message);
    setMessages((current) => [...current, message]);
  }

  async function send(text: string, mode: AiCoachMode = modeForTab(tab), wantsJson = tab === 'speaking') {
    if (!text.trim() || loading) return;
    const userMessage: TutorMessage = { id: `${Date.now()}-user`, role: 'user', text };
    await saveMessage(userMessage);
    setInput('');
    setLoading(true);
    setFeedback(null);

    try {
      const answer = await askTutor({
        message: text,
        mode,
        tone: settings.ai.coachTone,
        wantsJson,
        answerLength: settings.ai.answerLength,
        context: {
          currentQuestion,
          mainTab: tab,
          speechLanguage: settings.ai.speechLanguage,
          ieltsScoring: settings.ai.ieltsScoring,
          strictCorrection: settings.ai.strictCorrection,
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
        const assistantText = [
          `Score: ${parsedFeedback.score}/100, IELTS ${parsedFeedback.ieltsBand}`,
          parsedFeedback.motivation_uz,
          parsedFeedback.nextQuestion_ru ? `Keyingi savol: ${parsedFeedback.nextQuestion_ru}` : '',
        ].filter(Boolean).join('\n\n');
        await saveMessage({ id: `${Date.now()}-assistant`, role: 'assistant', text: assistantText });
        await addSpeakingAttempt({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          created_at: new Date().toISOString(),
          mode,
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
        text: assistantText || 'AI bosh javob qaytardi. Qayta urinib ko‘ring.',
      });
      if (settings.ai.autoSpeak) void speakText(assistantText, { lang: mode === 'listeningPractice' ? 'ru-RU' : 'uz-UZ' });
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
    <Screen className="max-w-7xl">
      <GradientCard variant="violet">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase opacity-80">AI Coach</p>
            <h1 className="mt-2 text-3xl font-black sm:text-5xl">Bugun ruscha gapiramizmi?</h1>
            <p className="mt-2 max-w-2xl text-sm font-bold opacity-85">Ruscha gapirish, xato tuzatish va kunlik reja.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <MiniPill label="AI" value={navigator.onLine ? 'online' : 'offline'} />
            <MiniPill label="Streak" value={`${stats.streak} kun`} />
            <MiniPill label="Aniqlik" value={`${stats.accuracy}%`} />
          </div>
        </div>
      </GradientCard>

      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <GlassCard>
            <PillTabs value={tab} items={tabs} onChange={setTab} />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {quickActions[tab].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => void send(action.text, action.mode, action.json ?? (tab === 'speaking' && action.mode === 'speakingPractice'))}
                  className="min-h-16 rounded-2xl bg-slate-50 p-3 text-left text-sm font-black shadow-soft transition active:scale-[0.98] dark:bg-slate-950"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <SectionHeader title="Kontekst" subtitle={context.title} />
            <select
              value={contextToValue(context)}
              onChange={(event) => setContext(valueToContext(event.target.value, pageOptions))}
              className="mt-3 min-h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-3 outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="today">Bugungi dars</option>
              <option value="mistakes">Xato so'zlar</option>
              {CATEGORIES.map((category) => <option key={category.id} value={`category:${category.id}`}>{category.title}</option>)}
              {pageOptions.map((option) => <option key={`${option.category}:${option.page}`} value={`page:${option.category}:${option.page}`}>{option.title}</option>)}
            </select>
            <select
              value={activeWord?.id ?? ''}
              onChange={(event) => setActiveWordId(event.target.value)}
              className="mt-3 min-h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-3 outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
            >
              {focusWords.map((word) => <option key={word.id} value={word.id}>{word.russian} - {word.uzbek}</option>)}
            </select>
          </GlassCard>

          {tab === 'plan' ? (
            <GlassCard>
              <SectionHeader title="Bugungi progress" subtitle={`${stats.todayCount} javob / ${stats.accuracy}% aniqlik`} />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <SecondaryActionButton onClick={() => void send('Bugungi darsimni tuzib ber.', 'dailyCoach', false)}>Reja ber</SecondaryActionButton>
                <PrimaryActionButton onClick={() => void send('Xatolarimni tahlil qilib 3 ta vazifa ber.', 'mistakes', false)}>Xatolar</PrimaryActionButton>
              </div>
            </GlassCard>
          ) : null}
        </aside>

        <main className="space-y-4">
          {tab === 'speaking' ? (
            <GlassCard className="border-brand-100 bg-brand-50 dark:border-brand-900 dark:bg-brand-950/30">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-brand-700 dark:text-brand-200">Ruscha javob bering</p>
                  <h2 className="mt-2 text-xl font-black">{currentQuestion}</h2>
                  <p className="mt-1 text-sm text-slate-500">Mikrofonda ayting yoki pastdagi maydonga yozing.</p>
                </div>
                <AudioButton text={currentQuestion} />
              </div>
            </GlassCard>
          ) : null}

          {tab === 'practice' ? (
            <GlassCard>
              <SectionHeader title="Mashq markazi" subtitle="Quiz, listening, xato va grammar mini-practice." />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {quickActions.practice.map((action) => (
                  <button key={action.label} type="button" onClick={() => void send(action.text, action.mode, false)} className="rounded-3xl bg-slate-50 p-4 text-left shadow-soft dark:bg-slate-950">
                    <p className="font-black">{action.label}</p>
                    <p className="mt-1 text-sm text-slate-500">AI shu turdagi mashqni chatda boshlaydi.</p>
                  </button>
                ))}
              </div>
            </GlassCard>
          ) : null}

          {feedback ? <SpeakingFeedbackCard feedback={feedback} /> : null}

          <GlassCard className="flex min-h-[64vh] flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{messages.length} ta xabar</p>
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

            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {messages.map((message) => <AiCoachMessage key={message.id} role={message.role} text={message.text} />)}
              {loading ? <div className="max-w-[80%] rounded-2xl bg-slate-100 p-3 text-sm font-bold dark:bg-slate-800">AI o'ylayapti...</div> : null}
            </div>

            <div className="mt-4 rounded-3xl border border-slate-200 p-3 dark:border-slate-800">
              {tab === 'speaking' ? (
                <div className="mb-3 flex items-center justify-between gap-3">
                  <MicrophoneButton state={speechState} onStart={startSpeech} onStop={stopSpeech} />
                  <VoiceWave active={speechState === 'listening' || loading} />
                </div>
              ) : null}
              {speechError ? <p className="mb-2 text-xs font-bold text-amber-700 dark:text-amber-200">{speechError}</p> : null}
              {speechState === 'unsupported' && tab === 'speaking' ? (
                <p className="mb-2 text-xs text-slate-500">Brauzeringiz ovozli javobni qo'llamayapti. Javobni yozma kiriting.</p>
              ) : null}
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  void send(input, modeForTab(tab), tab === 'speaking');
                }}
              >
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={placeholder(tab)}
                  rows={2}
                  className="min-h-14 flex-1 resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
                />
                <PrimaryActionButton disabled={loading || !input.trim()} className="px-5">Yubor</PrimaryActionButton>
              </form>
            </div>
          </GlassCard>
        </main>
      </div>
    </Screen>
  );
}

function modeForTab(tab: AiMainTab): AiCoachMode {
  if (tab === 'speaking') return 'speakingPractice';
  if (tab === 'practice') return 'quiz';
  if (tab === 'plan') return 'dailyCoach';
  return 'chat';
}

function placeholder(tab: AiMainTab) {
  if (tab === 'speaking') return 'Ruscha javobingizni yozing yoki mikrofon orqali ayting...';
  if (tab === 'practice') return 'Masalan: xatolarimdan quiz ber...';
  if (tab === 'plan') return 'Masalan: bugungi darsimni tuzib ber...';
  return 'Savol yozing...';
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
  if (value === 'mistakes') return { kind: 'mistakes', title: "Xato so'zlar" };
  if (value.startsWith('category:')) {
    const category = value.split(':')[1] as Category;
    const meta = CATEGORIES.find((item) => item.id === category);
    return { kind: 'category', title: meta?.title ?? category, category };
  }
  const [, category, page] = value.split(':') as [string, Category, string];
  const option = pageOptions.find((item) => item.category === category && item.page === Number(page));
  return { kind: 'page', title: option?.title ?? `${category} - ${page}-varaq`, category, page: Number(page) };
}
