import { useEffect, useMemo, useRef } from 'react';
import { computeStats, useAppStore } from '../store/appStore';

let initStarted = false;

/**
 * Zustand store ustidagi moslik adapteri.
 * Sahifalar avvalgi useAppData interfeysi bilan ishlashda davom etadi,
 * butun holat esa endi markaziy store'da yashaydi.
 */
export function useAppData() {
  const store = useAppStore();
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current || initStarted) return;
    initRef.current = true;
    initStarted = true;
    void useAppStore.getState().init();
  }, []);

  // Tashqi ko'rinish sozlamalarini hujjatga qo'llash
  useEffect(() => {
    const root = document.documentElement;
    const theme = store.settings.appearance?.theme ?? 'system';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', theme === 'dark' || (theme === 'system' && prefersDark));
    root.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
    root.classList.add(`text-size-${store.settings.appearance?.fontSize ?? 'medium'}`);
  }, [store.settings]);

  const stats = useMemo(
    () => computeStats({ progress: store.progress, events: store.events, words: store.words }),
    [store.progress, store.events, store.words],
  );

  return {
    words: store.words,
    progress: store.progress,
    settings: store.settings,
    events: store.events,
    tutorMessages: store.tutorMessages,
    userProfile: store.userProfile,
    lessonProgress: store.lessonProgress,
    achievements: store.achievements,
    dailyActivity: store.dailyActivity,
    exerciseResults: store.exerciseResults,
    speakingAttempts: store.speakingAttempts,
    grammarProgress: store.grammarProgress,
    loading: store.loading,
    syncStatus: store.syncStatus,
    lastSyncedAt: store.lastSyncedAt,
    stats,
    reload: store.reload,
    reviewWord: store.reviewWord,
    updateSettings: store.updateSettings,
    exportData: store.exportAll,
    importData: store.importAll,
    clearProgress: store.clearAllProgress,
    clearMistakes: store.clearMistakes,
    addTutorMessage: store.addTutorMessage,
    clearTutorChat: store.clearTutorChat,
    addSpeakingAttempt: store.addSpeakingAttempt,
    saveLessonResult: store.saveLessonResult,
    resetSettings: store.resetAllSettings,
  };
}
