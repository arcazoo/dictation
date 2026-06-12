import { useState } from 'react';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { GlassCard } from '../components/ui/GlassCard';
import { Icon, type IconName } from '../components/ui/icons';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Screen } from '../components/ui/Screen';
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
  const completedTotal = visible.reduce((sum, unit) => sum + unit.lessons.filter((lesson) => lesson.status === 'completed').length, 0);
  const lessonsTotal = visible.reduce((sum, unit) => sum + unit.lessons.length, 0);

  return (
    <Screen className="max-w-2xl">
      <GlassCard className="!p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black">O'rganish yo'li</h1>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {completedTotal}/{lessonsTotal} dars tugatildi
            </p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
            <Icon name="map" size={22} />
          </span>
        </div>
        <ProgressBar value={lessonsTotal ? Math.round((completedTotal / lessonsTotal) * 100) : 0} className="mt-3" />
      </GlassCard>

      <div className="space-y-8">
        {visible.map((unit, unitIndex) => (
          <section key={unit.id}>
            {/* Unit sarlavhasi */}
            <div className="sticky top-16 z-10 lg:top-2">
              <div className="rounded-2xl border-2 border-b-4 border-ink-900/10 bg-brand-600 p-4 text-white dark:border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-75">Unit {unitIndex + 1}</p>
                    <h2 className="text-lg font-black leading-tight">{unit.subtitle}</h2>
                  </div>
                  <span className="rounded-xl bg-white/15 px-3 py-1.5 text-sm font-black">{unit.progress_percent}%</span>
                </div>
              </div>
            </div>

            {/* Ilon izi yo'l */}
            <div className="mt-6 space-y-5">
              {unit.lessons.map((lesson, index) => {
                const offset = SNAKE_OFFSETS[index % SNAKE_OFFSETS.length];
                const isNext = lesson.status === 'available' || lesson.status === 'in_progress';
                return (
                  <div key={lesson.id} className="flex justify-center" style={{ transform: `translateX(${offset}px)` }}>
                    <div className="relative flex flex-col items-center">
                      {isNext ? (
                        <span className="absolute -top-8 z-10 animate-bounce-soft rounded-xl border-2 border-brand-600/30 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wide text-brand-600 dark:bg-ink-800 dark:text-brand-300">
                          Boshla
                        </span>
                      ) : null}
                      <button
                        type="button"
                        disabled={lesson.status === 'locked'}
                        onClick={() => setSelected(lesson)}
                        aria-label={lesson.title}
                        className={`grid h-[72px] w-[72px] place-items-center rounded-full border-b-[6px] transition active:translate-y-[3px] active:border-b-2 disabled:active:translate-y-0 ${nodeTone(lesson)}`}
                      >
                        <Icon name={nodeIcon(lesson)} size={28} />
                      </button>
                      <p className="mt-1.5 max-w-[130px] text-center text-[11px] font-black leading-tight text-slate-500 dark:text-slate-400">
                        {lesson.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Dars oynasi */}
      {selected ? (
        <div className="fixed inset-0 z-40 grid place-items-end bg-ink-950/55 p-3 sm:place-items-center" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-md animate-slide-up rounded-2xl border-2 border-ink-900/10 bg-white p-5 shadow-hard-lg dark:border-white/10 dark:bg-ink-800"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border-b-4 ${nodeTone(selected)}`}>
                <Icon name={nodeIcon(selected)} size={22} />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-black">{selected.title}</h2>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{selected.subtitle}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <ModalStat label="So'zlar" value={selected.wordIds.length} />
              <ModalStat label="XP" value={`+${selected.xp}`} />
              <ModalStat label="Holat" value={statusLabel(selected.status)} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <SecondaryActionButton onClick={() => setSelected(null)}>Yopish</SecondaryActionButton>
              <PrimaryActionButton disabled={selected.status === 'locked'} onClick={() => startLesson(selected)}>
                Boshlash
              </PrimaryActionButton>
            </div>
          </div>
        </div>
      ) : null}
    </Screen>
  );
}

const SNAKE_OFFSETS = [0, -70, -100, -70, 0, 70, 100, 70];

function nodeIcon(lesson: LearningLesson): IconName {
  if (lesson.status === 'completed') return 'check';
  if (lesson.status === 'locked') return 'x';
  if (lesson.type === 'review' || lesson.status === 'review_needed') return 'flame';
  if (lesson.type === 'mixedChallenge') return 'trophy';
  return 'star';
}

function nodeTone(lesson: LearningLesson) {
  if (lesson.status === 'completed') return 'border-success-700 bg-success-500 text-white';
  if (lesson.status === 'review_needed' || lesson.type === 'review') return 'border-warn-600 bg-warn-500 text-white';
  if (lesson.type === 'mixedChallenge' && lesson.status !== 'locked') return 'border-violet-700 bg-violet-500 text-white';
  if (lesson.status === 'available' || lesson.status === 'in_progress') return 'border-brand-800 bg-brand-600 text-white shadow-glow';
  return 'border-ink-900/15 bg-ink-100 text-slate-400 dark:border-white/10 dark:bg-ink-900 dark:text-slate-600';
}

function statusLabel(status: LearningLesson['status']) {
  switch (status) {
    case 'completed':
      return 'Tugatilgan';
    case 'available':
      return 'Ochiq';
    case 'in_progress':
      return 'Davom etmoqda';
    case 'review_needed':
      return 'Takror kerak';
    default:
      return 'Yopiq';
  }
}

function ModalStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border-2 border-ink-900/[0.07] bg-ink-50 p-2.5 dark:border-white/[0.07] dark:bg-ink-900">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-sm font-black">{value}</p>
    </div>
  );
}
