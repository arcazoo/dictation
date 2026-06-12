import { useMemo, useState } from 'react';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { EmptyState } from '../components/ui/EmptyState';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientCard } from '../components/ui/GradientCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Screen } from '../components/ui/Screen';
import { SectionHeader } from '../components/ui/SectionHeader';
import { GRAMMAR_TOPICS, LEARNING_METHODS } from '../data/grammar';
import type { GrammarExercise, GrammarTopic } from '../types';

type GrammarFilter = 'all' | GrammarTopic['category'] | GrammarTopic['level'];

export function GrammarPage({ openAi }: { openAi: (prompt: string) => void }) {
  const [filter, setFilter] = useState<GrammarFilter>('all');
  const [activeId, setActiveId] = useState(GRAMMAR_TOPICS[0]?.id ?? '');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const topics = useMemo(
    () =>
      GRAMMAR_TOPICS.filter((topic) => {
        if (filter === 'all') return true;
        return topic.category === filter || topic.level === filter;
      }),
    [filter],
  );
  const active = GRAMMAR_TOPICS.find((topic) => topic.id === activeId) ?? topics[0] ?? GRAMMAR_TOPICS[0];
  const completed = active.exercises.filter((exercise) => checked[exercise.id] && isCorrect(exercise, answers[exercise.id] ?? '')).length;
  const percent = active.exercises.length ? Math.round((completed / active.exercises.length) * 100) : 0;

  return (
    <Screen className="max-w-7xl">
      <GradientCard variant="emerald">
        <p className="text-sm font-black uppercase opacity-80">Grammar Lab</p>
        <h1 className="mt-2 text-3xl font-black sm:text-5xl">Rus tili grammatikasi va mashqlar</h1>
        <p className="mt-2 max-w-2xl text-sm font-bold opacity-85">
          Qoidani o‘qing, misolni ko‘ring, drill qiling, keyin AI bilan real gapga aylantiring.
        </p>
      </GradientCard>

      <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <GlassCard>
            <SectionHeader title="Metodlar" subtitle="Grammatikani yodlash emas, ishlatish uchun." />
            <div className="mt-4 grid gap-3">
              {LEARNING_METHODS.map((method) => (
                <details key={method.id} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                  <summary className="cursor-pointer text-sm font-black">{method.title}</summary>
                  <p className="mt-2 text-xs font-bold text-slate-500">{method.goal}</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-slate-500">
                    {method.steps.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                  <p className="mt-2 text-xs font-black text-brand-600">Best: {method.bestFor}</p>
                </details>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <SectionHeader title="Mavzular" subtitle={`${topics.length} ta topic`} />
            <div className="mt-4 flex flex-wrap gap-2">
              {(['all', 'beginner', 'elementary', 'intermediate', 'foundation', 'nouns', 'verbs', 'cases', 'sentence'] as GrammarFilter[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-2xl px-3 py-2 text-xs font-black ${
                    filter === item ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto pr-1">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setActiveId(topic.id)}
                  className={`w-full rounded-2xl p-3 text-left transition ${
                    active.id === topic.id ? 'bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-100' : 'bg-slate-50 dark:bg-slate-950'
                  }`}
                >
                  <p className="text-sm font-black">{topic.title}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{topic.subtitle}</p>
                </button>
              ))}
            </div>
          </GlassCard>
        </aside>

        {active ? (
          <main className="space-y-4">
            <GlassCard>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-brand-600">{active.level} / {active.category}</p>
                  <h2 className="mt-2 text-3xl font-black">{active.title}</h2>
                  <p className="mt-1 text-sm font-bold text-slate-500">{active.subtitle}</p>
                </div>
                <div className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-white dark:bg-white dark:text-slate-950">
                  <p className="text-2xl font-black">{percent}%</p>
                  <p className="text-xs font-bold opacity-70">drill</p>
                </div>
              </div>
              <ProgressBar value={percent} className="mt-4" />
            </GlassCard>

            <GlassCard>
              <SectionHeader title="Qoida" subtitle="Qisqa va ishlatishga tayyor." />
              <p className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                {active.rule_uz}
              </p>
            </GlassCard>

            <GlassCard>
              <SectionHeader title="Misollar" subtitle="Ruscha gap + o‘zbekcha ma’no." />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {active.examples.map((example) => (
                  <div key={example.ru} className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                    <p className="text-lg font-black">{example.ru}</p>
                    <p className="mt-1 text-sm font-bold text-slate-500">{example.uz}</p>
                    {example.note ? <p className="mt-2 text-xs text-brand-600">{example.note}</p> : null}
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <SectionHeader
                title="Mashqlar"
                subtitle="Javobni yozing yoki variant tanlang."
                action={<SecondaryActionButton onClick={() => openAi(`${active.title} mavzusini tushuntir va menga 5 ta mashq ber.`)}>AI bilan mashq</SecondaryActionButton>}
              />
              <div className="mt-4 space-y-3">
                {active.exercises.map((exercise) => {
                  const value = answers[exercise.id] ?? '';
                  const wasChecked = checked[exercise.id];
                  const correct = isCorrect(exercise, value);
                  return (
                    <div key={exercise.id} className="rounded-3xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                      <p className="text-sm font-black">{exercise.prompt}</p>
                      {exercise.choices ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {exercise.choices.map((choice) => (
                            <button
                              key={choice}
                              type="button"
                              onClick={() => setAnswers((current) => ({ ...current, [exercise.id]: choice }))}
                              className={`rounded-2xl px-4 py-3 text-sm font-black ${
                                value === choice ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {choice}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          value={value}
                          onChange={(event) => setAnswers((current) => ({ ...current, [exercise.id]: event.target.value }))}
                          className="mt-3 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 font-bold outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-900"
                          placeholder="Javobni yozing"
                        />
                      )}
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <PrimaryActionButton className="min-h-10 px-4 py-2 text-xs" onClick={() => setChecked((current) => ({ ...current, [exercise.id]: true }))}>
                          Tekshirish
                        </PrimaryActionButton>
                        {wasChecked ? (
                          <p className={`text-sm font-black ${correct ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {correct ? "To'g'ri" : `Javob: ${exercise.answer}`}
                          </p>
                        ) : null}
                      </div>
                      {wasChecked ? <p className="mt-2 text-xs font-bold text-slate-500">{exercise.explanation_uz}</p> : null}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </main>
        ) : (
          <EmptyState title="Mavzu topilmadi" text="Boshqa filter tanlang." />
        )}
      </section>
    </Screen>
  );
}

function isCorrect(exercise: GrammarExercise, value: string) {
  return normalize(value) === normalize(exercise.answer);
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[.!?]+$/g, '').replace(/\s+/g, ' ');
}
