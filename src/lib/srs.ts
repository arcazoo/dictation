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
    ease_factor: 2.5,
    interval_days: 0,
    lapses: 0,
    average_response_ms: 0,
    confidence: 0,
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
  responseMs = 0,
): UserProgress {
  const base = current ?? createProgress(wordId);
  const correct = result === 'known' || result === 'correct';
  const hard = result === 'hard' || result === 'close';
  const wrong = result === 'unknown' || result === 'wrong';

  if (wrong) {
    const nextAverage = averageResponse(base.average_response_ms ?? 0, responseMs, base.correct_count + base.wrong_count);
    return {
      ...base,
      level: 0,
      wrong_count: base.wrong_count + 1,
      last_seen: nowIso(),
      next_review: addMinutes(5),
      status: 'difficult',
      ease_factor: Math.max(1.3, (base.ease_factor ?? 2.5) - 0.25),
      interval_days: 0,
      lapses: (base.lapses ?? 0) + 1,
      average_response_ms: nextAverage,
      confidence: Math.max(0, (base.confidence ?? 20) - 18),
    };
  }

  if (hard) {
    const level = Math.max(0, Math.min(2, base.level));
    const nextAverage = averageResponse(base.average_response_ms ?? 0, responseMs, base.correct_count + base.wrong_count);
    return {
      ...base,
      level,
      correct_count: base.correct_count + 1,
      last_seen: nowIso(),
      next_review: addMinutes(15),
      status: 'learning',
      ease_factor: Math.max(1.3, (base.ease_factor ?? 2.5) - 0.08),
      interval_days: 0,
      average_response_ms: nextAverage,
      confidence: Math.max(0, Math.min(100, (base.confidence ?? 35) + (responseMs && responseMs < 5000 ? 4 : 1))),
    };
  }

  const level = Math.min(5, base.level + 1);
  const interval_days = LEVEL_INTERVAL_DAYS[level];
  const nextAverage = averageResponse(base.average_response_ms ?? 0, responseMs, base.correct_count + base.wrong_count);
  const speedBonus = responseMs && responseMs < 3500 ? 8 : responseMs && responseMs > 12000 ? 1 : 5;
  return {
    ...base,
    level,
    correct_count: base.correct_count + (correct ? 1 : 0),
    last_seen: nowIso(),
    next_review: nextReviewForLevel(level),
    status: level >= 5 ? 'mastered' : level >= 3 ? 'known' : 'learning',
    ease_factor: Math.min(3, (base.ease_factor ?? 2.5) + 0.05),
    interval_days,
    average_response_ms: nextAverage,
    confidence: Math.max(0, Math.min(100, (base.confidence ?? 35) + speedBonus + level)),
  };
}

function averageResponse(currentAverage: number, responseMs: number, count: number) {
  if (!responseMs) return currentAverage;
  if (!count) return responseMs;
  return Math.round((currentAverage * count + responseMs) / (count + 1));
}
