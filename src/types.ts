export type Category = 'noun' | 'adjective' | 'verb';
export type WordStatus = 'new' | 'learning' | 'difficult' | 'known' | 'mastered';
export type ReviewResult = 'known' | 'hard' | 'unknown';
export type AnswerQuality = 'correct' | 'close' | 'wrong';
export type ExerciseType =
  | 'multipleChoiceRuUz'
  | 'multipleChoiceUzRu'
  | 'writtenRecall'
  | 'wordBuilder'
  | 'sentenceBuilder'
  | 'fillBlank'
  | 'listenChoose'
  | 'mistakeDrill'
  | 'speedRound'
  | 'aiExample';
export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'review_needed';
export type AiCoachMode =
  | 'chat'
  | 'explain'
  | 'examples'
  | 'quiz'
  | 'mistakes'
  | 'dailyCoach'
  | 'lessonFeedback'
  | 'grammarHelp'
  | 'adaptivePlan'
  | 'speakingPractice'
  | 'listeningPractice'
  | 'ieltsSpeaking'
  | 'rolePlay'
  | 'audioConversation'
  | 'strictMotivator';
export type CoachTone = 'kind' | 'normal' | 'strict' | 'funnyStrict';
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

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
  ease_factor?: number;
  interval_days?: number;
  lapses?: number;
  average_response_ms?: number;
  confidence?: number;
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
  ai: {
    coachTone: CoachTone;
    answerLength: 'short' | 'normal' | 'detailed';
    autoSpeak: boolean;
    speechLanguage: 'ru-RU' | 'uz-UZ' | 'en-US';
    ieltsScoring: boolean;
    strictCorrection: boolean;
  };
}

export interface ReviewEvent {
  id: string;
  word_id: string;
  mode: 'flashcard' | 'multipleChoice' | 'written';
  result: AnswerQuality | ReviewResult;
  created_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  created_at: string;
  total_xp: number;
  level: number;
  streak: number;
  last_active_date: string;
  hearts: number;
  daily_goal_xp: number;
  daily_goal_minutes: number;
  hearts_enabled: boolean;
}

export interface LessonProgress {
  lesson_id: string;
  status: LessonStatus;
  completed_at: string;
  score: number;
  xp_earned: number;
  mistakes: number;
  attempts: number;
  progress_percent: number;
  last_seen: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked_at: string;
  icon: string;
}

export interface DailyActivity {
  date: string;
  xp: number;
  lessons_completed: number;
  correct_answers: number;
  wrong_answers: number;
  minutes_spent: number;
}

export interface ExerciseResult {
  exercise_id: string;
  lesson_id?: string;
  word_id: string;
  type: ExerciseType;
  result: AnswerQuality | ReviewResult;
  response_ms: number;
  xp_earned: number;
  created_at: string;
}

export interface TutorChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  created_at: string;
}

export interface SpeakingMistake {
  original: string;
  corrected: string;
  explanation_uz: string;
}

export interface SpeakingFeedback {
  type: 'speakingFeedback';
  score: number;
  ieltsBand: number;
  fluency: number;
  grammar: number;
  vocabulary: number;
  pronunciationEstimate: number;
  relevance: number;
  mistakes: SpeakingMistake[];
  betterAnswer_ru: string;
  betterAnswer_uz: string;
  nextQuestion_ru: string;
  motivation_uz: string;
}

export interface SpeakingAttempt {
  id: string;
  created_at: string;
  mode: AiCoachMode;
  question_ru: string;
  user_transcript: string;
  feedback?: SpeakingFeedback;
  score?: number;
  ieltsBand?: number;
}

export interface AppState {
  words: Word[];
  progress: Record<string, UserProgress>;
  settings: Settings;
  events: ReviewEvent[];
  tutorMessages: TutorChatMessage[];
  userProfile: UserProfile;
  lessonProgress: Record<string, LessonProgress>;
  achievements: Achievement[];
  dailyActivity: Record<string, DailyActivity>;
  exerciseResults: ExerciseResult[];
  speakingAttempts: SpeakingAttempt[];
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

export interface LearningLesson {
  id: string;
  unit_id: string;
  title: string;
  subtitle: string;
  category?: Category;
  page?: number;
  type: 'page' | 'review' | 'mixedChallenge' | 'mistakeRepair';
  status: LessonStatus;
  xp: number;
  wordIds: string[];
}

export interface LearningUnit {
  id: string;
  title: string;
  subtitle: string;
  lessons: LearningLesson[];
  progress_percent: number;
}

export interface Exercise {
  id: string;
  lesson_id: string;
  type: ExerciseType;
  word: Word;
  prompt: string;
  choices?: string[];
  correctAnswer: string;
  tokens?: string[];
  sentence?: string;
  blank?: string;
}
