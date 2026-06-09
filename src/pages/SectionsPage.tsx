import { useState } from 'react';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientCard } from '../components/ui/GradientCard';
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
  const pagesByCategory = CATEGORIES.map((category) => ({
    ...category,
    pages: [...new Set(words.filter((word) => word.category === category.id).map((word) => word.page))].sort((a, b) => a - b),
  }));
  const [active, setActive] = useState<Category>(pagesByCategory[0]?.id ?? 'noun');
  const activeCategory = pagesByCategory.find((category) => category.id === active) ?? pagesByCategory[0];

  return (
    <Screen>
      <GradientCard variant="dark">
        <p className="text-sm font-black uppercase opacity-80">Practice Library</p>
        <h1 className="mt-2 text-3xl font-black sm:text-5xl">List tanlash markazi</h1>
        <p className="mt-2 max-w-2xl text-sm font-bold opacity-80">Otlar, sifatlar va fe'llarni varaqma-varaq premium mashq qiling.</p>
      </GradientCard>

      <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          {pagesByCategory.map((category) => {
            const categoryWords = words.filter((word) => word.category === category.id);
            const mastered = categoryWords.filter((word) => progress[word.id]?.status === 'mastered').length;
            const weak = categoryWords.filter((word) => (progress[word.id]?.wrong_count ?? 0) > 0).length;
            const percent = getCategoryProgress(words, progress, category.id);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActive(category.id)}
                className={`w-full rounded-3xl p-4 text-left shadow-soft transition active:scale-[0.98] ${
                  active === category.id
                    ? 'bg-gradient-to-br from-brand-500 to-sky-500 text-white'
                    : 'bg-white/82 text-slate-900 dark:bg-slate-900/82 dark:text-white'
                }`}
              >
                <p className="text-xs font-black uppercase opacity-70">{category.subtitle}</p>
                <h2 className="mt-1 text-xl font-black">{category.title}</h2>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <Mini label="Words" value={categoryWords.length} />
                  <Mini label="Mastered" value={mastered} />
                  <Mini label="Weak" value={weak} />
                </div>
                <ProgressBar value={percent} className="mt-4 bg-white/25" />
              </button>
            );
          })}
        </div>

        <GlassCard>
          <SectionHeader
            title={activeCategory.title}
            subtitle={`${activeCategory.pages.length} ta varaq / ${words.filter((word) => word.category === activeCategory.id).length} ta so'z`}
            action={
              <div className="hidden gap-2 sm:flex">
                <SecondaryActionButton onClick={() => startStudy({ kind: 'category', title: activeCategory.title, category: activeCategory.id })}>Hammasi</SecondaryActionButton>
                <PrimaryActionButton onClick={() => startTest({ kind: 'category', title: `${activeCategory.title} testi`, category: activeCategory.id })}>Test</PrimaryActionButton>
              </div>
            }
          />
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {activeCategory.pages.map((page) => (
              <PageChip
                key={page}
                page={page}
                status={getPageStatus(words, progress, activeCategory.id as Category, page)}
                count={words.filter((word) => word.category === activeCategory.id && word.page === page).length}
                onStudy={() => startStudy({ kind: 'page', title: `${activeCategory.title} / ${page}-varaq`, category: activeCategory.id, page })}
                onTest={() => startTest({ kind: 'page', title: `${activeCategory.title} / ${page}-varaq testi`, category: activeCategory.id, page })}
              />
            ))}
          </div>
        </GlassCard>
      </section>
    </Screen>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white/15 p-2">
      <p className="text-[10px] font-bold opacity-70">{label}</p>
      <p className="text-sm font-black">{value}</p>
    </div>
  );
}

function PageChip({
  page,
  status,
  count,
  onStudy,
  onTest,
}: {
  page: number;
  status: string;
  count: number;
  onStudy: () => void;
  onTest: () => void;
}) {
  const value = status === 'Tugagan' ? 100 : status === "O'rganilmoqda" ? 45 : status === 'Takrorlash kerak' ? 70 : 8;
  return (
    <div className="rounded-3xl bg-white/86 p-3 shadow-soft ring-1 ring-white dark:bg-slate-950/70 dark:ring-slate-800">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-lg font-black">{page}-varaq</p>
          <p className="text-xs font-bold text-slate-500">{count} ta so'z</p>
        </div>
        <span className="rounded-xl bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">{status}</span>
      </div>
      <ProgressBar value={value} className="mt-3 h-2" tone={status === 'Takrorlash kerak' ? 'amber' : 'brand'} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <SecondaryActionButton className="min-h-10 px-2 py-2 text-xs" onClick={onStudy}>Cards</SecondaryActionButton>
        <PrimaryActionButton className="min-h-10 px-2 py-2 text-xs" onClick={onTest}>Test</PrimaryActionButton>
      </div>
    </div>
  );
}
