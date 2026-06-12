import type { Exercise, ExerciseType, UserProgress, Word } from '../types';
import { getChoices } from './lesson';

/**
 * Exercise Engine v2.
 * Pedagogik progressiya: tanishtirish (recognition) -> tanlash -> yozish (production).
 * So'zning SRS holatiga qarab mashq turi tanlanadi.
 */

function stageFor(progress?: UserProgress): 'new' | 'learning' | 'strong' {
  if (!progress || progress.status === 'new') return 'new';
  if (progress.status === 'known' || progress.status === 'mastered') return 'strong';
  return 'learning';
}

const LEARNING_TYPES: ExerciseType[] = ['multipleChoiceUzRu', 'wordBuilder', 'fillBlank', 'listenChoose', 'writtenRecall'];
const STRONG_TYPES: ExerciseType[] = ['writtenRecall', 'writtenReverse', 'listenType', 'fillBlank', 'speedRound'];

export function buildExercisesForLesson(
  lessonId: string,
  lessonWords: Word[],
  allWords: Word[],
  progress: Record<string, UserProgress> = {},
) {
  const exercises: Exercise[] = [];
  lessonWords.forEach((word, index) => {
    const stage = stageFor(progress[word.id]);
    if (stage === 'new') {
      exercises.push(createExercise(lessonId, word, allWords, 'introduce', index));
      exercises.push(createExercise(lessonId, word, allWords, 'multipleChoiceRuUz', index + 1000));
      exercises.push(createExercise(lessonId, word, allWords, index % 2 ? 'wordBuilder' : 'multipleChoiceUzRu', index + 2000));
    } else if (stage === 'learning') {
      exercises.push(createExercise(lessonId, word, allWords, LEARNING_TYPES[index % LEARNING_TYPES.length], index));
      exercises.push(createExercise(lessonId, word, allWords, 'writtenRecall', index + 1000));
    } else {
      exercises.push(createExercise(lessonId, word, allWords, STRONG_TYPES[index % STRONG_TYPES.length], index));
    }
  });
  return exercises;
}

export function createExercise(
  lessonId: string,
  word: Word,
  allWords: Word[],
  type: ExerciseType,
  index = 0,
): Exercise {
  const id = `${lessonId}-${word.id}-${type}-${index}`;
  const base = { id, lesson_id: lessonId, word };

  switch (type) {
    case 'introduce':
      return {
        ...base,
        type,
        prompt: 'Yangi so‘z',
        correctAnswer: word.uzbek,
        sentence: word.example_ru,
      };

    case 'multipleChoiceUzRu':
      return {
        ...base,
        type,
        prompt: `«${word.uzbek}» rus tilida qanday bo‘ladi?`,
        choices: getChoices(word, allWords, true),
        correctAnswer: word.russian,
      };

    case 'wordBuilder':
      return {
        ...base,
        type,
        prompt: `Harflardan so‘z tuzing: «${word.uzbek}»`,
        correctAnswer: word.russian,
        tokens: shuffle(word.russian.toLowerCase().split('')),
      };

    case 'sentenceBuilder': {
      const sentence = word.example_ru ?? `Это ${word.russian}`;
      return {
        ...base,
        type,
        prompt: 'So‘zlardan gap tuzing',
        correctAnswer: sentence,
        sentence,
        tokens: shuffle(sentence.split(' ')),
      };
    }

    case 'fillBlank': {
      if (word.example_ru && word.example_ru.toLowerCase().includes(word.russian.toLowerCase())) {
        const masked = word.example_ru.replace(new RegExp(escapeRegExp(word.russian), 'i'), '___');
        return {
          ...base,
          type,
          prompt: masked,
          blank: word.russian,
          correctAnswer: word.russian,
          sentence: word.example_uz,
        };
      }
      // Misol gap bo'lmasa variant tanlashga qaytamiz
      return createExercise(lessonId, word, allWords, 'multipleChoiceUzRu', index);
    }

    case 'listenChoose':
      return {
        ...base,
        type,
        prompt: 'Tinglang va tarjimani tanlang',
        choices: getChoices(word, allWords, false),
        correctAnswer: word.uzbek,
      };

    case 'listenType':
      return {
        ...base,
        type,
        prompt: 'Tinglang va ruscha yozing',
        correctAnswer: word.russian,
      };

    case 'writtenReverse':
      return {
        ...base,
        type,
        prompt: `«${word.uzbek}» so‘zini ruscha yozing`,
        correctAnswer: word.russian,
      };

    case 'aiExample':
      return {
        ...base,
        type,
        prompt: word.example_ru ? `${word.example_ru} — tarjima qiling` : `«${word.russian}» tarjimasini yozing`,
        correctAnswer: word.uzbek,
      };

    case 'writtenRecall':
    case 'mistakeDrill':
    case 'speedRound':
      return {
        ...base,
        type,
        prompt: `«${word.russian}» tarjimasini yozing`,
        correctAnswer: word.uzbek,
      };

    case 'multipleChoiceRuUz':
    default:
      return {
        ...base,
        type: 'multipleChoiceRuUz',
        prompt: `«${word.russian}» nimani anglatadi?`,
        choices: getChoices(word, allWords, false),
        correctAnswer: word.uzbek,
      };
  }
}

export function isChoiceExercise(type: ExerciseType) {
  return type === 'multipleChoiceRuUz' || type === 'multipleChoiceUzRu' || type === 'listenChoose';
}

export function isWrittenExercise(type: ExerciseType) {
  return (
    type === 'writtenRecall' ||
    type === 'writtenReverse' ||
    type === 'listenType' ||
    type === 'mistakeDrill' ||
    type === 'speedRound' ||
    type === 'fillBlank' ||
    type === 'aiExample'
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
