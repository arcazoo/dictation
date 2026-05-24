import { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { answerLabel, gradeWrittenAnswer } from '../lib/answer';
import { getChoices, getTodayLesson } from '../lib/lesson';
import type { AnswerQuality, Settings, UserProgress, Word } from '../types';

export function TestPage({
  words,
  progress,
  settings,
  reviewWord,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  settings: Settings;
  reviewWord: (word: Word, result: AnswerQuality, mode: 'multipleChoice' | 'written') => Promise<void>;
}) {
  const [mode, setMode] = useState<'choice' | 'written'>('choice');
  const [onlyMistakes, setOnlyMistakes] = useState(settings.testTypes.onlyMistakes);
  const queue = useMemo(() => {
    const base = onlyMistakes ? words.filter((word) => (progress[word.id]?.wrong_count ?? 0) > 0) : getTodayLesson(words, progress, settings);
    return base.length ? base : words;
  }, [onlyMistakes, progress, settings, words]);

  return (
    <>
      <PageHeader title="Test" subtitle="4 variantli test va yozma recall bir ekranda." />
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant={mode === 'choice' ? 'primary' : 'secondary'} onClick={() => setMode('choice')}>4 variant</Button>
        <Button variant={mode === 'written' ? 'primary' : 'secondary'} onClick={() => setMode('written')}>Yozma javob</Button>
        <Button variant={onlyMistakes ? 'danger' : 'ghost'} onClick={() => setOnlyMistakes((value) => !value)}>Faqat xatolar</Button>
      </div>
      {mode === 'choice' ? (
        <ChoiceTest words={words} queue={queue} reverse={settings.testTypes.reverseTranslation} reviewWord={reviewWord} />
      ) : (
        <WrittenTest queue={queue} reviewWord={reviewWord} />
      )}
    </>
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
  const word = queue[index % Math.max(queue.length, 1)];
  const choices = useMemo(() => (word ? getChoices(word, words, reverse) : []), [reverse, word, words]);
  const answer = reverse ? word?.russian : word?.uzbek;

  async function pick(choice: string) {
    if (!word || selected) return;
    setSelected(choice);
    await reviewWord(word, choice === answer ? 'correct' : 'wrong', 'multipleChoice');
  }

  function next() {
    setSelected(null);
    setIndex((value) => value + 1);
  }

  if (!word) return <Card>Test uchun so'z topilmadi.</Card>;

  return (
    <Card className="mx-auto max-w-2xl">
      <p className="text-sm font-bold text-brand-600">{word.category_ru}</p>
      <h2 className="mt-3 text-2xl font-black">
        {reverse ? `${word.uzbek} rus tilida qanday?` : `${word.russian} nimani anglatadi?`}
      </h2>
      <div className="mt-5 grid gap-3">
        {choices.map((choice, choiceIndex) => {
          const isAnswer = choice === answer;
          const isPicked = choice === selected;
          const tone = !selected
            ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            : isAnswer
              ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-100'
              : isPicked
                ? 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-500/15 dark:text-rose-100'
                : 'border-slate-200 bg-white opacity-70 dark:border-slate-800 dark:bg-slate-900';
          return (
            <button key={choice} onClick={() => pick(choice)} className={`min-h-14 rounded-lg border p-4 text-left font-bold ${tone}`}>
              {String.fromCharCode(65 + choiceIndex)}) {choice}
            </button>
          );
        })}
      </div>
      {selected ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm font-bold">{selected === answer ? "To'g'ri" : "Noto'g'ri"}</p>
          <Button onClick={next}>Keyingisi</Button>
        </div>
      ) : null}
    </Card>
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

  if (!word) return <Card>Yozma test uchun so'z topilmadi.</Card>;

  return (
    <Card className="mx-auto max-w-2xl">
      <p className="text-sm font-bold text-brand-600">Tarjima qiling</p>
      <h2 className="mt-3 text-4xl font-black">{word.russian}</h2>
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Tarjimani yozing"
        className="mt-6 min-h-14 w-full rounded-lg border border-slate-300 bg-white px-4 text-lg outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-950"
      />
      {result ? (
        <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
          <p className="font-black">{answerLabel(result)}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">To'g'ri javob: {word.uzbek}</p>
        </div>
      ) : null}
      <div className="mt-4 flex gap-3">
        <Button onClick={check} disabled={!!result}>Tekshirish</Button>
        <Button variant="secondary" onClick={next}>Keyingisi</Button>
      </div>
    </Card>
  );
}
