import { useEffect, useMemo, useState } from 'react';
import { AudioButton } from '../components/ai/AudioButton';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { GlassCard } from '../components/ui/GlassCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Screen } from '../components/ui/Screen';
import { EmptyState } from '../components/ui/EmptyState';
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
        <EmptyState title={source.title} text="Bu ro'yxat yakunlandi. Boshqa list tanlang yoki keyingi review vaqtini kuting." />
      </Screen>
    );
  }

  return (
    <Screen className="max-w-4xl">
      <GlassCard>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-brand-600">{source.title}</p>
            <h1 className="mt-1 text-2xl font-black">Flashcard practice</h1>
          </div>
          <span className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-black text-white dark:bg-white dark:text-slate-950">{index + 1}/{lesson.length}</span>
        </div>
        <ProgressBar value={percent} className="mt-4" />
      </GlassCard>

      <button
        type="button"
        onClick={() => setRevealed((value) => !value)}
        className="group min-h-[24rem] rounded-[2rem] bg-gradient-to-br from-white to-brand-50 p-4 text-center shadow-soft ring-1 ring-white transition hover:-translate-y-1 dark:from-slate-900 dark:to-slate-800 dark:ring-slate-800"
      >
        <div className="flex items-center justify-between">
          <span className="rounded-2xl bg-brand-100 px-3 py-2 text-xs font-black text-brand-700 dark:bg-brand-950 dark:text-brand-100">{word.category_ru} / {word.page}-varaq</span>
          <AudioButton text={word.russian} />
        </div>
        <div className="grid min-h-72 place-items-center">
          <div>
            <p className="text-sm font-black uppercase text-slate-400">{revealed ? 'Tarjima' : 'Ruscha so\'z'}</p>
            <h2 className="mt-4 text-5xl font-black tracking-tight sm:text-7xl">{revealed ? word.uzbek : word.russian}</h2>
            <p className="mt-5 text-sm font-bold text-slate-500">{revealed ? word.russian : "Eslang, keyin tarjimani oching"}</p>
          </div>
        </div>
      </button>

      <div className="grid gap-3 sm:grid-cols-3">
        {revealed ? (
          <>
            <PrimaryActionButton onClick={() => answer('known')}>Bilaman</PrimaryActionButton>
            <SecondaryActionButton onClick={() => answer('hard')}>Qiyin</SecondaryActionButton>
            <button className="min-h-14 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 px-5 text-sm font-black text-white shadow-soft" onClick={() => answer('unknown')}>Bilmayman</button>
          </>
        ) : (
          <>
            <PrimaryActionButton className="sm:col-span-2" onClick={() => setRevealed(true)}>Tarjimasini ko'rish</PrimaryActionButton>
            <SecondaryActionButton onClick={() => setIndex((value) => Math.min(value + 1, lesson.length))}>O'tkazish</SecondaryActionButton>
          </>
        )}
      </div>
    </Screen>
  );
}
