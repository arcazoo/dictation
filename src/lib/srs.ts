import { createEmptyCard, fsrs, generatorParameters, Rating, State, type Card, type Grade } from 'ts-fsrs';
import type { AnswerQuality, ReviewResult, UserProgress } from '../types';
import { nowIso } from './date';

/**
 * FSRS-5 asosidagi scheduler. Legacy maydonlar (level, ease_factor, confidence)
 * eski UI va eski saqlangan progress bilan moslik uchun parallel yuritiladi.
 */
const scheduler = fsrs(
  generatorParameters({
    request_retention: 0.9,
    maximum_interval: 365,
    enable_fuzz: true,
  }),
);

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

/** Eski progress yozuvini FSRS kartasiga aylantiradi (bir martalik migratsiya). */
function cardFromProgress(progress: UserProgress): Card {
  if (typeof progress.fsrs_stability === 'number' && typeof progress.fsrs_difficulty === 'number') {
    return {
      due: new Date(progress.next_review || Date.now()),
      stability: progress.fsrs_stability,
      difficulty: progress.fsrs_difficulty,
      elapsed_days: 0,
      scheduled_days: progress.interval_days ?? 0,
      reps: progress.fsrs_reps ?? progress.correct_count + progress.wrong_count,
      lapses: progress.fsrs_lapses ?? progress.lapses ?? 0,
      learning_steps: 0,
      state: (progress.fsrs_state ?? State.Review) as State,
      last_review: progress.fsrs_last_review ? new Date(progress.fsrs_last_review) : undefined,
    };
  }

  const card = createEmptyCard(progress.last_seen ? new Date(progress.last_seen) : new Date());
  const total = progress.correct_count + progress.wrong_count;
  if (total === 0 && progress.status === 'new') return card;

  // Eski level jadvalidan taxminiy stability: interval kunlari yaxshi boshlang'ich qiymat
  const legacyInterval = progress.interval_days ?? [0, 1, 3, 7, 15, 30][Math.max(0, Math.min(5, progress.level))];
  return {
    ...card,
    stability: Math.max(0.5, legacyInterval || 0.5),
    difficulty: Math.max(1, Math.min(10, 11 - ((progress.ease_factor ?? 2.5) - 1.3) * (9 / 1.7))),
    scheduled_days: legacyInterval,
    reps: total,
    lapses: progress.lapses ?? 0,
    state: progress.level === 0 ? State.Learning : State.Review,
    last_review: progress.last_seen ? new Date(progress.last_seen) : undefined,
  };
}

function gradeFor(result: ReviewResult | AnswerQuality, responseMs: number, reps: number): Grade {
  if (result === 'unknown' || result === 'wrong') return Rating.Again;
  if (result === 'hard' || result === 'close') return Rating.Hard;
  // Tez va ishonchli javob — Easy, oddiy to'g'ri javob — Good
  if (responseMs > 0 && responseMs < 3000 && reps >= 2) return Rating.Easy;
  return Rating.Good;
}

function levelFromCard(card: Card): number {
  if (card.state === State.New) return 0;
  if (card.state === State.Learning || card.state === State.Relearning) return 0;
  const days = card.scheduled_days;
  if (days < 1) return 0;
  if (days < 3) return 1;
  if (days < 7) return 2;
  if (days < 15) return 3;
  if (days < 30) return 4;
  return 5;
}

function statusFromCard(card: Card, wrongCount: number, wasWrong: boolean): UserProgress['status'] {
  if (wasWrong || card.state === State.Relearning) return 'difficult';
  if (card.state === State.New) return 'new';
  if (card.state === State.Learning) return 'learning';
  if (card.scheduled_days >= 30) return 'mastered';
  if (card.scheduled_days >= 7) return 'known';
  return wrongCount >= 3 ? 'difficult' : 'learning';
}

export function applyReview(
  current: UserProgress | undefined,
  wordId: string,
  result: ReviewResult | AnswerQuality,
  responseMs = 0,
): UserProgress {
  const base = current ?? createProgress(wordId);
  const card = cardFromProgress(base);
  const now = new Date();
  const grade = gradeFor(result, responseMs, card.reps);
  const { card: next } = scheduler.next(card, now, grade);

  const wrong = grade === Rating.Again;
  const correct = !wrong;
  const totalAnswers = base.correct_count + base.wrong_count;
  const nextAverage = averageResponse(base.average_response_ms ?? 0, responseMs, totalAnswers);

  // Retrievability o'rniga soddalashtirilgan ishonch ko'rsatkichi (0-100)
  const confidenceDelta = wrong ? -18 : result === 'hard' || result === 'close' ? 2 : grade === Rating.Easy ? 10 : 6;
  const confidence = Math.max(0, Math.min(100, (base.confidence ?? 20) + confidenceDelta));

  return {
    ...base,
    word_id: wordId,
    level: levelFromCard(next),
    correct_count: base.correct_count + (correct ? 1 : 0),
    wrong_count: base.wrong_count + (wrong ? 1 : 0),
    last_seen: now.toISOString(),
    next_review: next.due.toISOString(),
    status: statusFromCard(next, base.wrong_count + (wrong ? 1 : 0), wrong),
    ease_factor: base.ease_factor,
    interval_days: next.scheduled_days,
    lapses: next.lapses,
    average_response_ms: nextAverage,
    confidence,
    fsrs_stability: next.stability,
    fsrs_difficulty: next.difficulty,
    fsrs_reps: next.reps,
    fsrs_lapses: next.lapses,
    fsrs_state: next.state,
    fsrs_last_review: next.last_review ? new Date(next.last_review).toISOString() : now.toISOString(),
  };
}

function averageResponse(currentAverage: number, responseMs: number, count: number) {
  if (!responseMs) return currentAverage;
  if (!count) return responseMs;
  return Math.round((currentAverage * count + responseMs) / (count + 1));
}
