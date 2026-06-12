import { create } from 'zustand';
import {
  addEvent,
  clearProgress,
  clearTutorMessages,
  exportData,
  getAchievements,
  getDailyActivity,
  getEvents,
  getExerciseResults,
  getGrammarProgress,
  getLessonProgress,
  getProgress,
  getSettings,
  getSpeakingAttempts,
  getTutorMessages,
  getUserProfile,
  getWords,
  importData,
  resetSettings,
  saveAchievement,
  saveDailyActivity,
  saveExerciseResult,
  saveGrammarProgress,
  saveLessonProgress,
  saveProgress,
  saveSettings,
  saveSpeakingAttempt,
  saveTutorMessage,
  saveUserProfile,
  seedDatabase,
  type ImportPayload,
} from '../db/indexedDb';
import { DEFAULT_SETTINGS } from '../data/defaultSettings';
import { applyReview } from '../lib/srs';
import { loadBackupFromServer, saveBackupToServer } from '../lib/serverSync';
import {
  achievementsForState,
  makeExerciseResult,
  updateDailyActivity,
  updateProfileForExercise,
  xpForResult,
} from '../lib/gamification';
import type {
  AnswerQuality,
  AppState,
  ExerciseResult,
  GrammarProgress,
  LearningLesson,
  LessonProgress,
  ReviewEvent,
  ReviewResult,
  Settings,
  SpeakingAttempt,
  StudySource,
  SyncStatus,
  TutorChatMessage,
  UserProfile,
  Word,
} from '../types';

const DEFAULT_PROFILE: UserProfile = {
  id: 'local-user',
  name: 'Learner',
  created_at: new Date().toISOString(),
  total_xp: 0,
  level: 1,
  streak: 0,
  last_active_date: '',
  hearts: 5,
  daily_goal_xp: 60,
  daily_goal_minutes: 10,
  hearts_enabled: true,
};

export interface AppStore extends AppState {
  loading: boolean;
  syncStatus: SyncStatus;
  lastSyncedAt: string;

  // Sessiya holati (saqlanmaydi)
  studySource: StudySource;
  testSource: StudySource;
  activeLesson: LearningLesson | null;
  activeGrammarTopicId: string | null;
  aiDraft: string;

  init: () => Promise<void>;
  reload: () => Promise<void>;
  reviewWord: (word: Word, result: ReviewResult | AnswerQuality, mode: ReviewEvent['mode'], responseMs?: number) => Promise<void>;
  saveLessonResult: (lesson: LessonProgress, results: ExerciseResult[]) => Promise<void>;
  saveGrammarResult: (progress: GrammarProgress, xp: number) => Promise<void>;
  updateSettings: (settings: Settings) => Promise<void>;
  resetAllSettings: () => Promise<Settings>;
  clearMistakes: () => Promise<void>;
  clearAllProgress: () => Promise<void>;
  addTutorMessage: (message: Omit<TutorChatMessage, 'created_at'>) => Promise<TutorChatMessage>;
  clearTutorChat: () => Promise<void>;
  addSpeakingAttempt: (attempt: SpeakingAttempt) => Promise<void>;
  exportAll: () => ReturnType<typeof exportData>;
  importAll: (payload: ImportPayload) => Promise<void>;
  syncSoon: () => void;

  setStudySource: (source: StudySource) => void;
  setTestSource: (source: StudySource) => void;
  setActiveLesson: (lesson: LearningLesson | null) => void;
  setActiveGrammarTopic: (topicId: string | null) => void;
  setAiDraft: (draft: string) => void;
}

let syncTimer: number | undefined;

function latestLocalTime(state: AppState) {
  const dates = [
    ...state.events.map((item) => item.created_at),
    ...state.tutorMessages.map((item) => item.created_at),
    ...state.exerciseResults.map((item) => item.created_at),
    ...state.speakingAttempts.map((item) => item.created_at),
    ...Object.values(state.lessonProgress).map((item) => item.last_seen || item.completed_at),
    ...Object.values(state.grammarProgress).map((item) => item.last_seen),
    ...Object.values(state.dailyActivity).map((item) => item.date),
  ];
  return dates.reduce((latest, value) => {
    const time = Date.parse(value);
    return Number.isFinite(time) ? Math.max(latest, time) : latest;
  }, 0);
}

async function readLocal(): Promise<AppState> {
  const [
    words,
    progress,
    settings,
    events,
    tutorMessages,
    userProfile,
    lessonProgress,
    achievements,
    dailyActivity,
    exerciseResults,
    speakingAttempts,
    grammarProgress,
  ] = await Promise.all([
    getWords(),
    getProgress(),
    getSettings(),
    getEvents(),
    getTutorMessages(),
    getUserProfile(),
    getLessonProgress(),
    getAchievements(),
    getDailyActivity(),
    getExerciseResults(),
    getSpeakingAttempts(),
    getGrammarProgress(),
  ]);
  return {
    words,
    progress,
    settings,
    events,
    tutorMessages,
    userProfile,
    lessonProgress,
    achievements,
    dailyActivity,
    exerciseResults,
    speakingAttempts,
    grammarProgress,
  };
}

export const useAppStore = create<AppStore>((set, get) => {
  const scheduleSync = () => {
    if (!navigator.onLine) {
      set({ syncStatus: 'offline' });
      return;
    }
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(async () => {
      const state = get();
      if (!state.settings.appearance) return;
      set({ syncStatus: 'syncing' });
      try {
        const savedAt = new Date().toISOString();
        await saveBackupToServer({
          exported_at: savedAt,
          progress: Object.values(state.progress),
          settings: state.settings,
          events: state.events.slice(-1000),
          tutorMessages: state.tutorMessages.slice(-300),
          userProfile: state.userProfile,
          lessonProgress: Object.values(state.lessonProgress),
          achievements: state.achievements,
          dailyActivity: Object.values(state.dailyActivity),
          exerciseResults: state.exerciseResults.slice(-2000),
          speakingAttempts: state.speakingAttempts.slice(-500),
          grammarProgress: Object.values(state.grammarProgress),
        });
        set({ lastSyncedAt: savedAt, syncStatus: 'synced' });
      } catch (error) {
        set({ syncStatus: 'error' });
        console.warn('Auto backup failed', error);
      }
    }, 2500);
  };

  return {
    words: [],
    progress: {},
    settings: DEFAULT_SETTINGS,
    events: [],
    tutorMessages: [],
    userProfile: DEFAULT_PROFILE,
    lessonProgress: {},
    achievements: [],
    dailyActivity: {},
    exerciseResults: [],
    speakingAttempts: [],
    grammarProgress: {},

    loading: true,
    syncStatus: navigator.onLine ? 'idle' : 'offline',
    lastSyncedAt: '',

    studySource: { kind: 'today', title: 'Bugungi dars' },
    testSource: { kind: 'today', title: 'Bugungi dars' },
    activeLesson: null,
    activeGrammarTopicId: null,
    aiDraft: '',

    init: async () => {
      await get().reload();
      window.addEventListener('online', () => get().syncSoon());
      window.addEventListener('offline', () => set({ syncStatus: 'offline' }));
    },

    reload: async () => {
      set({ loading: true });
      await seedDatabase();
      let localState = await readLocal();
      if (navigator.onLine) {
        try {
          set({ syncStatus: 'syncing' });
          const remote = await loadBackupFromServer();
          const remoteTime = Date.parse((remote as { exported_at?: string }).exported_at ?? '');
          const localTime = latestLocalTime(localState);
          if (Number.isFinite(remoteTime) && remoteTime > localTime) {
            await importData(remote);
            localState = await readLocal();
          }
          set({
            lastSyncedAt: Number.isFinite(remoteTime) ? new Date(remoteTime).toISOString() : new Date().toISOString(),
            syncStatus: 'synced',
          });
        } catch {
          set({ syncStatus: 'error' });
        }
      } else {
        set({ syncStatus: 'offline' });
      }
      set({ ...localState, loading: false });
    },

    reviewWord: async (word, result, mode, responseMs = 0) => {
      const state = get();
      const previous = state.progress[word.id];
      const next = applyReview(previous, word.id, result, responseMs);
      const xp = xpForResult(result, previous, (previous?.wrong_count ?? 0) > 0 && (result === 'correct' || result === 'known'));
      const event: ReviewEvent = {
        id: `${Date.now()}-${word.id}-${Math.random().toString(16).slice(2)}`,
        word_id: word.id,
        mode,
        result,
        created_at: new Date().toISOString(),
      };
      const exerciseResult = makeExerciseResult({
        exerciseId: event.id,
        wordId: word.id,
        type: mode === 'written' ? 'writtenRecall' : 'multipleChoiceRuUz',
        result,
        responseMs,
        xp,
      });
      const todayKey = new Date().toISOString().slice(0, 10);
      const nextActivity = updateDailyActivity(state.dailyActivity[todayKey], result, xp);
      const nextProfile = updateProfileForExercise(state.userProfile, result, xp);
      const masteredWords = Object.values({ ...state.progress, [word.id]: next }).filter((item) => item.status === 'mastered').length;
      const newAchievements = achievementsForState(nextProfile, state.achievements, masteredWords, [
        ...state.exerciseResults,
        exerciseResult,
      ]);
      await Promise.all([
        saveProgress(next),
        addEvent(event),
        saveExerciseResult(exerciseResult),
        saveDailyActivity(nextActivity),
        saveUserProfile(nextProfile),
        ...newAchievements.map((achievement) => saveAchievement(achievement)),
      ]);
      set((current) => ({
        progress: { ...current.progress, [word.id]: next },
        events: [...current.events, event],
        exerciseResults: [...current.exerciseResults, exerciseResult],
        dailyActivity: { ...current.dailyActivity, [todayKey]: nextActivity },
        userProfile: nextProfile,
        achievements: [...current.achievements, ...newAchievements],
      }));
      scheduleSync();
    },

    saveLessonResult: async (lesson, results) => {
      await saveLessonProgress(lesson);
      await Promise.all(results.map((result) => saveExerciseResult(result)));
      set((current) => ({
        lessonProgress: { ...current.lessonProgress, [lesson.lesson_id]: lesson },
        exerciseResults: [...current.exerciseResults, ...results],
      }));
      scheduleSync();
    },

    saveGrammarResult: async (progress, xp) => {
      const state = get();
      const todayKey = new Date().toISOString().slice(0, 10);
      const nextActivity = updateDailyActivity(state.dailyActivity[todayKey], 'correct', xp);
      const nextProfile = updateProfileForExercise(state.userProfile, 'correct', xp);
      await Promise.all([saveGrammarProgress(progress), saveDailyActivity(nextActivity), saveUserProfile(nextProfile)]);
      set((current) => ({
        grammarProgress: { ...current.grammarProgress, [progress.topic_id]: progress },
        dailyActivity: { ...current.dailyActivity, [todayKey]: nextActivity },
        userProfile: nextProfile,
      }));
      scheduleSync();
    },

    updateSettings: async (settings) => {
      await saveSettings(settings);
      set({ settings });
      scheduleSync();
    },

    resetAllSettings: async () => {
      const settings = await resetSettings();
      set({ settings });
      scheduleSync();
      return settings;
    },

    clearMistakes: async () => {
      const state = get();
      const nextItems = Object.values(state.progress).map((item) => ({
        ...item,
        wrong_count: 0,
        status: item.status === 'difficult' ? ('learning' as const) : item.status,
      }));
      await Promise.all(nextItems.map((item) => saveProgress(item)));
      set({ progress: Object.fromEntries(nextItems.map((item) => [item.word_id, item])) });
      scheduleSync();
    },

    clearAllProgress: async () => {
      await clearProgress();
      set({ progress: {}, events: [] });
      scheduleSync();
    },

    addTutorMessage: async (message) => {
      const fullMessage: TutorChatMessage = { ...message, created_at: new Date().toISOString() };
      await saveTutorMessage(fullMessage);
      set((current) => ({ tutorMessages: [...current.tutorMessages, fullMessage].slice(-300) }));
      return fullMessage;
    },

    clearTutorChat: async () => {
      await clearTutorMessages();
      set({ tutorMessages: [] });
    },

    addSpeakingAttempt: async (attempt) => {
      await saveSpeakingAttempt(attempt);
      set((current) => ({ speakingAttempts: [...current.speakingAttempts, attempt].slice(-500) }));
      scheduleSync();
    },

    exportAll: () => exportData(),
    importAll: (payload) => importData(payload),
    syncSoon: () => scheduleSync(),

    setStudySource: (source) => set({ studySource: source }),
    setTestSource: (source) => set({ testSource: source }),
    setActiveLesson: (lesson) => set({ activeLesson: lesson }),
    setActiveGrammarTopic: (topicId) => set({ activeGrammarTopicId: topicId }),
    setAiDraft: (draft) => set({ aiDraft: draft }),
  };
});

/** Sahifalar uchun umumiy hisoblangan statistika. */
export function computeStats(state: Pick<AppState, 'progress' | 'events' | 'words'>) {
  const progressValues = Object.values(state.progress);
  const learned = progressValues.filter((item) => item.status === 'known' || item.status === 'mastered').length;
  const today = new Date().toISOString().slice(0, 10);
  const todayEvents = state.events.filter((event) => event.created_at.startsWith(today));
  const correctToday = todayEvents.filter((event) => event.result === 'known' || event.result === 'correct').length;
  const accuracy = todayEvents.length ? Math.round((correctToday / todayEvents.length) * 100) : 0;
  const hardWords = state.words
    .filter((word) => (state.progress[word.id]?.wrong_count ?? 0) > 0)
    .sort((a, b) => (state.progress[b.id]?.wrong_count ?? 0) - (state.progress[a.id]?.wrong_count ?? 0))
    .slice(0, 8);

  const days = [...new Set(state.events.map((event) => event.created_at.slice(0, 10)))].sort().reverse();
  let streak = 0;
  const cursor = new Date();
  while (days.includes(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { learned, todayCount: todayEvents.length, accuracy, streak, hardWords };
}
