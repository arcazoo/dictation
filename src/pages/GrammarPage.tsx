import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientCard } from '../components/ui/GradientCard';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Screen } from '../components/ui/Screen';
import { SectionHeader } from '../components/ui/SectionHeader';
import {
  GRAMMAR_MODULES,
  GRAMMAR_TOPICS,
  LEARNING_METHODS,
  dueGrammarTopics,
  moduleProgressPercent,
  nextGrammarTopic,
  topicsForModule,
} from '../content/grammar';
import { useAppStore } from '../store/appStore';
import type { View } from '../components/Layout';

export function GrammarPage({ setView }: { setView: (view: View) => void }) {
  const grammarProgress = useAppStore((state) => state.grammarProgress);
  const setActiveGrammarTopic = useAppStore((state) => state.setActiveGrammarTopic);
  const [openModule, setOpenModule] = useState<number | null>(null);
  const [showMethods, setShowMethods] = useState(false);

  const completedCount = GRAMMAR_TOPICS.filter((topic) => grammarProgress[topic.id]?.completed).length;
  const totalPercent = Math.round((completedCount / GRAMMAR_TOPICS.length) * 100);
  const nextTopic = nextGrammarTopic(grammarProgress);
  const due = dueGrammarTopics(grammarProgress);

  const openTopic = (topicId: string) => {
    setActiveGrammarTopic(topicId);
    setView('grammarTopic');
  };

  return (
    <Screen>
      <GradientCard variant="violet">
        <p className="text-xs font-black uppercase tracking-widest opacity-80">Grammatika kursi</p>
        <h1 className="mt-1 text-2xl font-black">Rus tili A1 → C1</h1>
        <p className="mt-2 text-sm font-bold opacity-90">
          {GRAMMAR_MODULES.length} modul · {GRAMMAR_TOPICS.length} mavzu · {completedCount} tasi tugatildi
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-white transition-all" style={{ width: `${totalPercent}%` }} />
        </div>
        {nextTopic ? (
          <PrimaryActionButton className="mt-5 w-full bg-white/95 !text-violet-700 sm:w-auto" onClick={() => openTopic(nextTopic.id)}>
            Davom etish: {nextTopic.title}
          </PrimaryActionButton>
        ) : (
          <p className="mt-4 text-sm font-black">Kurs to‘liq tugatildi! 🎉</p>
        )}
      </GradientCard>

      {due.length > 0 ? (
        <GlassCard>
          <SectionHeader title="Takrorlash vaqti keldi" subtitle={`${due.length} ta mavzu takror so'raydi`} />
          <div className="mt-3 flex flex-wrap gap-2">
            {due.slice(0, 6).map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => openTopic(topic.id)}
                className="rounded-2xl bg-amber-50 px-4 py-2 text-sm font-black text-amber-700 ring-1 ring-amber-200 transition active:scale-[0.97] dark:bg-amber-950/50 dark:text-amber-100 dark:ring-amber-900"
              >
                {topic.title}
              </button>
            ))}
          </div>
        </GlassCard>
      ) : null}

      <div className="space-y-3">
        {GRAMMAR_MODULES.map((module) => {
          const topics = topicsForModule(module.id);
          const percent = moduleProgressPercent(module.id, grammarProgress);
          const open = openModule === module.id;
          return (
            <GlassCard key={module.id} className="!p-4">
              <button
                type="button"
                className="flex w-full items-center gap-4 text-left"
                onClick={() => setOpenModule(open ? null : module.id)}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 text-lg font-black text-white">
                  {module.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-base font-black">
                      {module.id}-modul. {module.title}
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {module.level}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs font-bold text-slate-500 dark:text-slate-400">{module.subtitle}</span>
                  <ProgressBar value={percent} className="mt-2" tone="violet" />
                </span>
                <span className="text-sm font-black text-slate-400">{open ? '−' : '+'}</span>
              </button>

              {open ? (
                <div className="mt-4 space-y-2">
                  {topics.map((topic) => {
                    const progress = grammarProgress[topic.id];
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => openTopic(topic.id)}
                        className="flex w-full items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 text-left shadow-soft ring-1 ring-slate-100 transition active:scale-[0.99] dark:bg-slate-900/80 dark:ring-slate-800"
                      >
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-black ${
                            progress?.completed
                              ? 'bg-success-100 text-success-700 dark:bg-success-700/20 dark:text-success-500'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {progress?.completed ? '✓' : topic.order}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-black">{topic.title}</span>
                          <span className="block truncate text-xs font-bold text-slate-500 dark:text-slate-400">{topic.subtitle}</span>
                        </span>
                        {progress?.best_score ? (
                          <span className="text-xs font-black text-slate-400">{progress.best_score}%</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </GlassCard>
          );
        })}
      </div>

      <GlassCard>
        <button type="button" className="flex w-full items-center justify-between" onClick={() => setShowMethods((value) => !value)}>
          <SectionHeader title="O'rganish metodlari" subtitle="Qanday mashq qilish samarali" />
          <span className="text-sm font-black text-slate-400">{showMethods ? '−' : '+'}</span>
        </button>
        {showMethods ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {LEARNING_METHODS.map((method) => (
              <div key={method.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-sm font-black">{method.title}</p>
                <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{method.goal}</p>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                  {method.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p className="mt-2 text-[11px] font-black uppercase tracking-wide text-violet-500">{method.bestFor}</p>
              </div>
            ))}
          </div>
        ) : null}
      </GlassCard>

      <SecondaryActionButton className="w-full" onClick={() => setView('today')}>
        Bugungi darsga qaytish
      </SecondaryActionButton>
    </Screen>
  );
}
