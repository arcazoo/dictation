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
  const lessonWords = useMemo(() => words.filter((word) => lesson.wordIds.includes(word.id)).slice(0, 12), [lesson.wordIds, words]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- progress ataylab dependency emas: mashqlar dars boshida bir marta tuziladi
  const exercises = useMemo(() => buildExercisesForLesson(lesson.id, lessonWords, words, progress), [lesson.id, lessonWords, words]);
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

  function skipIntro() {
    // Tanishtirish bosqichi baholanmaydi — shunchaki keyingisiga o'tamiz
    void next();
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
      <div className="sticky top-0 z-20 -mx-3 bg-[#f4f5fb]/92 px-3 py-3 backdrop-blur-md dark:bg-ink-950/92 lg:top-5 lg:mx-0 lg:rounded-2xl lg:border-2 lg:border-ink-900/[0.07] lg:bg-white lg:shadow-hard dark:lg:border-white/[0.07] dark:lg:bg-ink-800">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-black">{lesson.title}</p>
                <p className="text-xs font-bold text-slate-500">{index + 1}/{exercises.length} · {lesson.subtitle}</p>
              </div>
              <span className="rounded-xl border-2 border-danger-500/25 bg-danger-100/60 px-3 py-1.5 text-xs font-black text-danger-700 dark:bg-rose-950/60 dark:text-rose-200">♥ {Math.max(0, hearts)}</span>
            </div>
            <ProgressBar value={progressPercent} className="mt-3" />
          </div>
        </div>
      </div>

      <GlassCard className="relative overflow-hidden">
        <ConfettiLayer active={completed || feedback?.quality === 'correct'} />
        <div className="rounded-2xl border-2 border-ink-900/10 bg-gradient-to-br from-brand-600 to-violet-600 p-5 text-white dark:border-white/10">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase">{exerciseTypeLabel(exercise.type)}</span>
            <AudioButton text={exercise.word.russian} />
          </div>
          {exercise.type === 'introduce' ? (
            <div className="mt-5">
              <h1 className="text-4xl font-black leading-tight">{exercise.word.stressed ?? exercise.word.russian}</h1>
              <p className="mt-2 text-xl font-black opacity-90">{exercise.word.uzbek}</p>
              {exercise.word.example_ru ? (
                <p className="mt-4 rounded-2xl bg-white/10 p-3 text-sm font-bold">
                  {exercise.word.example_ru}
                  {exercise.word.example_uz ? <span className="mt-1 block opacity-75">{exercise.word.example_uz}</span> : null}
                </p>
              ) : null}
            </div>
          ) : (
            <h1 className="mt-5 text-3xl font-black leading-tight">{exercise.prompt}</h1>
          )}
          <p className="mt-3 text-sm font-bold opacity-75">{exercise.word.category_ru} / {exercise.word.page}-varaq</p>
        </div>

        {exercise.type !== 'introduce' ? (
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
                className="min-h-32 w-full resize-none rounded-2xl border-2 border-ink-900/12 bg-white px-5 py-4 text-lg font-bold outline-none transition focus:border-brand-500 dark:border-white/12 dark:bg-ink-900"
                placeholder="Javobni yozing..."
              />
            )}
          </div>
        ) : null}

        {feedback ? <FeedbackPanel feedback={feedback} /> : null}
      </GlassCard>

      <div className="sticky bottom-24 z-20 rounded-2xl border-2 border-ink-900/[0.08] bg-white p-3 shadow-hard-lg dark:border-white/[0.08] dark:bg-ink-800 dark:shadow-hard-dark lg:bottom-5">
        {exercise.type === 'introduce' ? (
          <PrimaryActionButton className="w-full" onClick={skipIntro}>
            Tushundim, davom etamiz
          </PrimaryActionButton>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <PrimaryActionButton disabled={feedback !== null || !canCheck} onClick={check}>
              Tekshirish
            </PrimaryActionButton>
            <SecondaryActionButton disabled={!feedback} onClick={next}>
              Davom etish
            </SecondaryActionButton>
          </div>
        )}
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
            className={`min-h-14 rounded-2xl border-2 border-b-4 px-5 py-3 text-left text-base font-black transition active:translate-y-[2px] active:border-b-2 disabled:active:translate-y-0 ${
              correct
                ? 'border-success-600 bg-success-100 text-success-800 dark:bg-success-700/20 dark:text-success-500'
                : wrong
                  ? 'border-danger-600 bg-danger-100 text-danger-800 dark:bg-danger-700/20 dark:text-danger-500'
                  : selected
                    ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-200'
                    : 'border-ink-900/12 bg-white text-ink-700 hover:border-brand-500/40 dark:border-white/12 dark:bg-ink-900 dark:text-slate-100'
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
      <div className="min-h-16 rounded-2xl border-2 border-brand-600/25 bg-brand-50 p-4 text-lg font-black text-brand-700 dark:border-brand-500/25 dark:bg-brand-950/50 dark:text-brand-200">
        {selectedTokens.join(exercise.type === 'wordBuilder' ? '' : ' ') || 'Harf yoki so‘zlarni tanlang...'}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {exercise.tokens?.map((token, tokenIndex) => (
          <button
            key={`${token}-${tokenIndex}`}
            type="button"
            onClick={() => setSelectedTokens((current) => [...current, token])}
            className="rounded-xl border-2 border-b-4 border-ink-900/12 bg-white px-4 py-2.5 text-sm font-black transition active:translate-y-[2px] active:border-b-2 dark:border-white/12 dark:bg-ink-900"
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
      ? 'border-success-600/40 bg-success-100 text-success-800 dark:bg-success-700/20 dark:text-success-500'
      : feedback.quality === 'close'
        ? 'border-warn-500/40 bg-warn-100 text-warn-800 dark:bg-amber-950/50 dark:text-amber-200'
        : 'border-danger-600/40 bg-danger-100 text-danger-800 dark:bg-danger-700/20 dark:text-danger-500';
  return (
    <div className={`mt-5 rounded-2xl border-2 p-4 font-bold ${tone}`}>
      <p className="text-lg font-black">{feedback.message}</p>
      <p className="mt-2 text-sm">To'g'ri javob: <span className="font-black">{feedback.correctAnswer}</span></p>
    </div>
  );
}

function exerciseTypeLabel(type: Exercise['type']) {
  switch (type) {
    case 'introduce':
      return "Yangi so'z";
    case 'multipleChoiceRuUz':
    case 'multipleChoiceUzRu':
      return 'Tanlang';
    case 'writtenRecall':
    case 'writtenReverse':
      return 'Yozing';
    case 'wordBuilder':
      return "So'z tuzing";
    case 'sentenceBuilder':
      return 'Gap tuzing';
    case 'fillBlank':
      return "Bo'sh joy";
    case 'listenChoose':
    case 'listenType':
      return 'Tinglang';
    case 'speedRound':
      return 'Tezkor';
    case 'mistakeDrill':
      return 'Xato ustida ish';
    default:
      return 'Mashq';
  }
}

function gradeExercise(exercise: Exercise, answer: string): AnswerQuality {
  if (!answer.trim()) return 'wrong';
  if (exercise.type === 'writtenRecall' || exercise.type === 'aiExample') return gradeWrittenAnswer(answer, exercise.correctAnswer);
  const clean = answer.trim().toLowerCase();
  const expected = exercise.correctAnswer.trim().toLowerCase();
  if (clean === expected) return 'correct';
  return gradeWrittenAnswer(answer, exercise.correctAnswer);
}
