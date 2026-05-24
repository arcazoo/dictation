export type Category = 'noun' | 'adjective' | 'verb';
export type WordStatus = 'new' | 'learning' | 'difficult' | 'known' | 'mastered';
export type ReviewResult = 'known' | 'hard' | 'unknown';
export type AnswerQuality = 'correct' | 'close' | 'wrong';

export interface Word {
  id: string;
  russian: string;
  uzbek: string;
  category: Category;
  category_ru: string;
  page: number;
  example_ru?: string;
  example_uz?: string;
}

export interface UserProgress {
  word_id: string;
  level: number;
  correct_count: number;
  wrong_count: number;
  last_seen: string;
  next_review: string;
  status: WordStatus;
}

export interface Settings {
  dailyPlan: {
    nounsPages: number;
    adjectivesPages: number;
    verbsPages: number;
  };
  reviewMode: 'easy' | 'normal' | 'hard';
  dailyReviewLimit: number;
  testTypes: {
    flashcard: boolean;
    multipleChoice: boolean;
    writtenAnswer: boolean;
    reverseTranslation: boolean;
    onlyMistakes: boolean;
  };
  language: 'uz_latin' | 'uz_cyrillic' | 'ru';
  translationScript: 'latin' | 'cyrillic' | 'both';
  difficulty: 'beginner' | 'normal' | 'hard';
  lessonOrder: 'category' | 'mixed';
  notifications: {
    enabled: boolean;
    morning: string;
    afternoon: string;
    evening: string;
  };
  sound: {
    pronunciation: boolean;
    autoPlay: boolean;
    speed: 'slow' | 'normal' | 'fast';
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
  };
}

export interface ReviewEvent {
  id: string;
  word_id: string;
  mode: 'flashcard' | 'multipleChoice' | 'written';
  result: AnswerQuality | ReviewResult;
  created_at: string;
}

export interface AppState {
  words: Word[];
  progress: Record<string, UserProgress>;
  settings: Settings;
  events: ReviewEvent[];
}

export interface CategoryMeta {
  id: Category;
  title: string;
  subtitle: string;
  planKey: keyof Settings['dailyPlan'];
}

export type StudySource =
  | { kind: 'today'; title: string }
  | { kind: 'mistakes'; title: string }
  | { kind: 'category'; title: string; category: Category }
  | { kind: 'page'; title: string; category: Category; page: number }
  | { kind: 'custom'; title: string; ids: string[] };
