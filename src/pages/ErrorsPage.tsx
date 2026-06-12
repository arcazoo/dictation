import { useMemo, useState } from 'react';
import { PrimaryActionButton } from '../components/ui/ActionButtons';
import { EmptyState } from '../components/ui/EmptyState';
import { GlassCard } from '../components/ui/GlassCard';
import { Icon } from '../components/ui/icons';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Screen } from '../components/ui/Screen';
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
  const mistakes = useMemo(
    () =>
      words
        .filter((word) => (progress[word.id]?.wrong_count ?? 0) > 0)
        .sort((a, b) => (progress[b.id]?.wrong_count ?? 0) - (progress[a.id]?.wrong_count ?? 0)),
    [progress, words],
  );
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
    <Screen className="max-w-2xl">
      <GlassCard className="!p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black">Xatolar ustaxonasi</h1>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {mistakes.length} xato · {due.length} tasi bugun takrorga tayyor
            </p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-danger-100 text-danger-600 dark:bg-rose-950 dark:text-rose-300">
            <Icon name="wrench" size={22} />
          </span>
        </div>
        <PrimaryActionButton className="mt-4 w-full" onClick={startMistakes} disabled={!mistakes.length}>
          Tuzatish sessiyasini boshlash
        </PrimaryActionButton>
      </GlassCard>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all' as Filter, label: `Hammasi (${mistakes.length})` },
          { id: 'due' as Filter, label: `Bugun (${due.length})` },
          { id: 'hard' as Filter, label: `Eng qiyin (${hard.length})` },
          ...CATEGORIES.map((category) => ({ id: category.id as Filter, label: category.title })),
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-xl border-2 px-3.5 py-2 text-xs font-black transition active:scale-95 ${
              filter === item.id
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-ink-900/10 bg-white text-slate-500 dark:border-white/10 dark:bg-ink-800 dark:text-slate-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="space-y-2.5">
          {filtered.slice(0, 80).map((word) => {
            const item = progress[word.id];
            const confidence = item?.confidence ?? Math.max(0, 100 - (item?.wrong_count ?? 0) * 12);
            return (
              <div
                key={word.id}
                className="rounded-2xl border-2 border-ink-900/[0.08] bg-white p-4 shadow-hard dark:border-white/[0.08] dark:bg-ink-800 dark:shadow-hard-dark"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xl font-black">{word.russian}</p>
                    <p className="truncate text-sm font-bold text-slate-500 dark:text-slate-400">{word.uzbek}</p>
                  </div>
                  <span className="shrink-0 rounded-xl bg-danger-100 px-2.5 py-1.5 text-sm font-black text-danger-700 dark:bg-rose-950 dark:text-rose-300">
                    ×{item?.wrong_count ?? 0}
                  </span>
                </div>
                <ProgressBar value={confidence} tone={confidence < 45 ? 'rose' : 'amber'} className="mt-3 h-2.5" />
                <p className="mt-2 text-[11px] font-bold text-slate-400">
                  Oxirgi: {formatShortDate(item?.last_seen)} · Keyingi: {formatShortDate(item?.next_review)}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="Xato topilmadi" text="Bu filter bo'yicha xato so'z yo'q. Davom eting!" />
      )}
    </Screen>
  );
}
