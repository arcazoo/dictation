import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addEvent,
  clearProgress,
  exportData,
  getEvents,
  getProgress,
  getSettings,
  getWords,
  importData,
  resetSettings,
  saveProgress,
  saveSettings,
  seedDatabase,
} from '../db/indexedDb';
import type { AnswerQuality, AppState, ReviewEvent, ReviewResult, Settings, Word } from '../types';
import { applyReview } from '../lib/srs';
import { saveBackupToServer } from '../lib/serverSync';

const initialState: AppState = {
  words: [],
  progress: {},
  settings: {} as Settings,
  events: [],
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
      });
    } catch (error) {
      console.warn('Auto backup failed', error);
    }
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    await seedDatabase();
    const [words, progress, settings, events] = await Promise.all([getWords(), getProgress(), getSettings(), getEvents()]);
    setState({ words, progress, settings, events });
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
    async (word: Word, result: ReviewResult | AnswerQuality, mode: ReviewEvent['mode']) => {
      const next = applyReview(state.progress[word.id], word.id, result);
      const event: ReviewEvent = {
        id: `${Date.now()}-${word.id}-${Math.random().toString(16).slice(2)}`,
        word_id: word.id,
        mode,
        result,
        created_at: new Date().toISOString(),
      };
      await Promise.all([saveProgress(next), addEvent(event)]);
      const nextProgress = { ...state.progress, [word.id]: next };
      const nextEvents = [...state.events, event];
      setState((current) => ({
        ...current,
        progress: nextProgress,
        events: nextEvents,
      }));
      void syncToServer({ progress: nextProgress, settings: state.settings, events: nextEvents });
    },
    [state.events, state.progress, state.settings, syncToServer],
  );

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
    resetSettings: resetAllSettings,
  };
}
