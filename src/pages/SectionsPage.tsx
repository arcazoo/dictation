import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { CATEGORIES } from '../data/categories';
import { getPageStatus } from '../lib/lesson';
import type { Category, UserProgress, Word } from '../types';

export function SectionsPage({
  words,
  progress,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
}) {
  const pagesByCategory = CATEGORIES.map((category) => ({
    ...category,
    pages: [...new Set(words.filter((word) => word.category === category.id).map((word) => word.page))].sort((a, b) => a - b),
  }));

  return (
    <>
      <PageHeader title="Bo'limlar" subtitle="Har bir lug'at varaqma-varaq o'rganiladi va statusi alohida saqlanadi." />
      <section className="grid gap-4 lg:grid-cols-3">
        {pagesByCategory.map((category) => (
          <Card key={category.id}>
            <p className="text-sm font-bold text-brand-600">{category.subtitle}</p>
            <h2 className="mt-1 text-xl font-black">{category.title}</h2>
            <div className="mt-4 grid gap-2">
              {(category.pages.length ? category.pages : [1, 2, 3]).map((page) => (
                <PageRow
                  key={page}
                  page={page}
                  status={getPageStatus(words, progress, category.id as Category, page)}
                  count={words.filter((word) => word.category === category.id && word.page === page).length}
                />
              ))}
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}

function PageRow({ page, status, count }: { page: number; status: string; count: number }) {
  const tone =
    status === 'Tugagan'
      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200'
      : status === 'Takrorlash kerak'
        ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200'
        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200';
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <div>
        <p className="font-bold">{page}-varaq</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{count} ta so'z</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone}`}>{status}</span>
    </div>
  );
}
