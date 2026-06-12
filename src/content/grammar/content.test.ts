import { describe, expect, it } from 'vitest';
import { GRAMMAR_MODULES, GRAMMAR_TOPICS, topicsForModule } from './index';
import { normalizeAnswer } from '../../lib/answer';

describe('grammatika kontenti yaxlitligi', () => {
  it('barcha mavzu idlari unikal', () => {
    const ids = GRAMMAR_TOPICS.map((topic) => topic.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('barcha mashq idlari unikal', () => {
    const ids = GRAMMAR_TOPICS.flatMap((topic) => topic.exercises.map((exercise) => exercise.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('har modulda kamida 4 ta mavzu bor', () => {
    for (const module of GRAMMAR_MODULES) {
      expect(topicsForModule(module.id).length, `modul ${module.id}`).toBeGreaterThanOrEqual(4);
    }
  });

  it('har mavzuda kamida 4 ta mashq va nazariya bor', () => {
    for (const topic of GRAMMAR_TOPICS) {
      expect(topic.exercises.length, topic.id).toBeGreaterThanOrEqual(4);
      expect(topic.theory.length, topic.id).toBeGreaterThanOrEqual(1);
      expect(topic.examples.length, topic.id).toBeGreaterThanOrEqual(2);
    }
  });

  it("variantli mashqlarda javob variantlar ichida bo'lishi shart", () => {
    for (const topic of GRAMMAR_TOPICS) {
      for (const exercise of topic.exercises) {
        if (!exercise.choices) continue;
        const normalizedChoices = exercise.choices.map((choice) => normalizeAnswer(choice));
        expect(
          normalizedChoices,
          `${exercise.id}: "${exercise.answer}" variantlarda yo'q`,
        ).toContain(normalizeAnswer(exercise.answer));
      }
    }
  });

  it('har mashqda izoh (explanation_uz) bor', () => {
    for (const topic of GRAMMAR_TOPICS) {
      for (const exercise of topic.exercises) {
        expect(exercise.explanation_uz?.length, exercise.id).toBeGreaterThan(3);
      }
    }
  });

  it('sentenceBuilder mashqlarida tokenlar javobni qoplaydi', () => {
    for (const topic of GRAMMAR_TOPICS) {
      for (const exercise of topic.exercises) {
        if (exercise.type !== 'sentenceBuilder' || !exercise.tokens) continue;
        const built = normalizeAnswer(exercise.tokens.slice().sort().join(' '));
        const expected = normalizeAnswer(exercise.answer.split(' ').sort().join(' '));
        expect(built, exercise.id).toBe(expected);
      }
    }
  });
});
