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

  // Yozuv rejimi: tarjimalarni lotin/kirill/ikkalasida ko'rsatish
  const words = useMemo(() => {
    const script = store.settings.translationScript ?? 'latin';
    if (script === 'cyrillic') return store.words;
    return store.words.map((word) => {
      if (!word.uzbek_latin) return word;
      if (script === 'latin') return { ...word, uzbek: word.uzbek_latin };
      return { ...word, uzbek: `${word.uzbek_latin} · ${word.uzbek}` };
    });
  }, [store.words, store.settings.translationScript]);

  const stats = useMemo(
    () => computeStats({ progress: store.progress, events: store.events, words }),
    [store.progress, store.events, words],
  );

  return {
    words,
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
    updateProfile: store.updateProfile,
    syncNow: store.syncSoon,
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
