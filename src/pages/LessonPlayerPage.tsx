import { useMemo, useRef, useState } from 'react';
import { AudioButton } from '../components/ai/AudioButton';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { ConfettiLayer } from '../components/ui/ConfettiLayer';
import { GlassCard } from '../components/ui/GlassCard';
import { Icon } from '../components/ui/icons';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Screen } from '../components/ui/Screen';
import { gradeWrittenAnswer } from '../lib/answer';
import { buildExercisesForLesson, isChoiceExercise } from '../lib/exercises';
import { makeExerciseResult, xpForResult } from '../lib/gamification';
import { playCombo, playCorrect, playFinish, playWrong } from '../lib/sound';
import type { AnswerQuality, Exercise, ExerciseResult, LearningLesson, Settings, UserProgress, Word } from '../types';

const MAX_EXERCISES = 20;
const MAX_RETRIES_PER_EXERCISE = 2;

type Phase = 'playing' | 'summary';

export function LessonPlayerPage({
  lesson,
  words,
  progress,
  settings,
  reviewWord,
  onFinish,
}: {
  lesson: LearningLesson;
  words: Word[];
  progress: Record<string, UserProgress>;
  settings: Settings;
  reviewWord: (word: Word, result: AnswerQuality, mode: 'multipleChoice' | 'written', responseMs?: number) => Promise<void>;
  onFinish: (summary: { score: number; xp: number; mistakes: number; results: ExerciseResult[] }) => Promise<void>;
}) {
  const lessonWords = useMemo(() => words.filter((word) => lesson.wordIds.includes(word.id)).slice(0, 12), [lesson.wordIds, words]);
  const initialQueue = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mashqlar dars boshida bir marta tuziladi
    () => buildExercisesForLesson(lesson.id, lessonWords, words, progress).slice(0, MAX_EXERCISES),
    [lesson.id, lessonWords, words],
  );

  const [queue, setQueue] = useState<Exercise[]>(initialQueue);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('playing');
  const [answer, setAnswer] = useState('');
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ quality: AnswerQuality; message: string; correctAnswer: string } | null>(null);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const retryCountRef = useRef<Record<string, number>>({});
  const lessonStartRef = useRef(Date.now());

  const exercise = queue[index];
  // Retry qo'shilsa navbat uzayadi — progress ham mos ravishda surilib boradi (Duolingo'dagidek)
  const progressPercent = queue.length ? Math.round((index / queue.length) * 100) : 0;
  const correctCount = results.filter((item) => item.result === 'correct').length;
  const wrongCount = results.filter((item) => item.result === 'wrong').length;
  const totalXp = results.reduce((sum, item) => sum + item.xp_earned, 0);

  function baseIdOf(item: Exercise) {
    return item.id.split('::retry')[0];
  }

  async function check() {
    if (!exercise || feedback) return;
    const responseMs = Date.now() - startedAt;
    const candidate = selectedTokens.length ? selectedTokens.join(exercise.type === 'wordBuilder' ? '' : ' ') : answer;
    const quality = gradeExercise(exercise, candidate);
    const xp = xpForResult(quality, progress[exercise.word.id]);
    const result = makeExerciseResult({
      exerciseId: `${exercise.id}-${Date.now()}`,
      lessonId: lesson.id,
      wordId: exercise.word.id,
      type: exercise.type,
      result: quality,
      responseMs,
      xp,
    });
    await reviewWord(exercise.word, quality, isChoiceExercise(exercise.type) ? 'multipleChoice' : 'written', responseMs);
    setResults((current) => [...current, result]);

    const soundOn = settings.sound?.effects !== false;
    if (quality === 'wrong') {
      if (soundOn) playWrong();
      setCombo(0);
      // Duolingo-mexanika: xato mashq navbat oxiriga qaytadi
      const baseId = baseIdOf(exercise);
      const retries = retryCountRef.current[baseId] ?? 0;
      if (retries < MAX_RETRIES_PER_EXERCISE) {
        retryCountRef.current[baseId] = retries + 1;
        setQueue((current) => [...current, { ...exercise, id: `${baseId}::retry${retries + 1}` }]);
      }
    } else {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setBestCombo((current) => Math.max(current, nextCombo));
      if (soundOn) {
        if (nextCombo > 0 && nextCombo % 5 === 0) playCombo();
        else playCorrect();
      }
    }

    setFeedback({
      quality,
      correctAnswer: exercise.correctAnswer,
      message:
        quality === 'correct'
          ? combo + 1 >= 3
            ? `Zo'r! ${combo + 1} ta ketma-ket! 🔥`
            : "To'g'ri! ✓"
          : quality === 'close'
            ? 'Juda yaqin — imloga e’tibor bering.'
            : "Noto'g'ri. Bu mashq oxirida yana keladi.",
    });
  }

  function skipIntro() {
    advance();
  }

  function advance() {
    if (index + 1 >= queue.length) {
      if (settings.sound?.effects !== false) playFinish();
      setPhase('summary');
      return;
    }
    setIndex((value) => value + 1);
    setAnswer('');
    setSelectedTokens([]);
    setFeedback(null);
    setStartedAt(Date.now());
  }

  async function finishLesson() {
    await onFinish({
      score: correctCount,
      xp: totalXp + (wrongCount === 0 && results.length > 0 ? 20 : 0),
      mistakes: wrongCount,
      results,
    });
  }

  // ======================= NATIJA =======================
  if (phase === 'summary') {
    const total = results.length;
    const accuracy = total ? Math.round((correctCount / total) * 100) : 0;
    const seconds = Math.round((Date.now() - lessonStartRef.current) / 1000);
    const perfect = wrongCount === 0 && total > 0;
    const finalXp = totalXp + (perfect ? 20 : 0);
    return (
      <Screen className="max-w-md">
        <div className="relative">
          <ConfettiLayer active />
          <GlassCard className="text-center">
            <span
              className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl border-b-4 text-white ${
                perfect ? 'border-warn-600 bg-warn-500' : 'border-success-800 bg-success-600'
              }`}
            >
              <Icon name={perfect ? 'trophy' : 'check'} size={30} />
            </span>
            <h1 className="mt-4 text-2xl font-black">{perfect ? 'Mukammal dars! 🎉' : 'Dars tugadi!'}</h1>
            <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">{lesson.title}</p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <SummaryStat label="XP" value={`+${finalXp}`} tone="text-brand-600 bg-brand-50 dark:bg-brand-950/60 dark:text-brand-300" />
              <SummaryStat label="Aniqlik" value={`${accuracy}%`} tone="text-success-700 bg-success-100 dark:bg-success-700/20 dark:text-success-500" />
              <SummaryStat label="Vaqt" value={`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`} tone="text-violet-600 bg-violet-100/70 dark:bg-violet-950/60 dark:text-violet-300" />
            </div>
            {bestCombo >= 3 ? (
              <p className="mt-3 text-sm font-black text-warn-600">🔥 Eng yaxshi seriya: {bestCombo} ta ketma-ket</p>
            ) : null}
            {perfect ? <p className="mt-2 text-xs font-black uppercase tracking-wide text-warn-600">+20 XP perfect bonus</p> : null}

            <PrimaryActionButton className="mt-6 w-full" onClick={() => void finishLesson()}>
              Davom etish
            </PrimaryActionButton>
          </GlassCard>
        </div>
      </Screen>
    );
  }

  if (!exercise) {
    return (
      <Screen>
        <GlassCard>Bu dars uchun mashqlar topilmadi. Boshqa dars tanlang.</GlassCard>
      </Screen>
    );
  }

  const canCheck = Boolean(answer || selectedTokens.length);
  const isRetry = exercise.id.includes('::retry');

  return (
    <Screen className="max-w-2xl">
      <div className="sticky top-0 z-20 -mx-3 bg-[#f4f5fb]/92 px-3 py-3 backdrop-blur-md dark:bg-ink-950/92 lg:top-5 lg:mx-0 lg:rounded-2xl lg:border-2 lg:border-ink-900/[0.07] lg:bg-white lg:shadow-hard dark:lg:border-white/[0.07] dark:lg:bg-ink-800">
        <div className="flex items-center gap-3">
          <ProgressBar value={progressPercent} className="flex-1" tone={combo >= 3 ? 'amber' : 'brand'} />
          {combo >= 2 ? <span className="shrink-0 text-sm font-black text-warn-600">🔥{combo}</span> : null}
          <span className="shrink-0 text-xs font-black text-slate-400">
            {Math.min(index + 1, queue.length)}/{queue.length}
          </span>
        </div>
      </div>

      <GlassCard className={feedback?.quality === 'wrong' ? 'animate-shake' : 'animate-slide-up'} key={exercise.id}>
        <div className="rounded-2xl border-2 border-ink-900/10 bg-gradient-to-br from-brand-600 to-violet-600 p-5 text-white dark:border-white/10">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase">
              {isRetry ? 'Qayta urinish' : exerciseTypeLabel(exercise.type)}
            </span>
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
            <h1 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">{exercise.prompt}</h1>
          )}
        </div>

        {exercise.type !== 'introduce' ? (
          <div className="mt-5">
            {exercise.choices ? (
              <ChoiceGrid exercise={exercise} answer={answer} feedback={feedback} setAnswer={setAnswer} />
            ) : exercise.tokens ? (
              <TokenBuilder exercise={exercise} selectedTokens={selectedTokens} setSelectedTokens={setSelectedTokens} />
            ) : (
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void check();
                  }
                }}
                className="min-h-28 w-full resize-none rounded-2xl border-2 border-ink-900/12 bg-white px-5 py-4 text-lg font-bold outline-none transition focus:border-brand-500 dark:border-white/12 dark:bg-ink-900"
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
        ) : feedback === null ? (
          <PrimaryActionButton className="w-full" disabled={!canCheck} onClick={() => void check()}>
            Tekshirish
          </PrimaryActionButton>
        ) : (
          <PrimaryActionButton
            className={`w-full ${feedback.quality === 'wrong' ? '!border-danger-800 !bg-danger-600' : '!border-success-800 !bg-success-600'}`}
            onClick={advance}
          >
            Davom etish
          </PrimaryActionButton>
        )}
      </div>
    </Screen>
  );
}

function SummaryStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`rounded-2xl border-2 border-ink-900/[0.07] p-3 dark:border-white/[0.07] ${tone}`}>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
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
    <div className="grid gap-2">
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
        Tozalash
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
    <div className={`mt-5 animate-slide-up rounded-2xl border-2 p-4 font-bold ${tone}`}>
      <p className="text-lg font-black">{feedback.message}</p>
      {feedback.quality !== 'correct' ? (
        <p className="mt-2 text-sm">
          To'g'ri javob: <span className="font-black">{feedback.correctAnswer}</span>
        </p>
      ) : null}
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
