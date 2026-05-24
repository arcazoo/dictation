import type { AnswerQuality, ReviewResult, UserProgress } from '../types';
import { addDays, addMinutes, nowIso } from './date';

const LEVEL_INTERVAL_DAYS = [0, 1, 3, 7, 15, 30];

export function createProgress(wordId: string): UserProgress {
  return {
    word_id: wordId,
    level: 0,
    correct_count: 0,
    wrong_count: 0,
    last_seen: '',
    next_review: nowIso(),
    status: 'new',
  };
}

export function nextReviewForLevel(level: number) {
  const normalized = Math.max(0, Math.min(5, level));
  if (normalized === 0) return addMinutes(15);
  return addDays(LEVEL_INTERVAL_DAYS[normalized]);
}

export function applyReview(
  current: UserProgress | undefined,
  wordId: string,
  result: ReviewResult | AnswerQuality,
): UserProgress {
  const base = current ?? createProgress(wordId);
  const correct = result === 'known' || result === 'correct';
  const hard = result === 'hard' || result === 'close';
  const wrong = result === 'unknown' || result === 'wrong';

  if (wrong) {
    return {
      ...base,
      level: 0,
      wrong_count: base.wrong_count + 1,
      last_seen: nowIso(),
      next_review: addMinutes(5),
      status: 'difficult',
    };
  }

  if (hard) {
    const level = Math.max(0, Math.min(2, base.level));
    return {
      ...base,
      level,
      correct_count: base.correct_count + 1,
      last_seen: nowIso(),
      next_review: addMinutes(15),
      status: 'learning',
    };
  }

  const level = Math.min(5, base.level + 1);
  return {
    ...base,
    level,
    correct_count: base.correct_count + (correct ? 1 : 0),
    last_seen: nowIso(),
    next_review: nextReviewForLevel(level),
    status: level >= 5 ? 'mastered' : level >= 3 ? 'known' : 'learning',
  };
}
