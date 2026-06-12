import { CATEGORIES } from '../data/categories';
import { getCategoryProgress, getDueWords, getTodayLesson } from '../lib/lesson';
import { HeartBadge, LevelBadge, StreakBadge, XPBadge } from '../components/ui/Badges';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { GradientCard } from '../components/ui/GradientCard';
import { GlassCard } from '../components/ui/GlassCard';
import { Icon } from '../components/ui/icons';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Screen } from '../components/ui/Screen';
import { SectionHeader } from '../components/ui/SectionHeader';
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
  setView: (view: 'study' | 'sections' | 'ai' | 'path' | 'grammar') => void;
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
  const mistakes = words.filter((word) => (progress[word.id]?.wrong_count ?? 0) > 0).length;
  const dailyXp = todayActivity?.xp ?? 0;
  const dailyPercent = Math.min(100, Math.round((dailyXp / Math.max(1, profile.daily_goal_xp)) * 100));

  const startMain = () => (firstLesson ? startLesson(firstLesson) : startStudy({ kind: 'today', title: 'Bugungi dars' }));

  return (
    <Screen>
      {/* Profil chizig'i */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StreakBadge value={`${profile.streak} kun`} />
        <XPBadge value={profile.total_xp} />
        <LevelBadge value={profile.level} />
        <HeartBadge value={profile.hearts_enabled ? `${profile.hearts}/5` : 'off'} />
      </div>

      {/* Hero */}
      <GradientCard>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <p className="text-[11px] font-black uppercase tracking-widest opacity-80">Bugungi reja</p>
            <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">
              {due.length ? `${due.length} ta takror kutyapti` : 'Yangi so‘zlar vaqti!'}
            </h1>
            <p className="mt-2 text-sm font-bold opacity-90">
              {lesson.length} ta so‘z · {done} tasi bajarildi · maqsad {profile.daily_goal_xp} XP
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <PrimaryActionButton className="border-white/40 bg-white !text-brand-700 hover:bg-brand-50" onClick={startMain}>
                Darsni boshlash
              </PrimaryActionButton>
              <SecondaryActionButton
                className="border-white/25 bg-white/10 !text-white hover:bg-white/20 dark:border-white/25 dark:bg-white/10"
                onClick={() => setView('ai')}
              >
                AI speaking
              </SecondaryActionButton>
            </div>
          </div>
          <div className="mx-auto rounded-2xl bg-white/10 p-3 text-white">
            <ProgressRing value={dailyPercent} label={`${dailyXp}/${profile.daily_goal_xp} XP`} size={120} />
          </div>
        </div>
      </GradientCard>

      {/* Uch yo'nalish */}
      <section className="grid gap-3 lg:grid-cols-3">
        <ActionTile
          icon="cards"
          tone="text-brand-600 bg-brand-50 dark:bg-brand-950/60 dark:text-brand-300"
          title="So'zlar darsi"
          subtitle={firstLesson ? firstLesson.title : `${lesson.length} ta so'z tayyor`}
          cta="Boshlash"
          onClick={startMain}
        />
        <ActionTile
          icon="book"
          tone="text-violet-600 bg-violet-100/70 dark:bg-violet-950/60 dark:text-violet-300"
          title="Grammatika"
          subtitle="A1→B1 kurs: kelishiklar, fe'l, aspekt"
          cta="Davom etish"
          onClick={() => setView('grammar')}
        />
        <ActionTile
          icon="wrench"
          tone="text-danger-600 bg-danger-100/70 dark:bg-rose-950/60 dark:text-rose-300"
          title="Xatolar ustaxonasi"
          subtitle={mistakes ? `${mistakes} ta so'z tuzatish kutyapti` : 'Xatolar yo‘q — zo‘r!'}
          cta="Tuzatish"
          onClick={() => startStudy({ kind: 'mistakes', title: "Xato so'zlar" })}
        />
      </section>

      {/* Ko'rsatkichlar */}
      <section className="grid grid-cols-3 gap-3">
        <Metric value={`${accuracy}%`} label="aniqlik" />
        <Metric value={learned} label="o'rganilgan" />
        <Metric value={due.length} label="takror" />
      </section>

      {/* Bo'limlar progressi */}
      <GlassCard>
        <SectionHeader
          title="Bo'limlar"
          subtitle="Otlar, sifatlar va fe'llar bo'yicha holat"
          action={
            <SecondaryActionButton className="hidden sm:block" onClick={() => setView('sections')}>
              Hammasi
            </SecondaryActionButton>
          }
        />
        <div className="mt-4 space-y-4">
          {CATEGORIES.map((category) => {
            const value = getCategoryProgress(words, progress, category.id);
            return (
              <div key={category.id}>
                <div className="flex items-center justify-between text-sm font-black">
                  <span>{category.title}</span>
                  <span className="text-slate-400">{value}%</span>
                </div>
                <ProgressBar value={value} className="mt-2" />
              </div>
            );
          })}
        </div>
        <SecondaryActionButton className="mt-4 w-full sm:hidden" onClick={() => setView('sections')}>
          Mashq markazini ochish
        </SecondaryActionButton>
      </GlassCard>

      {/* Yo'l preview */}
      <GlassCard>
        <SectionHeader
          title="Learning Path"
          subtitle="Keyingi dars yo'l ustida ochiq"
          action={<SecondaryActionButton onClick={() => setView('path')}>Yo'l</SecondaryActionButton>}
        />
        {firstLesson ? (
          <button
            type="button"
            onClick={() => startLesson(firstLesson)}
            className="mt-4 flex w-full items-center gap-4 rounded-2xl border-2 border-b-4 border-brand-600/25 bg-brand-50 p-4 text-left transition active:translate-y-[2px] active:border-b-2 dark:bg-brand-950/40"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-b-4 border-brand-800 bg-brand-600 text-white">
              <Icon name="play" size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-base font-black">{firstLesson.title}</span>
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">{firstLesson.subtitle}</span>
            </span>
            <span className="shrink-0 text-sm font-black text-brand-600 dark:text-brand-300">+{firstLesson.xp} XP</span>
          </button>
        ) : null}
      </GlassCard>
    </Screen>
  );
}

function ActionTile({
  icon,
  tone,
  title,
  subtitle,
  cta,
  onClick,
}: {
  icon: 'cards' | 'book' | 'wrench';
  tone: string;
  title: string;
  subtitle: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col rounded-2xl border-2 border-b-4 border-ink-900/[0.09] bg-white p-4 text-left shadow-hard transition hover:border-brand-600/30 active:translate-y-[2px] active:border-b-2 dark:border-white/[0.09] dark:bg-ink-800 dark:shadow-hard-dark"
    >
      <span className={`grid h-11 w-11 place-items-center rounded-xl ${tone}`}>
        <Icon name={icon} size={22} />
      </span>
      <span className="mt-3 text-base font-black">{title}</span>
      <span className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{subtitle}</span>
      <span className="mt-3 text-xs font-black uppercase tracking-wide text-brand-600 dark:text-brand-400">{cta} →</span>
    </button>
  );
}

function Metric({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border-2 border-ink-900/[0.07] bg-white p-3 text-center shadow-hard dark:border-white/[0.07] dark:bg-ink-800 dark:shadow-hard-dark">
      <p className="text-xl font-black">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  );
}
