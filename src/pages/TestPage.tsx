import { useMemo, useState } from 'react';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { GlassCard } from '../components/ui/GlassCard';
import { Icon } from '../components/ui/icons';
import { PillTabs } from '../components/ui/PillTabs';
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
    <Screen className="max-w-xl">
      <GlassCard className="!p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-black">Test</h1>
            <p className="truncate text-xs font-bold text-slate-500 dark:text-slate-400">{source.title}</p>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
            <Icon name="clipboard" size={22} />
          </span>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <select
            value={sourceKey(source)}
            onChange={(event) => {
              const value = event.target.value;
              if (value === 'today') setSource({ kind: 'today', title: 'Bugungi test' });
              else if (value === 'mistakes') setSource({ kind: 'mistakes', title: "Xato so'zlar testi" });
              else if (value.includes(':')) {
                const [category, page] = value.split(':') as [Category, string];
                const meta = CATEGORIES.find((item) => item.id === category);
                setSource({ kind: 'page', title: `${meta?.title ?? category} / ${page}-varaq testi`, category, page: Number(page) });
              } else {
                setSource({
                  kind: 'category',
                  title: CATEGORIES.find((item) => item.id === value)?.title ?? value,
                  category: value as Category,
                });
              }
            }}
            className="min-h-12 w-full rounded-xl border-2 border-ink-900/10 bg-white px-3 text-sm font-black outline-none focus:border-brand-500 dark:border-white/10 dark:bg-ink-900"
          >
            <option value="today">Bugungi dars</option>
            <option value="mistakes">Xato so'zlar</option>
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
            {CATEGORIES.flatMap((category) =>
              [...new Set(words.filter((word) => word.category === category.id).map((word) => word.page))].map((page) => (
                <option key={`${category.id}:${page}`} value={`${category.id}:${page}`}>
                  {category.title} / {page}-varaq
                </option>
              )),
            )}
          </select>
          <PillTabs
            value={mode}
            onChange={setMode}
            items={[
              { id: 'choice', label: '4 variant' },
              { id: 'written', label: 'Yozma' },
            ]}
          />
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

function sourceKey(source: StudySource) {
  if (source.kind === 'category') return source.category;
  if (source.kind === 'page') return `${source.category}:${source.page}`;
  if (source.kind === 'mistakes') return 'mistakes';
  return 'today';
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
    <>
      <div className="flex items-center gap-3">
        <ProgressBar value={percent} className="flex-1" />
        <span className="text-xs font-black text-slate-400">
          {correct} ✓
        </span>
      </div>

      <GlassCard key={word.id} className="animate-slide-up">
        <p className="text-[11px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400">{word.category_ru}</p>
        <h2 className="mt-2 text-3xl font-black leading-snug">
          {reverse ? `«${word.uzbek}» rus tilida qanday?` : `«${word.russian}» nimani anglatadi?`}
        </h2>
        <div className="mt-5 grid gap-2">
          {choices.map((choice) => {
            const isAnswer = choice === answer;
            const isPicked = choice === selected;
            const tone = !selected
              ? 'border-ink-900/12 bg-white hover:border-brand-500/40 dark:border-white/12 dark:bg-ink-900'
              : isAnswer
                ? 'border-success-600 bg-success-100 text-success-800 dark:bg-success-700/20 dark:text-success-500'
                : isPicked
                  ? 'border-danger-600 bg-danger-100 text-danger-800 dark:bg-danger-700/20 dark:text-danger-500'
                  : 'border-ink-900/10 bg-white opacity-50 dark:border-white/10 dark:bg-ink-900';
            return (
              <button
                key={choice}
                type="button"
                onClick={() => pick(choice)}
                disabled={Boolean(selected)}
                className={`min-h-14 rounded-2xl border-2 border-b-4 px-4 py-3 text-left text-base font-black transition active:translate-y-[2px] active:border-b-2 disabled:active:translate-y-0 ${tone}`}
              >
                {choice}
              </button>
            );
          })}
        </div>
        {selected ? (
          <div
            className={`mt-4 flex items-center justify-between gap-3 rounded-2xl p-4 ${
              selected === answer ? 'bg-success-100 dark:bg-success-700/20' : 'bg-danger-100 dark:bg-danger-700/20'
            }`}
          >
            <p className="font-black">
              {selected === answer ? "To'g'ri! ✓" : `To'g'ri javob: ${answer}`}
            </p>
            <PrimaryActionButton onClick={next}>Keyingisi</PrimaryActionButton>
          </div>
        ) : null}
      </GlassCard>
    </>
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
    if (!word || !input.trim() || result) return;
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
    <GlassCard key={word.id} className="animate-slide-up">
      <p className="text-[11px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400">Tarjima qiling</p>
      <h2 className="mt-3 text-4xl font-black">{word.russian}</h2>
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') void check();
        }}
        disabled={result !== null}
        placeholder="Tarjimani yozing..."
        className="mt-5 w-full rounded-2xl border-2 border-ink-900/12 bg-white px-4 py-3.5 text-lg font-bold outline-none transition focus:border-brand-500 dark:border-white/12 dark:bg-ink-900"
      />
      {result ? (
        <div
          className={`mt-4 rounded-2xl p-4 ${
            result === 'correct'
              ? 'bg-success-100 dark:bg-success-700/20'
              : result === 'close'
                ? 'bg-warn-100 dark:bg-amber-950/40'
                : 'bg-danger-100 dark:bg-danger-700/20'
          }`}
        >
          <p className="font-black">{answerLabel(result)}</p>
          <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">To'g'ri javob: {word.uzbek}</p>
        </div>
      ) : null}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <PrimaryActionButton onClick={() => void check()} disabled={!!result || !input.trim()}>
          Tekshirish
        </PrimaryActionButton>
        <SecondaryActionButton onClick={next}>Keyingisi</SecondaryActionButton>
      </div>
    </GlassCard>
  );
}
