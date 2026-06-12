import { useEffect, useMemo, useState } from 'react';
import { AudioButton } from '../components/ai/AudioButton';
import { EmptyState } from '../components/ui/EmptyState';
import { Icon } from '../components/ui/icons';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Screen } from '../components/ui/Screen';
import { getWordsForSource } from '../lib/source';
import type { ReviewResult, Settings, StudySource, UserProgress, Word } from '../types';

export function StudyPage({
  words,
  progress,
  settings,
  source,
  reviewWord,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  settings: Settings;
  source: StudySource;
  reviewWord: (word: Word, result: ReviewResult, mode: 'flashcard') => Promise<void>;
}) {
  const lesson = useMemo(() => getWordsForSource(source, words, progress, settings), [progress, settings, source, words]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const word = lesson[index];
  const percent = lesson.length ? Math.round((index / lesson.length) * 100) : 0;

  useEffect(() => {
    setIndex(0);
    setRevealed(false);
  }, [source]);

  async function answer(result: ReviewResult) {
    if (!word) return;
    await reviewWord(word, result, 'flashcard');
    setRevealed(false);
    setIndex((value) => Math.min(value + 1, lesson.length));
  }

  if (!word) {
    return (
      <Screen>
        <EmptyState title={source.title} text="Bu ro'yxat yakunlandi. Boshqa list tanlang yoki keyingi takror vaqtini kuting." />
      </Screen>
    );
  }

  return (
    <Screen className="max-w-xl">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
          <Icon name="cards" size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black">{source.title}</p>
          <ProgressBar value={percent} className="mt-1.5" />
        </div>
        <span className="shrink-0 text-xs font-black text-slate-400">
          {index + 1}/{lesson.length}
        </span>
      </div>

      {/* Karta */}
      <button
        type="button"
        onClick={() => setRevealed((value) => !value)}
        className={`relative min-h-[22rem] w-full rounded-2xl border-2 border-b-8 p-5 text-center transition-all active:translate-y-[3px] active:border-b-4 ${
          revealed
            ? 'border-brand-600/35 bg-brand-50 dark:border-brand-500/35 dark:bg-brand-950/40'
            : 'border-ink-900/10 bg-white dark:border-white/10 dark:bg-ink-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="rounded-xl bg-ink-50 px-3 py-1.5 text-[11px] font-black text-slate-500 dark:bg-ink-900 dark:text-slate-400">
            {word.category_ru} · {word.page}-varaq
          </span>
          <AudioButton text={word.russian} />
        </div>
        <div className="grid min-h-64 place-items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              {revealed ? 'Tarjima' : "Ruscha so'z"}
            </p>
            <h2 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">{revealed ? word.uzbek : word.russian}</h2>
            <p className="mt-4 text-sm font-bold text-slate-400">
              {revealed ? word.russian : 'Eslang — keyin kartani bosing'}
            </p>
          </div>
        </div>
      </button>

      {/* Javob tugmalari */}
      {revealed ? (
        <div className="grid grid-cols-3 gap-2">
          <AnswerButton tone="border-danger-800 bg-danger-600" onClick={() => answer('unknown')}>
            Bilmayman
          </AnswerButton>
          <AnswerButton tone="border-warn-600 bg-warn-500" onClick={() => answer('hard')}>
            Qiyin
          </AnswerButton>
          <AnswerButton tone="border-success-800 bg-success-600" onClick={() => answer('known')}>
            Bilaman
          </AnswerButton>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <AnswerButton tone="border-brand-800 bg-brand-600" onClick={() => setRevealed(true)}>
            Tarjimani ko'rish
          </AnswerButton>
          <button
            type="button"
            onClick={() => setIndex((value) => Math.min(value + 1, lesson.length))}
            className="min-h-14 rounded-2xl border-2 border-b-4 border-ink-900/15 bg-white px-5 text-sm font-black uppercase text-slate-500 transition active:translate-y-[2px] active:border-b-2 dark:border-white/15 dark:bg-ink-800 dark:text-slate-400"
          >
            O'tkazish
          </button>
        </div>
      )}
    </Screen>
  );
}

function AnswerButton({ tone, children, onClick }: { tone: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-14 rounded-2xl border-b-4 px-3 text-sm font-black uppercase tracking-wide text-white transition active:translate-y-[2px] active:border-b-2 ${tone}`}
    >
      {children}
    </button>
  );
}
