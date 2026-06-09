import { EmptyState } from '../components/ui/EmptyState';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientCard } from '../components/ui/GradientCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Screen } from '../components/ui/Screen';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatCard } from '../components/ui/StatCard';
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
  const mastered = Object.values(progress).filter((item) => item.status === 'mastered').length;

  return (
    <Screen>
      <GradientCard variant="emerald">
        <p className="text-sm font-black uppercase opacity-80">Analytics dashboard</p>
        <h1 className="mt-2 text-3xl font-black sm:text-5xl">Progress raqamlari</h1>
        <p className="mt-2 text-sm font-bold opacity-85">XP, streak, accuracy, weak categories va achievements.</p>
      </GradientCard>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total XP" value={profile.total_xp} tone="brand" />
        <StatCard label="Level" value={profile.level} tone="violet" />
        <StatCard label="Streak" value={`${profile.streak || stats.streak} kun`} tone="amber" />
        <StatCard label="Hearts" value={`${profile.hearts}/5`} tone="rose" />
        <StatCard label="Accuracy" value={`${stats.accuracy}%`} tone="sky" />
        <StatCard label="Mastered" value={mastered} tone="brand" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <GlassCard>
          <SectionHeader title="Daily XP goal" subtitle={`${today?.xp ?? 0}/${dailyGoal} XP bugun`} />
          <ProgressBar value={dailyPercent} className="mt-4 h-4" />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Mini label="Bugun" value={`${stats.todayCount} javob`} />
            <Mini label="Jami javob" value={totalAnswers} />
            <Mini label="O'rganilgan" value={stats.learned} />
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader title="Weekly activity" subtitle="Oxirgi 7 kun XP barlari." />
          <div className="mt-5 flex h-36 items-end gap-2">
            {weekly.length ? weekly.map((day) => {
              const height = Math.max(12, Math.min(100, Math.round((day.xp / dailyGoal) * 100)));
              return (
                <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-2xl bg-gradient-to-t from-brand-500 to-sky-400 shadow-soft" style={{ height: `${height}%` }} />
                  <span className="text-[10px] font-black text-slate-500">{day.date.slice(5)}</span>
                </div>
              );
            }) : <p className="self-center text-sm font-bold text-slate-500">Hali haftalik activity yo'q.</p>}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const percent = getCategoryProgress(words, progress, category.id);
          return (
            <GlassCard key={category.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-brand-600">{category.title}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{category.subtitle}</p>
                </div>
                <p className="text-3xl font-black">{percent}%</p>
              </div>
              <ProgressBar value={percent} className="mt-4" />
            </GlassCard>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <SectionHeader title="Weak categories" subtitle="Past progress bo'yicha tartiblangan." />
          <div className="mt-4 space-y-4">
            {weakCategories.map((category) => (
              <div key={category.id}>
                <div className="flex justify-between text-sm font-black">
                  <span>{category.title}</span>
                  <span>{category.percent}%</span>
                </div>
                <ProgressBar value={category.percent} tone={category.percent < 35 ? 'rose' : 'amber'} className="mt-2 h-2" />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader title="Achievements" subtitle="Motivatsion badge'lar." />
          {achievements.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {achievements.slice(0, 6).map((achievement) => (
                <div key={achievement.id} className="rounded-3xl bg-gradient-to-br from-violet-50 to-sky-50 p-4 shadow-soft dark:from-violet-950/50 dark:to-sky-950/30">
                  <p className="text-sm font-black">{achievement.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{achievement.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Achievementlar hali ochilmadi" text="Darslar davomida streak va mastered so'zlar bilan badge'lar ochiladi." />
          )}
        </GlassCard>
      </section>

      <GlassCard>
        <SectionHeader title="Hardest words" subtitle="Eng ko'p xato qilingan so'zlar." />
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {stats.hardWords.map((word) => (
            <div key={word.id} className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xl font-black">{word.russian}</p>
                  <p className="mt-1 text-sm font-bold text-slate-500">{word.uzbek}</p>
                </div>
                <span className="rounded-2xl bg-rose-50 px-3 py-2 text-sm font-black text-rose-700 dark:bg-rose-950 dark:text-rose-100">
                  x{progress[word.id]?.wrong_count ?? 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </Screen>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}
