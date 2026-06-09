import { useMemo, useState } from 'react';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { EmptyState } from '../components/ui/EmptyState';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientCard } from '../components/ui/GradientCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Screen } from '../components/ui/Screen';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatCard } from '../components/ui/StatCard';
import { CATEGORIES } from '../data/categories';
import { formatShortDate } from '../lib/date';
import type { Category, UserProgress, Word } from '../types';

type Filter = 'all' | 'due' | 'hard' | Category;

export function ErrorsPage({
  words,
  progress,
  startMistakes,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  startMistakes: () => void;
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const mistakes = useMemo(() => words
    .filter((word) => (progress[word.id]?.wrong_count ?? 0) > 0)
    .sort((a, b) => (progress[b.id]?.wrong_count ?? 0) - (progress[a.id]?.wrong_count ?? 0)), [progress, words]);
  const today = new Date().toISOString();
  const due = mistakes.filter((word) => (progress[word.id]?.next_review ?? '') <= today);
  const hard = mistakes.filter((word) => (progress[word.id]?.wrong_count ?? 0) >= 2);
  const filtered = mistakes.filter((word) => {
    if (filter === 'all') return true;
    if (filter === 'due') return (progress[word.id]?.next_review ?? '') <= today;
    if (filter === 'hard') return (progress[word.id]?.wrong_count ?? 0) >= 2;
    return word.category === filter;
  });

  return (
    <Screen>
      <GradientCard variant="amber">
        <p className="text-sm font-black uppercase opacity-80">Mistake Repair Center</p>
        <h1 className="mt-2 text-3xl font-black sm:text-5xl">Xatolarni tuzatish markazi</h1>
        <p className="mt-2 max-w-2xl text-sm font-bold opacity-85">Qiyin so'zlar, due review va category weakness shu yerda jamlanadi.</p>
        <PrimaryActionButton className="mt-5 bg-white text-amber-700 shadow-soft" onClick={startMistakes} disabled={!mistakes.length}>
          Repair session boshlash
        </PrimaryActionButton>
      </GradientCard>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Xato so'zlar" value={mistakes.length} tone="rose" />
        <StatCard label="Bugun review" value={due.length} tone="amber" />
        <StatCard label="Eng qiyin" value={hard.length} tone="violet" />
        <StatCard label="Top word" value={mistakes[0]?.russian ?? '-'} tone="sky" />
      </section>

      <GlassCard>
        <SectionHeader title="Filterlar" subtitle="Qaysi xatolar bilan ishlashni tanlang." />
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Hammasi' },
            { id: 'due', label: 'Bugun review' },
            { id: 'hard', label: 'Eng qiyin' },
            ...CATEGORIES.map((category) => ({ id: category.id, label: category.title })),
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id as Filter)}
              className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                filter === item.id ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {filtered.length ? (
        <section className="grid gap-3 lg:grid-cols-2">
          {filtered.slice(0, 80).map((word) => {
            const item = progress[word.id];
            const confidence = item?.confidence ?? Math.max(0, 100 - (item?.wrong_count ?? 0) * 12);
            return (
              <GlassCard key={word.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-2xl font-black">{word.russian}</p>
                    <p className="mt-1 text-sm font-bold text-slate-500">{word.uzbek}</p>
                    <p className="mt-2 text-xs text-slate-500">{word.category_ru} / {word.page}-varaq</p>
                  </div>
                  <span className="rounded-2xl bg-rose-50 px-3 py-2 text-sm font-black text-rose-700 dark:bg-rose-950 dark:text-rose-100">x{item?.wrong_count ?? 0}</span>
                </div>
                <ProgressBar value={confidence} tone={confidence < 45 ? 'rose' : 'amber'} className="mt-4" />
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <p>Oxirgi: {formatShortDate(item?.last_seen)}</p>
                  <p>Keyingi: {formatShortDate(item?.next_review)}</p>
                </div>
                <SecondaryActionButton className="mt-4 w-full" onClick={startMistakes}>Quick practice</SecondaryActionButton>
              </GlassCard>
            );
          })}
        </section>
      ) : (
        <EmptyState title="Xato topilmadi" text="Hozircha bu filter bo'yicha xato so'z yo'q." />
      )}
    </Screen>
  );
}
