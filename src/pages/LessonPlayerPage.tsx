import { useMemo, useState } from 'react';
import { AudioButton } from '../components/ai/AudioButton';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { ConfettiLayer } from '../components/ui/ConfettiLayer';
import { GlassCard } from '../components/ui/GlassCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Screen } from '../components/ui/Screen';
import { gradeWrittenAnswer } from '../lib/answer';
import { buildExercisesForLesson, isChoiceExercise } from '../lib/exercises';
import { makeExerciseResult, xpForResult } from '../lib/gamification';
import type { AnswerQuality, Exercise, ExerciseResult, LearningLesson, Settings, UserProgress, Word } from '../types';

export function LessonPlayerPage({
  lesson,
  words,
  progress,
  hearts,
  reviewWord,
  onFinish,
}: {
  lesson: LearningLesson;
  words: Word[];
  progress: Record<string, UserProgress>;
  settings: Settings;
  hearts: number;
  reviewWord: (word: Word, result: AnswerQuality, mode: 'multipleChoice' | 'written', responseMs?: number) => Promise<void>;
  onFinish: (summary: { score: number; xp: number; mistakes: number; results: ExerciseResult[] }) => Promise<void>;
}) {
  const lessonWords = useMemo(() => words.filter((word) => lesson.wordIds.includes(word.id)).slice(0, 18), [lesson.wordIds, words]);
  const exercises = useMemo(() => buildExercisesForLesson(lesson.id, lessonWords, words), [lesson.id, lessonWords, words]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ quality: AnswerQuality; message: string; correctAnswer: string } | null>(null);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [completed, setCompleted] = useState(false);
  const exercise = exercises[index];
  const progressPercent = exercises.length ? Math.round((index / exercises.length) * 100) : 0;
  const score = results.filter((item) => item.result === 'correct').length;
  const mistakes = results.filter((item) => item.result === 'wrong').length;
  const totalXp = results.reduce((sum, item) => sum + item.xp_earned, 0);

  async function check() {
    if (!exercise || feedback) return;
    const responseMs = Date.now() - startedAt;
    const candidate = selectedTokens.length ? selectedTokens.join(exercise.type === 'wordBuilder' ? '' : ' ') : answer;
    const quality = gradeExercise(exercise, candidate);
    const xp = xpForResult(quality, progress[exercise.word.id]);
    const result = makeExerciseResult({
      exerciseId: exercise.id,
      lessonId: lesson.id,
      wordId: exercise.word.id,
      type: exercise.type,
      result: quality,
      responseMs,
      xp,
    });
    await reviewWord(exercise.word, quality, isChoiceExercise(exercise.type) ? 'multipleChoice' : 'written', responseMs);
    setResults((current) => [...current, result]);
    setFeedback({
      quality,
      correctAnswer: exercise.correctAnswer,
      message: quality === 'correct' ? "Zo'r, to'g'ri!" : quality === 'close' ? "Yaqin. Bitta joyini charxlaymiz." : "Noto'g'ri, lekin shu yerda tuzatamiz.",
    });
  }

  async function next() {
    if (index + 1 >= exercises.length) {
      const finalResults = results;
      const finalMistakes = finalResults.filter((item) => item.result === 'wrong').length;
      const finalXp = finalResults.reduce((sum, item) => sum + item.xp_earned, 0) + (finalMistakes === 0 ? 20 : 0);
      setCompleted(true);
      await onFinish({
        score: finalResults.filter((item) => item.result === 'correct').length,
        xp: finalXp,
        mistakes: finalMistakes,
        results: finalResults,
      });
      return;
    }
    setIndex((value) => value + 1);
    setAnswer('');
    setSelectedTokens([]);
    setFeedback(null);
    setStartedAt(Date.now());
  }

  if (!exercise) {
    return (
      <Screen>
        <GlassCard>Bu lesson uchun mashqlar topilmadi. Boshqa lesson tanlang.</GlassCard>
      </Screen>
    );
  }

  const canCheck = Boolean(answer || selectedTokens.length);

  return (
    <Screen className="max-w-4xl">
      <div className="sticky top-0 z-20 -mx-3 bg-white/75 px-3 py-3 backdrop-blur-xl dark:bg-slate-950/75 lg:top-5 lg:mx-0 lg:rounded-3xl lg:border lg:border-white/60 lg:shadow-soft dark:lg:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-black">{lesson.title}</p>
                <p className="text-xs font-bold text-slate-500">{index + 1}/{exercises.length} / {lesson.subtitle}</p>
              </div>
              <span className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-600 dark:bg-rose-950/60 dark:text-rose-100">{Math.max(0, hearts)} hearts</span>
            </div>
            <ProgressBar value={progressPercent} className="mt-3" />
          </div>
        </div>
      </div>

      <GlassCard className="relative overflow-hidden">
        <ConfettiLayer active={completed || feedback?.quality === 'correct'} />
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 p-5 text-white dark:from-white dark:to-slate-200 dark:text-slate-950">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase">{exercise.type}</span>
            <AudioButton text={exercise.word.russian} />
          </div>
          <h1 className="mt-5 text-3xl font-black leading-tight">{exercise.prompt}</h1>
          <p className="mt-3 text-sm font-bold opacity-75">{exercise.word.category_ru} / {exercise.word.page}-varaq</p>
        </div>

        <div className="mt-5">
          {exercise.choices ? (
            <ChoiceGrid exercise={exercise} answer={answer} feedback={feedback} setAnswer={setAnswer} />
          ) : exercise.tokens ? (
            <TokenBuilder
              exercise={exercise}
              selectedTokens={selectedTokens}
              setSelectedTokens={setSelectedTokens}
            />
          ) : (
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              className="min-h-32 w-full resize-none rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 text-lg font-bold outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-brand-950"
              placeholder="Javobni yozing..."
            />
          )}
        </div>

        {feedback ? <FeedbackPanel feedback={feedback} /> : null}
      </GlassCard>

      <div className="sticky bottom-24 z-20 rounded-3xl border border-white/70 bg-white/85 p-3 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 lg:bottom-5">
        <div className="grid grid-cols-2 gap-3">
          <PrimaryActionButton disabled={feedback !== null || !canCheck} onClick={check}>
            Tekshirish
          </PrimaryActionButton>
          <SecondaryActionButton disabled={!feedback} onClick={next}>
            Davom etish
          </SecondaryActionButton>
        </div>
      </div>
    </Screen>
  );
}

function ChoiceGrid({
  exercise,
  answer,
  feedback,
  setAnswer,
}: {
  exercise: Exercise;
  answer: string;
  feedback: { quality: AnswerQuality; correctAnswer: string } | null;
  setAnswer: (value: string) => void;
}) {
  return (
    <div className="grid gap-3">
      {exercise.choices?.map((choice) => {
        const selected = answer === choice;
        const correct = feedback && choice === exercise.correctAnswer;
        const wrong = feedback && selected && choice !== exercise.correctAnswer;
        return (
          <button
            key={choice}
            type="button"
            onClick={() => setAnswer(choice)}
            disabled={Boolean(feedback)}
            className={`min-h-16 rounded-3xl border px-5 text-left text-base font-black shadow-soft transition active:scale-[0.98] ${
              correct
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-100'
                : wrong
                  ? 'border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-100'
                  : selected
                    ? 'border-brand-400 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-100'
                    : 'border-white bg-white/88 text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100'
            }`}
          >
            {choice}
          </button>
        );
      })}
    </div>
  );
}

function TokenBuilder({
  exercise,
  selectedTokens,
  setSelectedTokens,
}: {
  exercise: Exercise;
  selectedTokens: string[];
  setSelectedTokens: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <div>
      <div className="min-h-16 rounded-3xl border border-brand-100 bg-brand-50 p-4 text-lg font-black text-brand-700 dark:border-brand-900 dark:bg-brand-950/50 dark:text-brand-100">
        {selectedTokens.join(exercise.type === 'wordBuilder' ? '' : ' ') || 'Tokenlarni tanlang...'}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {exercise.tokens?.map((token, tokenIndex) => (
          <button
            key={`${token}-${tokenIndex}`}
            type="button"
            onClick={() => setSelectedTokens((current) => [...current, token])}
            className="rounded-2xl bg-white px-4 py-3 text-sm font-black shadow-soft transition active:scale-[0.96] dark:bg-slate-900"
          >
            {token}
          </button>
        ))}
      </div>
      <SecondaryActionButton className="mt-4" onClick={() => setSelectedTokens([])}>
        Reset
      </SecondaryActionButton>
    </div>
  );
}

function FeedbackPanel({ feedback }: { feedback: { quality: AnswerQuality; message: string; correctAnswer: string } }) {
  const tone =
    feedback.quality === 'correct'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100'
      : feedback.quality === 'close'
        ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100'
        : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-100';
  return (
    <div className={`mt-5 rounded-3xl border p-4 font-bold ${tone}`}>
      <p className="text-lg font-black">{feedback.message}</p>
      <p className="mt-2 text-sm">To'g'ri javob: <span className="font-black">{feedback.correctAnswer}</span></p>
    </div>
  );
}

function gradeExercise(exercise: Exercise, answer: string): AnswerQuality {
  if (!answer.trim()) return 'wrong';
  if (exercise.type === 'writtenRecall' || exercise.type === 'aiExample') return gradeWrittenAnswer(answer, exercise.correctAnswer);
  const clean = answer.trim().toLowerCase();
  const expected = exercise.correctAnswer.trim().toLowerCase();
  if (clean === expected) return 'correct';
  return gradeWrittenAnswer(answer, exercise.correctAnswer);
}
