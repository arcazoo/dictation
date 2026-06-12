import { useState } from 'react';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { GlassCard } from '../components/ui/GlassCard';
import { Icon } from '../components/ui/icons';
import { PillTabs } from '../components/ui/PillTabs';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Screen } from '../components/ui/Screen';
import { SectionHeader } from '../components/ui/SectionHeader';
import { CATEGORIES } from '../data/categories';
import { getCategoryProgress, getPageStatus } from '../lib/lesson';
import type { Category, StudySource, UserProgress, Word } from '../types';

export function SectionsPage({
  words,
  progress,
  startStudy,
  startTest,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  startStudy: (source: StudySource) => void;
  startTest: (source: StudySource) => void;
}) {
  const [active, setActive] = useState<Category>('noun');
  const activeMeta = CATEGORIES.find((category) => category.id === active) ?? CATEGORIES[0];
  const categoryWords = words.filter((word) => word.category === active);
  const pages = [...new Set(categoryWords.map((word) => word.page))].sort((a, b) => a - b);
  const mastered = categoryWords.filter((word) => progress[word.id]?.status === 'mastered').length;
  const weak = categoryWords.filter((word) => (progress[word.id]?.wrong_count ?? 0) > 0).length;
  const percent = getCategoryProgress(words, progress, active);

  return (
    <Screen className="max-w-3xl">
      <GlassCard className="!p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black">Mashq markazi</h1>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Varaqma-varaq flashcard va test</p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
            <Icon name="layers" size={22} />
          </span>
        </div>
      </GlassCard>

      <PillTabs
        value={active}
        onChange={setActive}
        items={CATEGORIES.map((category) => ({ id: category.id, label: category.title }))}
      />

      <GlassCard>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400">{activeMeta.subtitle}</p>
            <h2 className="mt-1 text-2xl font-black">{activeMeta.title}</h2>
          </div>
          <span className="text-3xl font-black text-slate-300 dark:text-slate-600">{percent}%</span>
        </div>
        <ProgressBar value={percent} className="mt-3" />
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Mini label="So'zlar" value={categoryWords.length} />
          <Mini label="Mastered" value={mastered} />
          <Mini label="Xato" value={weak} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <SecondaryActionButton onClick={() => startStudy({ kind: 'category', title: activeMeta.title, category: active })}>
            Hammasi: Cards
          </SecondaryActionButton>
          <PrimaryActionButton onClick={() => startTest({ kind: 'category', title: `${activeMeta.title} testi`, category: active })}>
            Hammasi: Test
          </PrimaryActionButton>
        </div>
      </GlassCard>

      <div>
        <SectionHeader title="Varaqlar" subtitle={`${pages.length} ta varaq`} />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {pages.map((page) => {
            const status = getPageStatus(words, progress, active, page);
            const count = categoryWords.filter((word) => word.page === page).length;
            return (
              <div
                key={page}
                className="rounded-2xl border-2 border-ink-900/[0.08] bg-white p-3 shadow-hard dark:border-white/[0.08] dark:bg-ink-800 dark:shadow-hard-dark"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-lg font-black">{page}-varaq</p>
                  <StatusDot status={status} />
                </div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {count} so'z · {status}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => startStudy({ kind: 'page', title: `${activeMeta.title} / ${page}-varaq`, category: active, page })}
                    className="min-h-9 rounded-xl border-2 border-b-4 border-ink-900/15 bg-ink-50 text-xs font-black transition active:translate-y-[2px] active:border-b-2 dark:border-white/15 dark:bg-ink-900"
                  >
                    Cards
                  </button>
                  <button
                    type="button"
                    onClick={() => startTest({ kind: 'page', title: `${activeMeta.title} / ${page}-varaq testi`, category: active, page })}
                    className="min-h-9 rounded-xl border-b-4 border-brand-800 bg-brand-600 text-xs font-black text-white transition active:translate-y-[2px] active:border-b-2"
                  >
                    Test
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}

function StatusDot({ status }: { status: string }) {
  const tone =
    status === 'Tugagan'
      ? 'bg-success-500'
      : status === 'Takrorlash kerak'
        ? 'bg-warn-500'
        : status === "O'rganilmoqda"
          ? 'bg-brand-500'
          : 'bg-slate-300 dark:bg-slate-600';
  return <span className={`h-3 w-3 rounded-full ${tone}`} aria-hidden="true" />;
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border-2 border-ink-900/[0.07] bg-ink-50 p-2.5 dark:border-white/[0.07] dark:bg-ink-900">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-0.5 text-base font-black">{value}</p>
    </div>
  );
}
