import { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { CATEGORIES } from '../data/categories';
import { getTodayLesson } from '../lib/lesson';
import { askTutor, type TutorMessage } from '../lib/tutorApi';
import type { Category, Settings, TutorChatMessage, UserProgress, Word } from '../types';

const quickActions = [
  { label: 'List quiz', mode: 'quiz', text: 'Shu listdagi sozlardan savol-javob qil. Bitta savol ber va javobimni kut.' },
  { label: 'Tushuntir', mode: 'explain', text: 'Shu listdagi eng muhim sozlarni oson qilib tushuntir.' },
  { label: 'Misol gap', mode: 'examples', text: 'Shu listdagi sozlardan oddiy ruscha gaplar tuzib ber.' },
  { label: 'Xatolarim', mode: 'mistakes', text: 'Xatolarim va shu list asosida nimani takrorlashim kerakligini ayt.' },
] as const;

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
}) {
  const [context, setContext] = useState<TutorContext>({ kind: 'today', title: 'Bugungi dars' });
  const contextWords = useMemo(() => getContextWords(context, words, progress, settings), [context, progress, settings, words]);
  const focusWords = useMemo(() => (contextWords.length ? contextWords.slice(0, 60) : words.slice(0, 12)), [contextWords, words]);
  const [activeWordId, setActiveWordId] = useState('');
  const activeWord = words.find((word) => word.id === activeWordId) ?? focusWords[0];
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([]);

  useEffect(() => {
    setMessages(
      savedMessages.length
        ? savedMessages
        : [
            {
              id: 'welcome',
              role: 'assistant',
              text: 'Salom. Men Ruscha Tez AI tutoriman. List tanlang, keyin shu list boyicha savol-javob qilamiz.',
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

  async function send(text: string, mode: 'chat' | 'explain' | 'examples' | 'quiz' | 'mistakes' = 'chat') {
    if (!text.trim() || loading) return;
    const userMessage: TutorMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      text,
    };
    await addTutorMessage(userMessage);
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const answer = await askTutor({
        message: text,
        mode,
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
      const assistantMessage: TutorMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        text: answer.answer,
      };
      await addTutorMessage(assistantMessage);
      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch {
      const errorMessage: TutorMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        text: 'AI tutor hozir javob bera olmadi. Vercel env ichida GEMINI_API_KEY borligini tekshiring.',
      };
      await addTutorMessage(errorMessage);
      setMessages((current) => [
        ...current,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="AI Tutor" subtitle="Bugungi dars, xatolar yoki tanlangan list boyicha AI bilan savol-javob qiling." />

      <section className="grid gap-4 xl:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <Card className="bg-brand-600 text-white dark:bg-brand-700">
            <p className="text-sm font-bold opacity-80">AI kontekst</p>
            <h2 className="mt-2 text-2xl font-black">{context.title}</h2>
            <p className="mt-2 text-sm opacity-90">{contextWords.length} ta soz bilan ishlaydi</p>
            <p className="mt-4 text-sm opacity-85">
              Aniqlik: {stats.accuracy}% · Streak: {stats.streak} kun · Organilgan: {stats.learned}
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-black">List tanlash</h2>
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
                <Button key={action.mode} variant="secondary" className="px-2 text-xs" onClick={() => send(action.text, action.mode)}>
                  {action.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        <Card className="flex min-h-[70vh] flex-col">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{messages.length} ta xabar saqlangan</p>
            <Button
              variant="ghost"
              className="min-h-10 px-3 py-2 text-xs"
              onClick={async () => {
                await clearTutorChat();
                setMessages([]);
              }}
            >
              Chatni tozalash
            </Button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[92%] rounded-lg p-3 text-sm leading-6 ${
                  message.role === 'user'
                    ? 'ml-auto bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50'
                }`}
              >
                {message.text.split('\n').map((line, index) => (
                  <p key={`${message.id}-${index}`} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            ))}
            {loading ? <div className="max-w-[80%] rounded-lg bg-slate-100 p-3 text-sm font-bold dark:bg-slate-800">AI oylayapti...</div> : null}
          </div>

          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Masalan: shu listdan meni test qil..."
              className="min-h-12 flex-1 rounded-lg border border-slate-300 bg-white px-4 outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-950"
            />
            <Button disabled={loading || !input.trim()} className="px-5">
              Yubor
            </Button>
          </form>
        </Card>
      </section>
    </>
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
