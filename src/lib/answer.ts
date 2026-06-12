import type { AnswerQuality } from '../types';

const latinToCyrillicPairs: Array<[RegExp, string]> = [
  [/sh/g, 'ш'],
  [/ch/g, 'ч'],
  [/yo/g, 'ё'],
  [/yu/g, 'ю'],
  [/ya/g, 'я'],
  [/o'/g, 'ў'],
  [/g'/g, 'ғ'],
  [/a/g, 'а'],
  [/b/g, 'б'],
  [/d/g, 'д'],
  [/e/g, 'е'],
  [/f/g, 'ф'],
  [/g/g, 'г'],
  [/h/g, 'ҳ'],
  [/i/g, 'и'],
  [/j/g, 'ж'],
  [/k/g, 'к'],
  [/l/g, 'л'],
  [/m/g, 'м'],
  [/n/g, 'н'],
  [/o/g, 'о'],
  [/p/g, 'п'],
  [/q/g, 'қ'],
  [/r/g, 'р'],
  [/s/g, 'с'],
  [/t/g, 'т'],
  [/u/g, 'у'],
  [/v/g, 'в'],
  [/x/g, 'х'],
  [/y/g, 'й'],
  [/z/g, 'з'],
];

export function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .replace(/[’`ʻ]/g, "'")
    .replace(/[.,;:!?()[\]{}"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function toUzCyrillic(value: string) {
  let result = normalizeAnswer(value);
  for (const [regex, replacement] of latinToCyrillicPairs) {
    result = result.replace(regex, replacement);
  }
  return result;
}

function levenshtein(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }

  return dp[a.length][b.length];
}

export function gradeWrittenAnswer(input: string, expected: string): AnswerQuality {
  const cleanInput = normalizeAnswer(input);
  const expectedOptions = expected.split(/[,/;·]/).map(normalizeAnswer).filter(Boolean);
  const candidates = [cleanInput, toUzCyrillic(cleanInput)];

  if (expectedOptions.some((answer) => candidates.includes(answer) || candidates.includes(toUzCyrillic(answer)))) {
    return 'correct';
  }

  const bestDistance = Math.min(
    ...expectedOptions.flatMap((answer) =>
      candidates.map((candidate) => levenshtein(candidate, normalizeAnswer(answer))),
    ),
  );

  return bestDistance <= 2 ? 'close' : 'wrong';
}

export function answerLabel(quality: AnswerQuality) {
  if (quality === 'correct') return "To'g'ri";
  if (quality === 'close') return 'Yaqin';
  return "Noto'g'ri";
}
