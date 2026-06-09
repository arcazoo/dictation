import { useState } from 'react';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientCard } from '../components/ui/GradientCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Screen } from '../components/ui/Screen';
import { SectionHeader } from '../components/ui/SectionHeader';
import type { LearningLesson, LearningUnit } from '../types';

export function LearningPathPage({
  units,
  startLesson,
}: {
  units: LearningUnit[];
  startLesson: (lesson: LearningLesson) => void;
}) {
  const [selected, setSelected] = useState<LearningLesson | null>(null);
  const visible = units.slice(0, 8);

  return (
    <Screen className="max-w-7xl">
      <GradientCard variant="violet">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase opacity-80">Learning Path</p>
            <h1 className="mt-2 text-3xl font-black sm:text-5xl">Bosqichma-bosqich ruscha yo'l</h1>
            <p className="mt-2 max-w-2xl text-sm font-bold opacity-85">Unit, review va mixed challenge lessonlari Duolingo-style yo'l bo'ylab ochiladi.</p>
          </div>
          <div className="rounded-3xl bg-white/15 p-4 text-center">
            <p className="text-3xl font-black">{visible.length}</p>
            <p className="text-xs font-bold opacity-80">active unit</p>
          </div>
        </div>
      </GradientCard>

      <section className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {visible.map((unit, unitIndex) => {
            const completed = unit.lessons.filter((lesson) => lesson.status === 'completed').length;
            const estimatedXp = unit.lessons.reduce((sum, lesson) => sum + lesson.xp, 0);
            return (
              <GlassCard key={unit.id} className="overflow-hidden">
                <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 p-5 text-white dark:from-white dark:to-slate-200 dark:text-slate-950">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase opacity-70">Unit {unitIndex + 1}</p>
                      <h2 className="mt-2 text-2xl font-black">{unit.title}</h2>
                      <p className="mt-1 text-sm font-bold opacity-75">{unit.subtitle}</p>
                    </div>
                    <div className="rounded-2xl bg-white/15 px-3 py-2 text-center dark:bg-slate-950/10">
                      <p className="text-xl font-black">{unit.progress_percent}%</p>
                    </div>
                  </div>
                  <ProgressBar value={unit.progress_percent} className="mt-4 bg-white/20" />
                </div>

                <div className="relative mx-auto mt-6 max-w-xl pb-4">
                  <div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] w-1 -translate-x-1/2 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-4">
                    {unit.lessons.map((lesson, index) => {
                      const side = index % 2 === 0 ? 'mr-auto pr-10' : 'ml-auto pl-10';
                      return (
                        <div key={lesson.id} className={`relative flex w-1/2 ${side}`}>
                          <button
                            type="button"
                            disabled={lesson.status === 'locked'}
                            onClick={() => setSelected(lesson)}
                            className={`relative z-10 aspect-square w-24 rounded-full border-4 p-2 text-center shadow-soft transition hover:scale-105 disabled:hover:scale-100 sm:w-28 ${tone(lesson)}`}
                            aria-label={lesson.title}
                          >
                            <span className="block text-xl font-black">{nodeLabel(lesson, index)}</span>
                            <span className="mt-1 line-clamp-2 text-[10px] font-black">{lesson.title}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-5 xl:self-start">
          <GlassCard>
            <SectionHeader title="Unit stats" subtitle="Joriy yo'l bo'yicha umumiy raqamlar." />
            <div className="mt-4 grid gap-3">
              <SideStat label="Completed" value={visible.reduce((sum, unit) => sum + unit.lessons.filter((lesson) => lesson.status === 'completed').length, 0)} />
              <SideStat label="Lessons" value={visible.reduce((sum, unit) => sum + unit.lessons.length, 0)} />
              <SideStat label="Estimated XP" value={visible.reduce((sum, unit) => sum + unit.lessons.reduce((total, lesson) => total + lesson.xp, 0), 0)} />
            </div>
          </GlassCard>
        </aside>
      </section>

      {selected ? (
        <div className="fixed inset-0 z-40 grid place-items-end bg-slate-950/45 p-3 backdrop-blur-sm sm:place-items-center">
          <GlassCard className="w-full max-w-md animate-soft-pop">
            <p className="text-xs font-black uppercase text-brand-600">{selected.type}</p>
            <h2 className="mt-2 text-2xl font-black">{selected.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{selected.subtitle}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <SideStat label="Words" value={selected.wordIds.length} />
              <SideStat label="XP" value={selected.xp} />
              <SideStat label="Status" value={selected.status} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <SecondaryActionButton onClick={() => setSelected(null)}>Yopish</SecondaryActionButton>
              <PrimaryActionButton disabled={selected.status === 'locked'} onClick={() => startLesson(selected)}>
                Start
              </PrimaryActionButton>
            </div>
          </GlassCard>
        </div>
      ) : null}
    </Screen>
  );
}

function nodeLabel(lesson: LearningLesson, index: number) {
  if (lesson.status === 'locked') return 'L';
  if (lesson.status === 'completed') return 'OK';
  if (lesson.type === 'review') return 'R';
  if (lesson.type === 'mixedChallenge') return 'M';
  return index + 1;
}

function tone(lesson: LearningLesson) {
  if (lesson.status === 'completed') return 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-100';
  if (lesson.status === 'review_needed' || lesson.type === 'review') return 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-100';
  if (lesson.type === 'mixedChallenge') return 'border-violet-400 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-100';
  if (lesson.status === 'available' || lesson.status === 'in_progress') return 'border-brand-400 bg-brand-50 text-brand-700 shadow-glow dark:bg-brand-950 dark:text-brand-100';
  return 'border-slate-300 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-900';
}

function SideStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
      <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}
