import type { Settings } from '../types';

export const DEFAULT_SETTINGS: Settings = {
  dailyPlan: {
    nounsPages: 1,
    adjectivesPages: 1,
    verbsPages: 1,
  },
  reviewMode: 'normal',
  dailyReviewLimit: 40,
  testTypes: {
    flashcard: true,
    multipleChoice: true,
    writtenAnswer: true,
    reverseTranslation: false,
    onlyMistakes: false,
  },
  language: 'uz_latin',
  translationScript: 'latin',
  difficulty: 'normal',
  lessonOrder: 'mixed',
  notifications: {
    enabled: true,
    morning: '09:00',
    afternoon: '14:00',
    evening: '21:00',
  },
  sound: {
    pronunciation: true,
    autoPlay: false,
    speed: 'normal',
    effects: true,
  },
  appearance: {
    theme: 'system',
    fontSize: 'medium',
  },
  ai: {
    coachTone: 'normal',
    answerLength: 'normal',
    autoSpeak: false,
    speechLanguage: 'ru-RU',
    ieltsScoring: true,
    strictCorrection: true,
  },
};
