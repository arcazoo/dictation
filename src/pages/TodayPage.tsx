import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { StatTile } from '../components/StatTile';
import { CATEGORIES } from '../data/categories';
import { getCategoryProgress, getDueWords, getTodayLesson } from '../lib/lesson';
import type { Settings, UserProgress, Word } from '../types';

export function TodayPage({
  words,
  progress,
  settings,
  learned,
  accuracy,
  setView,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  settings: Settings;
  learned: number;
  accuracy: number;
  setView: (view: 'study' | 'sections') => void;
}) {
  const due = getDueWords(words, progress, settings.dailyReviewLimit);
  const lesson = getTodayLesson(words, progress, settings);
  const done = lesson.filter((word) => progress[word.id]?.last_seen?.startsWith(new Date().toISOString().slice(0, 10))).length;
  const percent = lesson.length ? Math.round((done / lesson.length) * 100) : 0;

  return (
    <>
      <PageHeader title="Bugungi dars" subtitle="Yangi so'zlar, eski takrorlashlar va qiyin so'zlar bir joyda." />

      <section className="grid gap-3 sm:grid-cols-3">
        <StatTile label="Bugungi progress" value={`${percent}%`} />
        <StatTile label="Takrorlash kerak" value={due.length} />
        <StatTile label="To'g'ri javoblar" value={`${accuracy}%`} />
      </section>

      <Card className="mt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black">Kunlik reja</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {lesson.length} ta so'z tayyor. Umumiy o'rganilgan: {learned}.
            </p>
          </div>
          <Button onClick={() => setView('study')}>Boshlash</Button>
        </div>
      </Card>

      <section className="mt-4 grid gap-3 lg:grid-cols-3">
        {CATEGORIES.map((category) => (
          <Card key={category.id}>
            <p className="text-sm font-bold text-brand-600">{category.title}</p>
            <h3 className="mt-2 text-lg font-black">{settings.dailyPlan[category.planKey]} varaq</h3>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full bg-brand-600" style={{ width: `${getCategoryProgress(words, progress, category.id)}%` }} />
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Progress: {getCategoryProgress(words, progress, category.id)}%
            </p>
          </Card>
        ))}
      </section>

      <Card className="mt-4">
        <h2 className="text-lg font-black">Ichki reminder</h2>
        <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
          <p>{settings.notifications.morning} - yangi dars</p>
          <p>{settings.notifications.afternoon} - test</p>
          <p>{settings.notifications.evening} - xato so'zlar</p>
        </div>
      </Card>
    </>
  );
}
