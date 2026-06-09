import { useMemo, useState } from 'react';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientCard } from '../components/ui/GradientCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Screen } from '../components/ui/Screen';
import { CATEGORIES } from '../data/categories';
import { answerLabel, gradeWrittenAnswer } from '../lib/answer';
import { getChoices } from '../lib/lesson';
import { getWordsForSource } from '../lib/source';
import type { AnswerQuality, Category, Settings, StudySource, UserProgress, Word } from '../types';

export function TestPage({
  words,
  progress,
  settings,
  source,
  setSource,
  reviewWord,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  settings: Settings;
  source: StudySource;
  setSource: (source: StudySource) => void;
  reviewWord: (word: Word, result: AnswerQuality, mode: 'multipleChoice' | 'written') => Promise<void>;
}) {
  const [mode, setMode] = useState<'choice' | 'written'>('choice');
  const queue = useMemo(() => {
    const selected = getWordsForSource(source, words, progress, settings);
    return selected.length ? selected : words;
  }, [progress, settings, source, words]);

  return (
    <Screen className="max-w-5xl">
      <GradientCard variant="amber">
        <p className="text-sm font-black uppercase opacity-80">Quiz arena</p>
        <h1 className="mt-2 text-3xl font-black sm:text-5xl">Test va written recall</h1>
        <p className="mt-2 text-sm font-bold opacity-85">{source.title} / RU-UZ, UZ-RU yoki yozma javob.</p>
      </GradientCard>

      <GlassCard>
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
          <SelectBox
            label="List"
            value={source.kind === 'category' ? source.category : source.kind}
            onChange={(value) => {
              if (value === 'today') setSource({ kind: 'today', title: 'Bugungi test' });
              else if (value === 'mistakes') setSource({ kind: 'mistakes', title: "Xato so'zlar testi" });
              else setSource({ kind: 'category', title: CATEGORIES.find((item) => item.id === value)?.title ?? value, category: value as Category });
            }}
            options={[
              { value: 'today', label: 'Bugungi dars' },
              { value: 'mistakes', label: "Xato so'zlar" },
              ...CATEGORIES.map((category) => ({ value: category.id, label: category.title })),
            ]}
          />
          <SelectBox
            label="Varaq"
            value={source.kind === 'page' ? `${source.category}:${source.page}` : 'all'}
            onChange={(value) => {
              if (value === 'all') return;
              const [category, page] = value.split(':') as [Category, string];
              const meta = CATEGORIES.find((item) => item.id === category);
              setSource({ kind: 'page', title: `${meta?.title ?? category} / ${page}-varaq testi`, category, page: Number(page) });
            }}
            options={[
              { value: 'all', label: 'Hammasi' },
              ...CATEGORIES.flatMap((category) =>
                [...new Set(words.filter((word) => word.category === category.id).map((word) => word.page))].map((page) => ({
                  value: `${category.id}:${page}`,
                  label: `${category.title} / ${page}-varaq`,
                })),
              ),
            ]}
          />
          <div className="grid grid-cols-2 gap-2 lg:self-end">
            <PrimaryActionButton className={mode === 'choice' ? '' : 'bg-white text-slate-900 shadow-soft'} onClick={() => setMode('choice')}>4 variant</PrimaryActionButton>
            <PrimaryActionButton className={mode === 'written' ? '' : 'bg-white text-slate-900 shadow-soft'} onClick={() => setMode('written')}>Yozma</PrimaryActionButton>
          </div>
        </div>
      </GlassCard>

      {mode === 'choice' ? (
        <ChoiceTest words={words} queue={queue} reverse={settings.testTypes.reverseTranslation} reviewWord={reviewWord} />
      ) : (
        <WrittenTest queue={queue} reviewWord={reviewWord} />
      )}
    </Screen>
  );
}

function SelectBox({ label, value, options, onChange }: { label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <label className="text-sm font-black">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function ChoiceTest({
  words,
  queue,
  reverse,
  reviewWord,
}: {
  words: Word[];
  queue: Word[];
  reverse: boolean;
  reviewWord: (word: Word, result: AnswerQuality, mode: 'multipleChoice') => Promise<void>;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const word = queue[index % Math.max(queue.length, 1)];
  const choices = useMemo(() => (word ? getChoices(word, words, reverse) : []), [reverse, word, words]);
  const answer = reverse ? word?.russian : word?.uzbek;
  const percent = queue.length ? Math.round((index / queue.length) * 100) : 0;

  async function pick(choice: string) {
    if (!word || selected) return;
    setSelected(choice);
    const ok = choice === answer;
    if (ok) setCorrect((value) => value + 1);
    await reviewWord(word, ok ? 'correct' : 'wrong', 'multipleChoice');
  }

  function next() {
    setSelected(null);
    setIndex((value) => value + 1);
  }

  if (!word) return <GlassCard>Test uchun so'z topilmadi.</GlassCard>;

  return (
    <GlassCard>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-brand-600">{word.category_ru}</p>
          <h2 className="mt-2 text-3xl font-black">{reverse ? `${word.uzbek} rus tilida qanday?` : `${word.russian} nimani anglatadi?`}</h2>
        </div>
        <span className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-black text-white dark:bg-white dark:text-slate-950">{correct}/{index + (selected ? 1 : 0)}</span>
      </div>
      <ProgressBar value={percent} className="mt-4" tone="amber" />
      <div className="mt-6 grid gap-3">
        {choices.map((choice, choiceIndex) => {
          const isAnswer = choice === answer;
          const isPicked = choice === selected;
          const tone = !selected
            ? 'border-white bg-white/90 text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50'
            : isAnswer
              ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100'
              : isPicked
                ? 'border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-100'
                : 'border-white bg-white/60 opacity-65 dark:border-slate-800 dark:bg-slate-900';
          return (
            <button key={choice} type="button" onClick={() => pick(choice)} className={`min-h-16 rounded-3xl border p-4 text-left font-black shadow-soft transition active:scale-[0.98] ${tone}`}>
              <span className="mr-3 rounded-xl bg-slate-100 px-3 py-2 text-xs dark:bg-slate-800">{String.fromCharCode(65 + choiceIndex)}</span>
              {choice}
            </button>
          );
        })}
      </div>
      {selected ? (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
          <p className="font-black">{selected === answer ? "To'g'ri" : `Noto'g'ri / ${answer}`}</p>
          <PrimaryActionButton onClick={next}>Keyingisi</PrimaryActionButton>
        </div>
      ) : null}
    </GlassCard>
  );
}

function WrittenTest({
  queue,
  reviewWord,
}: {
  queue: Word[];
  reviewWord: (word: Word, result: AnswerQuality, mode: 'written') => Promise<void>;
}) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AnswerQuality | null>(null);
  const word = queue[index % Math.max(queue.length, 1)];

  async function check() {
    if (!word || !input.trim()) return;
    const quality = gradeWrittenAnswer(input, word.uzbek);
    setResult(quality);
    await reviewWord(word, quality, 'written');
  }

  function next() {
    setInput('');
    setResult(null);
    setIndex((value) => value + 1);
  }

  if (!word) return <GlassCard>Yozma test uchun so'z topilmadi.</GlassCard>;

  return (
    <GlassCard className="mx-auto max-w-3xl">
      <p className="text-sm font-black text-brand-600">Tarjima qiling</p>
      <h2 className="mt-4 text-5xl font-black">{word.russian}</h2>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Tarjimani yozing"
        className="mt-6 min-h-28 w-full resize-none rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 text-lg font-bold outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
      />
      {result ? (
        <div className="mt-4 rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
          <p className="font-black">{answerLabel(result)}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">To'g'ri javob: {word.uzbek}</p>
        </div>
      ) : null}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <PrimaryActionButton onClick={check} disabled={!!result}>Tekshirish</PrimaryActionButton>
        <SecondaryActionButton onClick={next}>Keyingisi</SecondaryActionButton>
      </div>
    </GlassCard>
  );
}
