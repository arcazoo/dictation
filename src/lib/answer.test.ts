import { describe, expect, it } from 'vitest';
import { gradeWrittenAnswer, normalizeAnswer, toUzCyrillic } from './answer';

describe('yozma javobni baholash', () => {
  it("aniq mos javob — correct", () => {
    expect(gradeWrittenAnswer('kitob', 'kitob')).toBe('correct');
  });

  it('katta-kichik harf va punktuatsiya farqi yo‘q', () => {
    expect(gradeWrittenAnswer('  Kitob! ', 'kitob')).toBe('correct');
  });

  it('lotin yozuvi kirill javobga mos keladi', () => {
    expect(gradeWrittenAnswer('kitob', 'китоб')).toBe('correct');
  });

  it('vergul bilan berilgan variantlardan biri yetarli', () => {
    expect(gradeWrittenAnswer('inson', 'inson, odam')).toBe('correct');
  });

  it('kichik xato — close', () => {
    expect(gradeWrittenAnswer('kitop', 'kitob')).toBe('close');
  });

  it('butunlay boshqa javob — wrong', () => {
    expect(gradeWrittenAnswer('mashina', 'kitob')).toBe('wrong');
  });
});

describe('normalizatsiya', () => {
  it('normalizeAnswer punktuatsiyani olib tashlaydi', () => {
    expect(normalizeAnswer('Salom, dunyo!')).toBe('salom dunyo');
  });

  it('toUzCyrillic lotinni kirillga o‘giradi', () => {
    expect(toUzCyrillic('kitob')).toBe('китоб');
  });
});
