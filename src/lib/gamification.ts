import type {
  Achievement,
  AnswerQuality,
  DailyActivity,
  ExerciseResult,
  ReviewResult,
  UserProfile,
  UserProgress,
} from '../types';
import { dayKey } from './date';

const XP_RULES = {
  correct: 10,
  close: 5,
  hardWordBonus: 5,
  perfectLesson: 20,
  dailyGoal: 30,
  mistakeRecovery: 15,
};

export function levelFromXp(totalXp: number) {
  return Math.max(1, Math.floor(totalXp / 250) + 1);
}

export function xpForResult(
  result: AnswerQuality | ReviewResult,
  progress?: UserProgress,
  recoveredMistake = false,
) {
  if (result === 'wrong' || result === 'unknown') return 0;
  let xp = result === 'close' || result === 'hard' ? XP_RULES.close : XP_RULES.correct;
  if ((progress?.wrong_count ?? 0) >= 2 && (result === 'correct' || result === 'known')) xp += XP_RULES.hardWordBonus;
  if (recoveredMistake) xp += XP_RULES.mistakeRecovery;
  return xp;
}

export function updateDailyActivity(
  activity: DailyActivity | undefined,
  result: AnswerQuality | ReviewResult,
  xp: number,
  minutes = 0,
) {
  const current: DailyActivity = activity ?? {
    date: dayKey(),
    xp: 0,
    lessons_completed: 0,
    correct_answers: 0,
    wrong_answers: 0,
    minutes_spent: 0,
  };

  const correct = result === 'correct' || result === 'known';
  const wrong = result === 'wrong' || result === 'unknown';

  return {
    ...current,
    xp: current.xp + xp,
    correct_answers: current.correct_answers + (correct ? 1 : 0),
    wrong_answers: current.wrong_answers + (wrong ? 1 : 0),
    minutes_spent: current.minutes_spent + minutes,
  };
}

export function updateProfileForExercise(
  profile: UserProfile,
  result: AnswerQuality | ReviewResult,
  xp: number,
) {
  const today = dayKey();
  const yesterday = dayKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const streak =
    profile.last_active_date === today
      ? profile.streak
      : profile.last_active_date === yesterday
        ? profile.streak + 1
        : 1;
  const wrong = result === 'wrong' || result === 'unknown';
  const hearts = profile.hearts_enabled && wrong ? Math.max(0, profile.hearts - 1) : profile.hearts;
  const total_xp = profile.total_xp + xp;

  return {
    ...profile,
    total_xp,
    level: levelFromXp(total_xp),
    streak,
    last_active_date: today,
    hearts,
  };
}

export function restoreHearts(profile: UserProfile) {
  return { ...profile, hearts: 5 };
}

export function achievementsForState(
  profile: UserProfile,
  existing: Achievement[],
  masteredWords: number,
  exerciseResults: ExerciseResult[],
) {
  const unlocked = new Set(existing.map((item) => item.id));
  const candidates: Array<Omit<Achievement, 'unlocked_at'>> = [
    { id: 'streak-3', title: '3 kunlik streak', description: '3 kun ketma-ket mashq qilindi', icon: 'S3' },
    { id: 'streak-7', title: '7 kunlik streak', description: '7 kun ketma-ket mashq qilindi', icon: 'S7' },
    { id: 'streak-30', title: '30 kunlik streak', description: '30 kun ketma-ket mashq qilindi', icon: 'S30' },
    { id: 'master-100', title: '100 mastered', description: '100 ta so‘z mastered bo‘ldi', icon: '100' },
    { id: 'answers-500', title: '500 javob', description: '500 ta mashq bajarildi', icon: '500' },
    { id: 'first-perfect', title: 'Perfect start', description: 'Birinchi perfect lesson', icon: 'P' },
  ];

  return candidates
    .filter((item) => !unlocked.has(item.id))
    .filter((item) => {
      if (item.id === 'streak-3') return profile.streak >= 3;
      if (item.id === 'streak-7') return profile.streak >= 7;
      if (item.id === 'streak-30') return profile.streak >= 30;
      if (item.id === 'master-100') return masteredWords >= 100;
      if (item.id === 'answers-500') return exerciseResults.length >= 500;
      if (item.id === 'first-perfect') return false;
      return false;
    })
    .map((item) => ({ ...item, unlocked_at: new Date().toISOString() }));
}

export function makeExerciseResult(params: {
  exerciseId: string;
  lessonId?: string;
  wordId: string;
  type: ExerciseResult['type'];
  result: ExerciseResult['result'];
  responseMs: number;
  xp: number;
}): ExerciseResult {
  return {
    exercise_id: params.exerciseId,
    lesson_id: params.lessonId,
    word_id: params.wordId,
    type: params.type,
    result: params.result,
    response_ms: params.responseMs,
    xp_earned: params.xp,
    created_at: new Date().toISOString(),
  };
}
