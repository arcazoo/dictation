import type { Exercise, ExerciseType, Word } from '../types';
import { getChoices } from './lesson';

const EXERCISE_ORDER: ExerciseType[] = [
  'multipleChoiceRuUz',
  'multipleChoiceUzRu',
  'writtenRecall',
  'wordBuilder',
  'sentenceBuilder',
  'fillBlank',
  'listenChoose',
  'mistakeDrill',
  'speedRound',
  'aiExample',
];

export function buildExercisesForLesson(lessonId: string, lessonWords: Word[], allWords: Word[]) {
  return lessonWords.flatMap((word, index) => {
    const primary = createExercise(lessonId, word, allWords, EXERCISE_ORDER[index % EXERCISE_ORDER.length], index);
    const recall = createExercise(lessonId, word, allWords, index % 2 ? 'writtenRecall' : 'multipleChoiceRuUz', index + 1000);
    return [primary, recall];
  });
}

export function createExercise(
  lessonId: string,
  word: Word,
  allWords: Word[],
  type: ExerciseType,
  index = 0,
): Exercise {
  if (type === 'multipleChoiceUzRu') {
    return {
      id: `${lessonId}-${word.id}-${type}-${index}`,
      lesson_id: lessonId,
      type,
      word,
      prompt: `${word.uzbek} rus tilida qanday?`,
      choices: getChoices(word, allWords, true),
      correctAnswer: word.russian,
    };
  }

  if (type === 'wordBuilder') {
    return {
      id: `${lessonId}-${word.id}-${type}-${index}`,
      lesson_id: lessonId,
      type,
      word,
      prompt: `Ruscha so‘zni tuzing: ${word.uzbek}`,
      correctAnswer: word.russian,
      tokens: shuffle(word.russian.split('')),
    };
  }

  if (type === 'sentenceBuilder') {
    const sentence = `Я знаю слово ${word.russian}`;
    return {
      id: `${lessonId}-${word.id}-${type}-${index}`,
      lesson_id: lessonId,
      type,
      word,
      prompt: 'Ruscha gapni tuzing',
      correctAnswer: sentence,
      sentence,
      tokens: shuffle(sentence.split(' ')),
    };
  }

  if (type === 'fillBlank') {
    return {
      id: `${lessonId}-${word.id}-${type}-${index}`,
      lesson_id: lessonId,
      type,
      word,
      prompt: `Я знаю ___`,
      blank: word.russian,
      correctAnswer: word.russian,
    };
  }

  if (type === 'listenChoose') {
    return {
      id: `${lessonId}-${word.id}-${type}-${index}`,
      lesson_id: lessonId,
      type,
      word,
      prompt: 'Tinglang va tarjimani tanlang',
      choices: getChoices(word, allWords, false),
      correctAnswer: word.uzbek,
    };
  }

  if (type === 'aiExample') {
    return {
      id: `${lessonId}-${word.id}-${type}-${index}`,
      lesson_id: lessonId,
      type,
      word,
      prompt: `AI misol: Я часто использую слово "${word.russian}". Tarjima qiling.`,
      correctAnswer: word.uzbek,
    };
  }

  if (type === 'writtenRecall' || type === 'mistakeDrill' || type === 'speedRound') {
    return {
      id: `${lessonId}-${word.id}-${type}-${index}`,
      lesson_id: lessonId,
      type,
      word,
      prompt: `${word.russian} tarjimasini yozing`,
      correctAnswer: word.uzbek,
    };
  }

  return {
    id: `${lessonId}-${word.id}-${type}-${index}`,
    lesson_id: lessonId,
    type,
    word,
    prompt: `${word.russian} nimani anglatadi?`,
    choices: getChoices(word, allWords, false),
    correctAnswer: word.uzbek,
  };
}

export function isChoiceExercise(type: ExerciseType) {
  return type === 'multipleChoiceRuUz' || type === 'multipleChoiceUzRu' || type === 'listenChoose';
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}
