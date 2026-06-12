import { GlassCard } from '../components/ui/GlassCard';
import { GradientCard } from '../components/ui/GradientCard';
import { Icon } from '../components/ui/icons';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ProgressRing } from '../components/ui/ProgressRing';
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
  const mastered = Object.values(progress).filter((item) => item.status === 'mastered').length;

  return (
    <Screen className="max-w-2xl">
      <GradientCard>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest opacity-80">Statistika</p>
            <h1 className="mt-1 text-2xl font-black">Level {profile.level}</h1>
            <p className="mt-1 text-sm font-bold opacity-90">
              {profile.total_xp} XP · {profile.streak || stats.streak} kunlik streak
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-2 text-white">
            <ProgressRing value={dailyPercent} label="bugun" size={104} />
          </div>
        </div>
      </GradientCard>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Aniqlik" value={`${stats.accuracy}%`} hint="bugungi javoblar" tone="sky" />
        <StatCard label="O'rganilgan" value={stats.learned} hint="known + mastered" tone="brand" />
        <StatCard label="Mastered" value={mastered} tone="violet" />
        <StatCard label="Bugun" value={`${stats.todayCount} javob`} tone="amber" />
        <StatCard label="Jami javoblar" value={totalAnswers} tone="sky" />
        <StatCard label="Hearts" value={`${profile.hearts}/5`} tone="rose" />
      </section>

      <GlassCard>
        <SectionHeader title="Haftalik faollik" subtitle="Oxirgi 7 kun XP" />
        <div className="mt-5 flex h-32 items-end gap-2">
          {weekly.length ? (
            weekly.map((day) => {
              const height = Math.max(10, Math.min(100, Math.round((day.xp / dailyGoal) * 100)));
              const hitGoal = day.xp >= dailyGoal;
              return (
                <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className={`w-full rounded-t-xl border-2 border-b-0 ${
                      hitGoal
                        ? 'border-success-700/30 bg-success-500'
                        : 'border-brand-700/30 bg-brand-500'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] font-black text-slate-400">{day.date.slice(5)}</span>
                </div>
              );
            })
          ) : (
            <p className="self-center text-sm font-bold text-slate-500">Hali haftalik faollik yo'q.</p>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <SectionHeader title="Bo'limlar" subtitle="Kategoriya bo'yicha progress" />
        <div className="mt-4 space-y-4">
          {CATEGORIES.map((category) => {
            const percent = getCategoryProgress(words, progress, category.id);
            return (
              <div key={category.id}>
                <div className="flex justify-between text-sm font-black">
                  <span>{category.title}</span>
                  <span className="text-slate-400">{percent}%</span>
                </div>
                <ProgressBar value={percent} className="mt-2" tone={percent < 35 ? 'rose' : percent < 70 ? 'amber' : 'success'} />
              </div>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard>
        <SectionHeader title="Yutuqlar" subtitle={`${achievements.length} ta badge ochildi`} />
        {achievements.length ? (
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {achievements.slice(0, 9).map((achievement) => (
              <div
                key={achievement.id}
                className="rounded-2xl border-2 border-warn-500/25 bg-warn-100/50 p-3 text-center dark:bg-amber-950/40"
              >
                <span className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-warn-500 text-white">
                  <Icon name="trophy" size={18} />
                </span>
                <p className="mt-2 text-xs font-black leading-tight">{achievement.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm font-bold text-slate-500 dark:text-slate-400">
            Streak va mastered so'zlar bilan badge'lar ochiladi.
          </p>
        )}
      </GlassCard>

      {stats.hardWords.length ? (
        <GlassCard>
          <SectionHeader title="Eng qiyin so'zlar" subtitle="Eng ko'p xato qilinganlar" />
          <div className="mt-4 space-y-2">
            {stats.hardWords.map((word) => (
              <div
                key={word.id}
                className="flex items-center justify-between gap-3 rounded-xl border-2 border-ink-900/[0.07] bg-ink-50 px-3.5 py-2.5 dark:border-white/[0.07] dark:bg-ink-900"
              >
                <div className="min-w-0">
                  <p className="truncate text-base font-black">{word.russian}</p>
                  <p className="truncate text-xs font-bold text-slate-500 dark:text-slate-400">{word.uzbek}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-danger-100 px-2 py-1 text-xs font-black text-danger-700 dark:bg-rose-950 dark:text-rose-300">
                  ×{progress[word.id]?.wrong_count ?? 0}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      ) : null}
    </Screen>
  );
}
