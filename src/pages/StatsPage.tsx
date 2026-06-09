import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { StatTile } from '../components/StatTile';
import { WordCard } from '../components/WordCard';
import { CATEGORIES } from '../data/categories';
import { getCategoryProgress } from '../lib/lesson';
import type { Achievement, DailyActivity, UserProfile, UserProgress, Word } from '../types';

export function StatsPage({
  words,
  progress,
  stats,
  profile,
  dailyActivity,
  achievements,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  profile: UserProfile;
  dailyActivity: Record<string, DailyActivity>;
  achievements: Achievement[];
  stats: {
    learned: number;
    todayCount: number;
    accuracy: number;
    streak: number;
    hardWords: Word[];
  };
}) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const today = dailyActivity[todayKey];
  const dailyGoal = Math.max(1, profile.daily_goal_xp);
  const dailyPercent = Math.min(100, Math.round(((today?.xp ?? 0) / dailyGoal) * 100));
  const weekly = Object.values(dailyActivity)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);
  const totalAnswers = Object.values(dailyActivity).reduce((sum, item) => sum + item.correct_answers + item.wrong_answers, 0);
  const weakCategories = CATEGORIES.map((category) => ({
    ...category,
    percent: getCategoryProgress(words, progress, category.id),
  })).sort((a, b) => a.percent - b.percent);

  return (
    <>
      <PageHeader title="Statistika" subtitle="XP, streak, aniqlik, kuchsiz bo'limlar va eng qiyin so'zlar." />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Level" value={profile.level} />
        <StatTile label="Umumiy XP" value={profile.total_xp} />
        <StatTile label="Streak" value={`${profile.streak || stats.streak} kun`} />
        <StatTile label="Hearts" value={`${profile.hearts}/5`} />
      </section>

      <section className="mt-4 grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-brand-600">Kunlik XP maqsad</p>
              <p className="mt-2 text-3xl font-black">
                {today?.xp ?? 0} / {dailyGoal}
              </p>
            </div>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-black text-brand-700 dark:bg-brand-950 dark:text-brand-200">
              {dailyPercent}%
            </span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-brand-600" style={{ width: `${dailyPercent}%` }} />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <MiniStat label="Bugun" value={`${stats.todayCount} javob`} />
            <MiniStat label="Aniqlik" value={`${stats.accuracy}%`} />
            <MiniStat label="Jami javob" value={totalAnswers} />
          </div>
        </Card>

        <Card>
          <p className="text-sm font-bold text-brand-600">Haftalik faollik</p>
          <div className="mt-4 flex h-28 items-end gap-2">
            {weekly.length ? (
              weekly.map((day) => {
                const height = Math.max(12, Math.min(100, Math.round((day.xp / dailyGoal) * 100)));
                return (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t-lg bg-brand-500" style={{ height: `${height}%` }} />
                    <span className="text-[10px] font-bold text-slate-500">{day.date.slice(5)}</span>
                  </div>
                );
              })
            ) : (
              <p className="self-center text-sm text-slate-500">Hali haftalik activity yo'q.</p>
            )}
          </div>
        </Card>
      </section>

      <section className="mt-4 grid gap-3 lg:grid-cols-3">
        {CATEGORIES.map((category) => (
          <Card key={category.id}>
            <p className="text-sm font-bold text-brand-600">{category.title}</p>
            <p className="mt-2 text-3xl font-black">{getCategoryProgress(words, progress, category.id)}%</p>
          </Card>
        ))}
      </section>

      <section className="mt-4 grid gap-3 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-black">Kuchsiz bo'limlar</h2>
          <div className="mt-3 space-y-3">
            {weakCategories.map((category) => (
              <div key={category.id}>
                <div className="flex justify-between text-sm font-bold">
                  <span>{category.title}</span>
                  <span>{category.percent}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${category.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-black">Achievements</h2>
          <div className="mt-3 grid gap-2">
            {achievements.length ? (
              achievements.slice(0, 4).map((achievement) => (
                <div key={achievement.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <p className="text-sm font-black">{achievement.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{achievement.description}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Achievementlar darslar davomida ochiladi.</p>
            )}
          </div>
        </Card>
      </section>

      <section className="mt-4">
        <h2 className="mb-3 text-lg font-black">Eng qiyin so'zlar</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {stats.hardWords.map((word) => (
            <WordCard key={word.id} word={word} meta={`Xato soni: ${progress[word.id]?.wrong_count ?? 0}`} />
          ))}
        </div>
      </section>
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}
