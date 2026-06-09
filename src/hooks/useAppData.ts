import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addEvent,
  clearProgress,
  clearTutorMessages,
  exportData,
  getAchievements,
  getDailyActivity,
  getEvents,
  getExerciseResults,
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
  saveLessonProgress,
  saveProgress,
  saveSettings,
  saveSpeakingAttempt,
  saveTutorMessage,
  saveUserProfile,
  seedDatabase,
} from '../db/indexedDb';
import type {
  AnswerQuality,
  AppState,
  ExerciseResult,
  LessonProgress,
  ReviewEvent,
  ReviewResult,
  Settings,
  SpeakingAttempt,
  TutorChatMessage,
  Word,
} from '../types';
import { applyReview } from '../lib/srs';
import { saveBackupToServer } from '../lib/serverSync';
import {
  achievementsForState,
  makeExerciseResult,
  updateDailyActivity,
  updateProfileForExercise,
  xpForResult,
} from '../lib/gamification';

const initialState: AppState = {
  words: [],
  progress: {},
  settings: {} as Settings,
  events: [],
  tutorMessages: [],
  userProfile: {
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
  },
  lessonProgress: {},
  achievements: [],
  dailyActivity: {},
  exerciseResults: [],
  speakingAttempts: [],
};

export function useAppData() {
  const [state, setState] = useState<AppState>(initialState);
  const [loading, setLoading] = useState(true);

  const syncToServer = useCallback(async (snapshot: Pick<AppState, 'progress' | 'settings' | 'events'>) => {
    if (!navigator.onLine || !snapshot.settings.appearance) return;

    try {
      await saveBackupToServer({
        exported_at: new Date().toISOString(),
        progress: Object.values(snapshot.progress),
        settings: snapshot.settings,
        events: snapshot.events.slice(-1000),
        tutorMessages: state.tutorMessages.slice(-300),
        userProfile: state.userProfile,
        lessonProgress: Object.values(state.lessonProgress),
        achievements: state.achievements,
        dailyActivity: Object.values(state.dailyActivity),
        exerciseResults: state.exerciseResults.slice(-2000),
        speakingAttempts: state.speakingAttempts.slice(-500),
      });
    } catch (error) {
      console.warn('Auto backup failed', error);
    }
  }, [state.achievements, state.dailyActivity, state.exerciseResults, state.lessonProgress, state.speakingAttempts, state.tutorMessages, state.userProfile]);

  const reload = useCallback(async () => {
    setLoading(true);
    await seedDatabase();
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
    ]);
    setState({ words, progress, settings, events, tutorMessages, userProfile, lessonProgress, achievements, dailyActivity, exerciseResults, speakingAttempts });
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    const root = document.documentElement;
    const theme = state.settings.appearance?.theme ?? 'system';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', theme === 'dark' || (theme === 'system' && prefersDark));
    root.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
    root.classList.add(`text-size-${state.settings.appearance?.fontSize ?? 'medium'}`);
  }, [state.settings]);

  const updateSettings = useCallback(
    async (settings: Settings) => {
      await saveSettings(settings);
      setState((current) => ({ ...current, settings }));
      void syncToServer({ progress: state.progress, settings, events: state.events });
    },
    [state.events, state.progress, syncToServer],
  );

  const reviewWord = useCallback(
    async (word: Word, result: ReviewResult | AnswerQuality, mode: ReviewEvent['mode'], responseMs = 0) => {
      const previousProgress = state.progress[word.id];
      const next = applyReview(previousProgress, word.id, result, responseMs);
      const xp = xpForResult(result, previousProgress, (previousProgress?.wrong_count ?? 0) > 0 && (result === 'correct' || result === 'known'));
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
        type: mode === 'multipleChoice' ? 'multipleChoiceRuUz' : mode === 'written' ? 'writtenRecall' : 'multipleChoiceRuUz',
        result,
        responseMs,
        xp,
      });
      const todayKey = new Date().toISOString().slice(0, 10);
      const nextActivity = updateDailyActivity(state.dailyActivity[todayKey], result, xp);
      const nextProfile = updateProfileForExercise(state.userProfile, result, xp);
      const masteredWords = Object.values({ ...state.progress, [word.id]: next }).filter((item) => item.status === 'mastered').length;
      const newAchievements = achievementsForState(nextProfile, state.achievements, masteredWords, [...state.exerciseResults, exerciseResult]);
      await Promise.all([
        saveProgress(next),
        addEvent(event),
        saveExerciseResult(exerciseResult),
        saveDailyActivity(nextActivity),
        saveUserProfile(nextProfile),
        ...newAchievements.map((achievement) => saveAchievement(achievement)),
      ]);
      const nextProgress = { ...state.progress, [word.id]: next };
      const nextEvents = [...state.events, event];
      const nextExerciseResults = [...state.exerciseResults, exerciseResult];
      const nextAchievements = [...state.achievements, ...newAchievements];
      setState((current) => ({
        ...current,
        progress: nextProgress,
        events: nextEvents,
        exerciseResults: nextExerciseResults,
        dailyActivity: { ...current.dailyActivity, [todayKey]: nextActivity },
        userProfile: nextProfile,
        achievements: nextAchievements,
      }));
      void syncToServer({ progress: nextProgress, settings: state.settings, events: nextEvents });
    },
    [state.achievements, state.dailyActivity, state.events, state.exerciseResults, state.progress, state.settings, state.userProfile, syncToServer],
  );

  const saveLessonResult = useCallback(async (lesson: LessonProgress, results: ExerciseResult[]) => {
    await saveLessonProgress(lesson);
    await Promise.all(results.map((result) => saveExerciseResult(result)));
    setState((current) => ({
      ...current,
      lessonProgress: { ...current.lessonProgress, [lesson.lesson_id]: lesson },
      exerciseResults: [...current.exerciseResults, ...results],
    }));
  }, []);

  const addTutorMessage = useCallback(async (message: Omit<TutorChatMessage, 'created_at'>) => {
    const fullMessage: TutorChatMessage = {
      ...message,
      created_at: new Date().toISOString(),
    };
    await saveTutorMessage(fullMessage);
    setState((current) => ({
      ...current,
      tutorMessages: [...current.tutorMessages, fullMessage].slice(-300),
    }));
    return fullMessage;
  }, []);

  const clearTutorChat = useCallback(async () => {
    await clearTutorMessages();
    setState((current) => ({ ...current, tutorMessages: [] }));
  }, []);

  const addSpeakingAttempt = useCallback(async (attempt: SpeakingAttempt) => {
    await saveSpeakingAttempt(attempt);
    setState((current) => ({
      ...current,
      speakingAttempts: [...current.speakingAttempts, attempt].slice(-500),
    }));
    void syncToServer({ progress: state.progress, settings: state.settings, events: state.events });
  }, [state.events, state.progress, state.settings, syncToServer]);

  const clearMistakes = useCallback(async () => {
    const nextItems = Object.values(state.progress).map((item) => ({
      ...item,
      wrong_count: 0,
      status: item.status === 'difficult' ? 'learning' : item.status,
    }));
    await Promise.all(nextItems.map((item) => saveProgress(item)));
    const nextProgress = Object.fromEntries(nextItems.map((item) => [item.word_id, item]));
    setState((current) => ({
      ...current,
      progress: nextProgress,
    }));
    void syncToServer({ progress: nextProgress, settings: state.settings, events: state.events });
  }, [state.events, state.progress, state.settings, syncToServer]);

  const clearAllProgress = useCallback(async () => {
    await clearProgress();
    setState((current) => ({ ...current, progress: {}, events: [] }));
    void syncToServer({ progress: {}, settings: state.settings, events: [] });
  }, [state.settings, syncToServer]);

  const resetAllSettings = useCallback(async () => {
    const settings = await resetSettings();
    setState((current) => ({ ...current, settings }));
    void syncToServer({ progress: state.progress, settings, events: state.events });
    return settings;
  }, [state.events, state.progress, syncToServer]);

  useEffect(() => {
    const syncCurrent = () => {
      void syncToServer({
        progress: state.progress,
        settings: state.settings,
        events: state.events,
      });
    };

    window.addEventListener('online', syncCurrent);
    return () => window.removeEventListener('online', syncCurrent);
  }, [state.events, state.progress, state.settings, syncToServer]);

  const stats = useMemo(() => {
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

    return {
      learned,
      todayCount: todayEvents.length,
      accuracy,
      streak,
      hardWords,
    };
  }, [state.events, state.progress, state.words]);

  return {
    ...state,
    loading,
    stats,
    reload,
    reviewWord,
    updateSettings,
    exportData,
    importData,
    clearProgress: clearAllProgress,
    clearMistakes,
    addTutorMessage,
    clearTutorChat,
    addSpeakingAttempt,
    saveLessonResult,
    resetSettings: resetAllSettings,
  };
}
