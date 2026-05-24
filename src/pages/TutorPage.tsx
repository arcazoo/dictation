import { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { askTutor, type TutorMessage } from '../lib/tutorApi';
import type { UserProgress, Word } from '../types';

const quickActions = [
  { label: 'Tushuntir', mode: 'explain', text: 'Bu so‘zni oson usulda tushuntirib ber.' },
  { label: 'Misol gap', mode: 'examples', text: 'Bu so‘z bilan oddiy ruscha gaplar tuzib ber.' },
  { label: 'Quiz ber', mode: 'quiz', text: 'Meni shu so‘z bo‘yicha tez quiz qil.' },
  { label: 'Xatolarim', mode: 'mistakes', text: 'Xatolarimni tahlil qilib, nimani takrorlashim kerakligini ayt.' },
] as const;

export function TutorPage({
  words,
  progress,
  stats,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  stats: {
    learned: number;
    todayCount: number;
    accuracy: number;
    streak: number;
    hardWords: Word[];
  };
}) {
  const focusWords = useMemo(() => {
    const hard = stats.hardWords;
    return hard.length ? hard : words.slice(0, 12);
  }, [stats.hardWords, words]);
  const [activeWordId, setActiveWordId] = useState(focusWords[0]?.id ?? '');
  const activeWord = words.find((word) => word.id === activeWordId) ?? focusWords[0];
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Salom. Men Ruscha Tez AI tutoriman. So‘z tanlang, savol bering yoki tezkor mashqni bosing.',
    },
  ]);

  async function send(text: string, mode: 'chat' | 'explain' | 'examples' | 'quiz' | 'mistakes' = 'chat') {
    if (!text.trim() || loading) return;
    const userMessage: TutorMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      text,
    };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const answer = await askTutor({
        message: text,
        mode,
        word: activeWord,
        stats,
        recentMistakes: stats.hardWords.map((word) => ({
          ...word,
          wrong_count: progress[word.id]?.wrong_count ?? 0,
        })),
      });
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          text: answer.answer,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          text: 'AI tutor hozir javob bera olmadi. Vercel’da OPENAI_API_KEY borligini tekshiring.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="AI Tutor" subtitle="Savol bering, gap tuzing, xatolarni tahlil qildiring va quiz oling." />

      <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <Card className="bg-brand-600 text-white dark:bg-brand-700">
            <p className="text-sm font-bold opacity-80">Bugungi AI fokus</p>
            <h2 className="mt-2 text-3xl font-black">{activeWord?.russian ?? 'So‘z yo‘q'}</h2>
            <p className="mt-2 text-lg font-bold opacity-95">{activeWord?.uzbek ?? ''}</p>
            <p className="mt-4 text-sm opacity-85">
              Aniqlik: {stats.accuracy}% · Streak: {stats.streak} kun · O‘rganilgan: {stats.learned}
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-black">Fokus so‘z</h2>
            <select
              value={activeWord?.id ?? ''}
              onChange={(event) => setActiveWordId(event.target.value)}
              className="mt-3 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950"
            >
              {focusWords.map((word) => (
                <option key={word.id} value={word.id}>
                  {word.russian} - {word.uzbek}
                </option>
              ))}
            </select>
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
            {loading ? (
              <div className="max-w-[80%] rounded-lg bg-slate-100 p-3 text-sm font-bold dark:bg-slate-800">AI o‘ylayapti...</div>
            ) : null}
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
              placeholder="Savol yozing..."
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
