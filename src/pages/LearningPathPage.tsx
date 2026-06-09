import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import type { LearningLesson, LearningUnit } from '../types';

export function LearningPathPage({
  units,
  startLesson,
}: {
  units: LearningUnit[];
  startLesson: (lesson: LearningLesson) => void;
}) {
  return (
    <>
      <PageHeader title="Learning Path" subtitle="Unit va lessonlar bosqichma-bosqich ochiladi." />
      <section className="space-y-5">
        {units.slice(0, 6).map((unit) => (
          <Card key={unit.id}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">{unit.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{unit.subtitle}</p>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-black text-brand-700 dark:bg-brand-500/15 dark:text-brand-100">
                {unit.progress_percent}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
              {unit.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  disabled={lesson.status === 'locked'}
                  onClick={() => startLesson(lesson)}
                  className={`aspect-square rounded-2xl border p-2 text-center transition ${
                    tone(lesson.status)
                  } ${index % 2 ? 'translate-y-4' : ''}`}
                >
                  <span className="block text-lg font-black">{lesson.status === 'locked' ? 'L' : index + 1}</span>
                  <span className="mt-1 line-clamp-2 text-[11px] font-bold">{lesson.title}</span>
                </button>
              ))}
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}

function tone(status: LearningLesson['status']) {
  if (status === 'completed') return 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-100';
  if (status === 'review_needed') return 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-100';
  if (status === 'in_progress') return 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-100';
  if (status === 'available') return 'border-brand-600 bg-brand-50 text-brand-700 shadow-soft dark:bg-brand-500/15 dark:text-brand-100';
  return 'border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900';
}
