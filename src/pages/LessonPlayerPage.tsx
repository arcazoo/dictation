import { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { gradeWrittenAnswer } from '../lib/answer';
import { buildExercisesForLesson, isChoiceExercise } from '../lib/exercises';
import { makeExerciseResult, xpForResult } from '../lib/gamification';
import type { AnswerQuality, Exercise, ExerciseResult, LearningLesson, Settings, UserProgress, Word } from '../types';

export function LessonPlayerPage({
  lesson,
  words,
  progress,
  settings,
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
  const [feedback, setFeedback] = useState<{ quality: AnswerQuality; message: string } | null>(null);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [results, setResults] = useState<ExerciseResult[]>([]);
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
      message: quality === 'correct' ? "To'g'ri!" : quality === 'close' ? 'Yaqin, yana e’tibor bering.' : `Noto'g'ri. Javob: ${exercise.correctAnswer}`,
    });
  }

  async function next() {
    if (index + 1 >= exercises.length) {
      await onFinish({
        score,
        xp: totalXp + (mistakes === 0 ? 20 : 0),
        mistakes,
        results,
      });
      return;
    }
    setIndex((value) => value + 1);
    setAnswer('');
    setSelectedTokens([]);
    setFeedback(null);
    setStartedAt(Date.now());
  }

  function speak() {
    if (!exercise || !settings.sound.pronunciation || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(exercise.word.russian);
    utterance.lang = 'ru-RU';
    window.speechSynthesis.speak(utterance);
  }

  if (!exercise) {
    return (
      <>
        <PageHeader title="Lesson tugadi" subtitle="Bu lesson uchun mashqlar topilmadi." />
        <Card>List tanlash sahifasidan boshqa lesson tanlang.</Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title={lesson.title} subtitle={`${index + 1}/${exercises.length} · ${lesson.subtitle}`} />
      <Card className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-black text-rose-600 dark:bg-rose-500/15">
            {Math.max(0, hearts)} hearts
          </span>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
          <p className="text-xs font-black uppercase text-brand-600">{exercise.type}</p>
          <h2 className="mt-3 text-2xl font-black">{exercise.prompt}</h2>
          {exercise.type === 'listenChoose' ? (
            <Button className="mt-4" variant="secondary" onClick={speak}>
              Tinglash
            </Button>
          ) : null}
        </div>

        <div className="mt-4">
          {exercise.choices ? (
            <div className="grid gap-2">
              {exercise.choices.map((choice) => (
                <button
                  key={choice}
                  onClick={() => setAnswer(choice)}
                  className={`min-h-12 rounded-xl border px-4 text-left font-bold ${
                    answer === choice
                      ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          ) : exercise.tokens ? (
            <div>
              <div className="min-h-14 rounded-xl border border-slate-200 bg-white p-3 font-bold dark:border-slate-800 dark:bg-slate-900">
                {selectedTokens.join(exercise.type === 'wordBuilder' ? '' : ' ') || '...'}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {exercise.tokens.map((token, tokenIndex) => (
                  <button
                    key={`${token}-${tokenIndex}`}
                    onClick={() => setSelectedTokens((current) => [...current, token])}
                    className="rounded-xl bg-slate-100 px-4 py-3 font-bold dark:bg-slate-800"
                  >
                    {token}
                  </button>
                ))}
              </div>
              <Button className="mt-3" variant="ghost" onClick={() => setSelectedTokens([])}>
                Tozalash
              </Button>
            </div>
          ) : (
            <input
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              className="min-h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-lg outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-950"
              placeholder="Javobni yozing"
            />
          )}
        </div>

        {feedback ? (
          <div
            className={`mt-4 rounded-2xl p-4 font-bold ${
              feedback.quality === 'correct'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-100'
                : feedback.quality === 'close'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-100'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-100'
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button disabled={feedback !== null || (!answer && !selectedTokens.length)} onClick={check}>
            Tekshirish
          </Button>
          <Button variant="secondary" disabled={!feedback} onClick={next}>
            Davom etish
          </Button>
        </div>
      </Card>
    </>
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
