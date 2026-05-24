import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { CATEGORIES } from '../data/categories';
import { getPageStatus } from '../lib/lesson';
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

  return (
    <>
      <PageHeader title="List tanlash" subtitle="Kategoriya yoki aniq varaqni tanlab, faqat o'sha ro'yxat bilan ishlang." />
      <section className="grid gap-4 lg:grid-cols-3">
        {pagesByCategory.map((category) => (
          <Card key={category.id}>
            <p className="text-sm font-bold text-brand-600">{category.subtitle}</p>
            <h2 className="mt-1 text-xl font-black">{category.title}</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                onClick={() => startStudy({ kind: 'category', title: category.title, category: category.id })}
                className="px-2"
              >
                Hammasi
              </Button>
              <Button
                variant="secondary"
                onClick={() => startTest({ kind: 'category', title: `${category.title} testi`, category: category.id })}
                className="px-2"
              >
                Test
              </Button>
            </div>
            <div className="mt-4 grid max-h-[60vh] gap-2 overflow-y-auto pr-1">
              {(category.pages.length ? category.pages : [1, 2, 3]).map((page) => (
                <PageRow
                  key={page}
                  page={page}
                  status={getPageStatus(words, progress, category.id as Category, page)}
                  count={words.filter((word) => word.category === category.id && word.page === page).length}
                  onStudy={() =>
                    startStudy({ kind: 'page', title: `${category.title} · ${page}-varaq`, category: category.id, page })
                  }
                  onTest={() =>
                    startTest({ kind: 'page', title: `${category.title} · ${page}-varaq testi`, category: category.id, page })
                  }
                />
              ))}
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}

function PageRow({
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
  const tone =
    status === 'Tugagan'
      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200'
      : status === 'Takrorlash kerak'
        ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200'
        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200';
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <div className="flex items-center justify-between gap-3">
      <div>
        <p className="font-bold">{page}-varaq</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{count} ta so'z</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone}`}>{status}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button onClick={onStudy} className="min-h-10 px-2 py-2 text-xs">O'rganish</Button>
        <Button variant="secondary" onClick={onTest} className="min-h-10 px-2 py-2 text-xs">Test</Button>
      </div>
    </div>
  );
}
