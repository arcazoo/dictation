import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { StatTile } from '../components/StatTile';
import { CATEGORIES } from '../data/categories';
import { getCategoryProgress, getDueWords, getTodayLesson } from '../lib/lesson';
import type { Settings, StudySource, UserProgress, Word } from '../types';

export function TodayPage({
  words,
  progress,
  settings,
  learned,
  accuracy,
  setView,
  startStudy,
  startTest,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  settings: Settings;
  learned: number;
  accuracy: number;
  setView: (view: 'study' | 'sections' | 'ai') => void;
  startStudy: (source: StudySource) => void;
  startTest: (source: StudySource) => void;
}) {
  const due = getDueWords(words, progress, settings.dailyReviewLimit);
  const lesson = getTodayLesson(words, progress, settings);
  const done = lesson.filter((word) => progress[word.id]?.last_seen?.startsWith(new Date().toISOString().slice(0, 10))).length;
  const percent = lesson.length ? Math.round((done / lesson.length) * 100) : 0;

  return (
    <>
      <PageHeader title="Bugungi mashq" subtitle="So'z yodlash, test va AI tutor bir joyda." />

      <section className="rounded-lg bg-brand-600 p-5 text-white shadow-soft dark:bg-brand-700">
        <p className="text-sm font-bold opacity-85">Davom ettirish</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">{lesson.length} so'z</h2>
            <p className="mt-1 text-sm opacity-90">{due.length} ta eski so'z takrorlashga tayyor</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black">{percent}%</p>
            <p className="text-xs font-bold opacity-80">progress</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button className="bg-white text-brand-700 hover:bg-brand-50" onClick={() => startStudy({ kind: 'today', title: 'Bugungi dars' })}>
            Boshlash
          </Button>
          <Button className="bg-brand-700 text-white hover:bg-brand-700 dark:bg-brand-800" onClick={() => setView('ai')}>
            AI bilan
          </Button>
        </div>
      </section>

      <section className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Button variant="secondary" onClick={() => setView('sections')}>List tanlash</Button>
        <Button variant="secondary" onClick={() => setView('ai')}>AI Tutor</Button>
        <Button variant="secondary" onClick={() => startStudy({ kind: 'mistakes', title: "Xato so'zlar" })}>Xatolar</Button>
        <Button variant="ghost" onClick={() => startStudy({ kind: 'category', title: 'Otlar', category: 'noun' })}>Otlar</Button>
        <Button variant="ghost" onClick={() => startStudy({ kind: 'category', title: 'Fe’llar', category: 'verb' })}>Fe'llar</Button>
      </section>

      <section className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
        <StatTile label="Bugun" value={statsLabel(lesson.length, done)} />
        <StatTile label="Aniqlik" value={`${accuracy}%`} />
        <StatTile label="Jami" value={learned} />
      </section>

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black">AI coach tavsiyasi</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Avval 10 ta kartochka, keyin 5 ta test, oxirida AI Tutor bilan bitta mini suhbat qiling.
            </p>
          </div>
          <Button onClick={() => setView('ai')}>Tutorni ochish</Button>
        </div>
      </Card>
    </>
  );
}

function statsLabel(total: number, done: number) {
  return total ? `${done}/${total}` : '0';
}
