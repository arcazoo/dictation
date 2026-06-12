export type Category = 'noun' | 'adjective' | 'verb';
export type WordStatus = 'new' | 'learning' | 'difficult' | 'known' | 'mastered';
export type ReviewResult = 'known' | 'hard' | 'unknown';
export type AnswerQuality = 'correct' | 'close' | 'wrong';
export type ExerciseType =
  | 'introduce'
  | 'multipleChoiceRuUz'
  | 'multipleChoiceUzRu'
  | 'writtenRecall'
  | 'writtenReverse'
  | 'wordBuilder'
  | 'sentenceBuilder'
  | 'fillBlank'
  | 'listenChoose'
  | 'listenType'
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
  /** Tarjimaning lotin yozuvi (kirilldan avtomatik transliteratsiya) */
  uzbek_latin?: string;
  category: Category;
  category_ru: string;
  page: number;
  /** Urg'u belgisi bilan yozilgan shakl: молоко́ */
  stressed?: string;
  /** Otlar uchun rod */
  gender?: 'м' | 'ж' | 'с';
  /** Noto'g'ri ko'plik shakli */
  plural?: string;
  /** Fe'llar uchun aspekt jufti (НСВ <-> СВ) */
  aspect_pair?: string;
  /** Fe'l tuslanish turi */
  conjugation_type?: 1 | 2;
  example_ru?: string;
  example_uz?: string;
}

/**
 * SRS progress. Legacy maydonlar (level, ease_factor...) eski ma'lumotlar bilan
 * moslik uchun saqlanadi; FSRS maydonlari yangi scheduler uchun.
 */
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
  // FSRS card maydonlari
  fsrs_stability?: number;
  fsrs_difficulty?: number;
  fsrs_reps?: number;
  fsrs_lapses?: number;
  fsrs_state?: number;
  fsrs_last_review?: string;
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
    /** Dars ichidagi to'g'ri/xato feedback ovozlari */
    effects: boolean;
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

// ===================== Grammatika kursi =====================

export type GrammarLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export type GrammarExerciseType =
  | 'choose'
  | 'fillBlank'
  | 'transform'
  | 'translate'
  | 'caseDetector'
  | 'conjugationDrill'
  | 'sentenceBuilder'
  | 'errorHunt';

export interface GrammarExercise {
  id: string;
  type: GrammarExerciseType;
  prompt: string;
  answer: string;
  choices?: string[];
  /** sentenceBuilder uchun aralashtiriladigan tokenlar */
  tokens?: string[];
  explanation_uz: string;
}

export interface GrammarSection {
  heading: string;
  body: string;
  /** Oddiy jadval: birinchi qator sarlavha */
  table?: string[][];
}

export interface GrammarExample {
  ru: string;
  uz: string;
  note?: string;
}

export interface GrammarMistake {
  wrong: string;
  right: string;
  why_uz: string;
}

export interface GrammarDialogueLine {
  speaker: string;
  ru: string;
  uz: string;
}

export interface GrammarTopic {
  id: string;
  module: number;
  order: number;
  level: GrammarLevel;
  title: string;
  subtitle: string;
  theory: GrammarSection[];
  /** O'zbek tili bilan solishtirish */
  comparisonWithUzbek?: string;
  examples: GrammarExample[];
  commonMistakes: GrammarMistake[];
  exercises: GrammarExercise[];
  miniDialogue?: GrammarDialogueLine[];
}

export interface GrammarModuleMeta {
  id: number;
  title: string;
  subtitle: string;
  level: GrammarLevel;
  icon: string;
}

export interface GrammarProgress {
  topic_id: string;
  exercises_done: number;
  correct_count: number;
  wrong_count: number;
  best_score: number;
  completed: boolean;
  last_seen: string;
  next_review: string;
}

export interface LearningMethod {
  id: string;
  title: string;
  goal: string;
  steps: string[];
  bestFor: string;
}

// ===================== App holati =====================

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
  grammarProgress: Record<string, GrammarProgress>;
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
  type: 'page' | 'review' | 'mixedChallenge' | 'mistakeRepair' | 'grammar';
  grammarTopicId?: string;
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
