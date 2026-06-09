import type { SpeakingFeedback, SpeakingMistake } from '../types';

export function parseAiResponse(raw: string): {
  kind: 'json' | 'text';
  data?: unknown;
  text: string;
} {
  const text = raw.trim();
  const candidates = [
    text,
    extractCodeBlock(text),
    extractJsonObject(text),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    try {
      return { kind: 'json', data: JSON.parse(candidate), text };
    } catch {
      // Try next candidate.
    }
  }

  return { kind: 'text', text };
}

export function parseSpeakingFeedback(raw: string): SpeakingFeedback | null {
  const parsed = parseAiResponse(raw);
  if (parsed.kind !== 'json') return null;
  return validateSpeakingFeedback(parsed.data);
}

function extractCodeBlock(text: string) {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return match?.[1]?.trim();
}

function extractJsonObject(text: string) {
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first < 0 || last <= first) return '';
  return text.slice(first, last + 1);
}

function numberInRange(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function mistakeValue(value: unknown): SpeakingMistake {
  const item = (value ?? {}) as Partial<SpeakingMistake>;
  return {
    original: stringValue(item.original),
    corrected: stringValue(item.corrected),
    explanation_uz: stringValue(item.explanation_uz),
  };
}

function validateSpeakingFeedback(data: unknown): SpeakingFeedback | null {
  if (!data || typeof data !== 'object') return null;
  const item = data as Partial<SpeakingFeedback>;
  if (item.type !== 'speakingFeedback') return null;

  return {
    type: 'speakingFeedback',
    score: numberInRange(item.score, 0, 100),
    ieltsBand: numberInRange(item.ieltsBand, 1, 9),
    fluency: numberInRange(item.fluency, 0, 100),
    grammar: numberInRange(item.grammar, 0, 100),
    vocabulary: numberInRange(item.vocabulary, 0, 100),
    pronunciationEstimate: numberInRange(item.pronunciationEstimate, 0, 100),
    relevance: numberInRange(item.relevance, 0, 100),
    mistakes: Array.isArray(item.mistakes) ? item.mistakes.map(mistakeValue) : [],
    betterAnswer_ru: stringValue(item.betterAnswer_ru),
    betterAnswer_uz: stringValue(item.betterAnswer_uz),
    nextQuestion_ru: stringValue(item.nextQuestion_ru),
    motivation_uz: stringValue(item.motivation_uz),
  };
}
