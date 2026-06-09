import { CATEGORIES } from '../data/categories';
import { getCategoryProgress, getDueWords, getTodayLesson } from '../lib/lesson';
import { HeartBadge, LevelBadge, StreakBadge, XPBadge } from '../components/ui/Badges';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { GradientCard } from '../components/ui/GradientCard';
import { GlassCard } from '../components/ui/GlassCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Screen } from '../components/ui/Screen';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatCard } from '../components/ui/StatCard';
import type { DailyActivity, LearningLesson, Settings, StudySource, UserProfile, UserProgress, Word } from '../types';

export function TodayPage({
  words,
  progress,
  settings,
  learned,
  accuracy,
  setView,
  startStudy,
  startLesson,
  firstLesson,
  profile,
  todayActivity,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  settings: Settings;
  learned: number;
  accuracy: number;
  setView: (view: 'study' | 'sections' | 'ai' | 'path') => void;
  startStudy: (source: StudySource) => void;
  startTest: (source: StudySource) => void;
  startLesson: (lesson: LearningLesson) => void;
  firstLesson?: LearningLesson;
  profile: UserProfile;
  todayActivity?: DailyActivity;
}) {
  const due = getDueWords(words, progress, settings.dailyReviewLimit);
  const lesson = getTodayLesson(words, progress, settings);
  const todayKey = new Date().toISOString().slice(0, 10);
  const done = lesson.filter((word) => progress[word.id]?.last_seen?.startsWith(todayKey)).length;
  const percent = lesson.length ? Math.round((done / lesson.length) * 100) : 0;
  const mistakes = words.filter((word) => (progress[word.id]?.wrong_count ?? 0) > 0).length;
  const dailyXp = todayActivity?.xp ?? 0;
  const dailyPercent = Math.min(100, Math.round((dailyXp / Math.max(1, profile.daily_goal_xp)) * 100));
  const preview = firstLesson ? [firstLesson] : [];

  return (
    <Screen>
      <GradientCard className="min-h-[210px]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-black uppercase tracking-wide opacity-80">Bugungi dars</p>
            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">Bugun ruscha miyani uyg'otamizmi?</h1>
            <p className="mt-3 text-sm font-bold opacity-90">
              {due.length} ta review, {lesson.length} ta dars so'zi va AI speaking tayyor.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:flex">
              <PrimaryActionButton
                className="bg-white text-brand-700 shadow-soft"
                onClick={() => (firstLesson ? startLesson(firstLesson) : startStudy({ kind: 'today', title: 'Bugungi dars' }))}
              >
                Darsni boshlash
              </PrimaryActionButton>
              <SecondaryActionButton className="bg-white/18 text-white ring-white/30 hover:bg-white/25" onClick={() => setView('ai')}>
                AI bilan 3 daqiqa
              </SecondaryActionButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:w-64">
            <XPBadge value={profile.total_xp} />
            <LevelBadge value={profile.level} />
            <StreakBadge value={`${profile.streak} kun`} />
            <HeartBadge value={profile.hearts_enabled ? `${profile.hearts}/5` : 'off'} />
          </div>
        </div>
      </GradientCard>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-brand-600">Daily Goal</p>
              <h2 className="mt-2 text-2xl font-black">{dailyXp} / {profile.daily_goal_xp} XP</h2>
              <p className="mt-1 text-sm text-slate-500">{done}/{lesson.length || 0} ta bugungi mashq bajarildi</p>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-sky-500 p-2 text-white shadow-glow">
              <ProgressRing value={dailyPercent} label="goal" />
            </div>
          </div>
          <ProgressBar value={dailyPercent} className="mt-5" />
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-black text-sky-600">Main Lesson</p>
          <h2 className="mt-2 text-2xl font-black">{firstLesson?.title ?? `${lesson.length} so'zli dars`}</h2>
          <p className="mt-1 text-sm text-slate-500">{firstLesson?.subtitle ?? `${due.length} ta eski so'z takrorlashga tayyor`}</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <MiniMetric label="Yangi" value={Math.max(0, lesson.length - due.length)} />
            <MiniMetric label="Review" value={due.length} />
            <MiniMetric label="XP" value={firstLesson?.xp ?? 60} />
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Aniqlik" value={`${accuracy}%`} hint="bugungi javoblar" tone="sky" />
        <StatCard label="O'rganilgan" value={learned} hint="known/mastered" tone="brand" />
        <StatCard label="Xato repair" value={mistakes} hint="tuzatish kerak" tone="rose" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <GlassCard>
          <SectionHeader title="Learning Path preview" subtitle="Keyingi lessonlar bosqichma-bosqich ochiladi." action={<SecondaryActionButton onClick={() => setView('path')}>Yo'lni ochish</SecondaryActionButton>} />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {(preview.length ? preview : [{ id: 'today', title: 'Bugungi dars', subtitle: 'Adaptive review', xp: 60, status: 'available' as const }]).map((lessonItem, index) => (
              <button
                key={lessonItem.id}
                type="button"
                onClick={() => firstLesson ? startLesson(firstLesson) : startStudy({ kind: 'today', title: 'Bugungi dars' })}
                className="rounded-3xl bg-gradient-to-br from-white to-brand-50 p-4 text-left shadow-soft ring-1 ring-white transition hover:-translate-y-1 dark:from-slate-900 dark:to-slate-800 dark:ring-slate-800"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500 text-lg font-black text-white shadow-glow">{index + 1}</span>
                <h3 className="mt-4 font-black">{lessonItem.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{lessonItem.subtitle}</p>
                <p className="mt-3 text-xs font-black text-brand-600">{lessonItem.xp} XP reward</p>
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GradientCard variant="violet">
            <p className="text-sm font-bold opacity-85">AI Coach</p>
            <h2 className="mt-2 text-2xl font-black">AI bilan 3 daqiqa speaking</h2>
            <div className="mt-4 grid gap-2">
              <SecondaryActionButton className="bg-white/18 text-white ring-white/25" onClick={() => setView('ai')}>Speaking ochish</SecondaryActionButton>
              <SecondaryActionButton className="bg-white/18 text-white ring-white/25" onClick={() => setView('ai')}>Xatolarimni tushuntir</SecondaryActionButton>
            </div>
          </GradientCard>

          <GlassCard>
            <SectionHeader title="Mistake Repair" subtitle={`${mistakes} ta xato so'z bor`} />
            <PrimaryActionButton className="mt-4 w-full" onClick={() => startStudy({ kind: 'mistakes', title: "Xato so'zlar" })}>
              Xatolarni tuzatish
            </PrimaryActionButton>
          </GlassCard>
        </div>
      </section>

      <section>
        <SectionHeader title="Bo'limlar progressi" subtitle="Otlar, sifatlar va fe'llar bo'yicha umumiy holat." />
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const value = getCategoryProgress(words, progress, category.id);
            return (
              <GlassCard key={category.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-brand-600">{category.title}</p>
                    <h3 className="mt-1 text-xl font-black">{settings.dailyPlan[category.planKey]} varaq / kun</h3>
                  </div>
                  <span className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-black text-white dark:bg-white dark:text-slate-950">{value}%</span>
                </div>
                <ProgressBar value={value} className="mt-4" />
              </GlassCard>
            );
          })}
        </div>
      </section>
    </Screen>
  );
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center dark:bg-slate-950">
      <p className="text-[10px] font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}
