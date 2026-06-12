import { describe, expect, it } from 'vitest';
import { applyReview, createProgress } from './srs';
import type { UserProgress } from '../types';

describe('FSRS scheduler', () => {
  it("yangi so'zga to'g'ri javob — kelajakka rejalashtiriladi", () => {
    const result = applyReview(undefined, 'word-1', 'known', 5000);
    expect(result.word_id).toBe('word-1');
    expect(result.correct_count).toBe(1);
    expect(result.wrong_count).toBe(0);
    expect(new Date(result.next_review).getTime()).toBeGreaterThan(Date.now());
    expect(result.fsrs_stability).toBeGreaterThan(0);
    expect(result.status).not.toBe('new');
  });

  it("noto'g'ri javob — wrong_count oshadi va tez qaytadi", () => {
    const first = applyReview(undefined, 'word-2', 'known');
    const result = applyReview(first, 'word-2', 'wrong');
    expect(result.wrong_count).toBe(1);
    expect(result.status).toBe('difficult');
    // Xato javobdan keyin interval 1 kundan oshmasligi kerak
    const dueIn = new Date(result.next_review).getTime() - Date.now();
    expect(dueIn).toBeLessThan(24 * 60 * 60 * 1000);
  });

  it('takroriy to‘g‘ri javoblar intervalni o‘stiradi', () => {
    let progress = applyReview(undefined, 'word-3', 'known', 5000);
    const firstInterval = progress.interval_days ?? 0;
    for (let i = 0; i < 4; i += 1) {
      progress = applyReview(progress, 'word-3', 'known', 5000);
    }
    expect(progress.interval_days ?? 0).toBeGreaterThanOrEqual(firstInterval);
    expect(progress.correct_count).toBe(5);
  });

  it('eski (legacy) progress FSRS ga muammosiz migratsiya qilinadi', () => {
    const legacy: UserProgress = {
      word_id: 'word-4',
      level: 3,
      correct_count: 6,
      wrong_count: 1,
      last_seen: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      next_review: new Date().toISOString(),
      status: 'known',
      ease_factor: 2.5,
      interval_days: 7,
      lapses: 1,
    };
    const result = applyReview(legacy, 'word-4', 'known', 4000);
    expect(result.fsrs_stability).toBeGreaterThan(0);
    expect(result.fsrs_reps).toBeGreaterThan(0);
    expect(result.correct_count).toBe(7);
    expect(new Date(result.next_review).getTime()).toBeGreaterThan(Date.now());
  });

  it('createProgress boshlang‘ich holatni beradi', () => {
    const progress = createProgress('word-5');
    expect(progress.status).toBe('new');
    expect(progress.level).toBe(0);
  });
});
