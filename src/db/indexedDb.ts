import { DEFAULT_SETTINGS } from '../data/defaultSettings';
import type {
  Achievement,
  DailyActivity,
  ExerciseResult,
  GrammarProgress,
  LessonProgress,
  ReviewEvent,
  Settings,
  SpeakingAttempt,
  TutorChatMessage,
  UserProfile,
  UserProgress,
  Word,
} from '../types';

const DB_NAME = 'ruscha-tez-db';
const DB_VERSION = 5;

type StoreName =
  | 'words'
  | 'progress'
  | 'settings'
  | 'events'
  | 'tutorMessages'
  | 'userProfile'
  | 'lessonProgress'
  | 'achievements'
  | 'dailyActivity'
  | 'exerciseResults'
  | 'speakingAttempts'
  | 'grammarProgress';

export interface ImportPayload {
  words?: Word[];
  progress?: UserProgress[];
  settings?: Settings;
  events?: ReviewEvent[];
  tutorMessages?: TutorChatMessage[];
  userProfile?: UserProfile;
  lessonProgress?: LessonProgress[];
  achievements?: Achievement[];
  dailyActivity?: DailyActivity[];
  exerciseResults?: ExerciseResult[];
  speakingAttempts?: SpeakingAttempt[];
  grammarProgress?: GrammarProgress[];
}

export const DEFAULT_USER_PROFILE: UserProfile = {
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

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('words')) {
        const words = db.createObjectStore('words', { keyPath: 'id' });
        words.createIndex('category', 'category');
        words.createIndex('page', 'page');
      }
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'word_id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('events')) {
        const events = db.createObjectStore('events', { keyPath: 'id' });
        events.createIndex('created_at', 'created_at');
        events.createIndex('word_id', 'word_id');
      }
      if (!db.objectStoreNames.contains('tutorMessages')) {
        const tutorMessages = db.createObjectStore('tutorMessages', { keyPath: 'id' });
        tutorMessages.createIndex('created_at', 'created_at');
      }
      if (!db.objectStoreNames.contains('userProfile')) {
        db.createObjectStore('userProfile', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('lessonProgress')) {
        const lessonProgress = db.createObjectStore('lessonProgress', { keyPath: 'lesson_id' });
        lessonProgress.createIndex('status', 'status');
      }
      if (!db.objectStoreNames.contains('achievements')) {
        db.createObjectStore('achievements', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('dailyActivity')) {
        db.createObjectStore('dailyActivity', { keyPath: 'date' });
      }
      if (!db.objectStoreNames.contains('exerciseResults')) {
        const exerciseResults = db.createObjectStore('exerciseResults', { keyPath: 'exercise_id' });
        exerciseResults.createIndex('created_at', 'created_at');
        exerciseResults.createIndex('word_id', 'word_id');
      }
      if (!db.objectStoreNames.contains('speakingAttempts')) {
        const speakingAttempts = db.createObjectStore('speakingAttempts', { keyPath: 'id' });
        speakingAttempts.createIndex('created_at', 'created_at');
        speakingAttempts.createIndex('mode', 'mode');
      }
      if (!db.objectStoreNames.contains('grammarProgress')) {
        db.createObjectStore('grammarProgress', { keyPath: 'topic_id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(storeName: StoreName, mode: IDBTransactionMode, callback: (store: IDBObjectStore) => Promise<T> | T) {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    let result: T;

    Promise.resolve(callback(store))
      .then((value) => {
        result = value;
      })
      .catch((error) => {
        tx.abort();
        reject(error);
      });

    tx.oncomplete = () => {
      db.close();
      resolve(result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error);
    };
  });
}

/**
 * So'zlar bazasini yuklaydi. Bundle hajmini kichik saqlash uchun words.json
 * endi runtime'da tarmoqdan olinadi; tarmoq bo'lmasa IndexedDB'dagi eski
 * nusxa ishlatiladi, u ham bo'lmasa lazy chunk fallback yuklanadi.
 */
export async function seedDatabase() {
  const existing = await getWords();
  // uzbek_latin maydoni yo'q bo'lsa — bu eski (tozalanmagan) baza, yangilaymiz
  const isCleanData = existing.length >= 2900 && existing.slice(0, 50).some((word) => word.uzbek_latin);
  if (isCleanData) return;

  let words: Word[] = [];
  try {
    const response = await fetch('/words.json');
    if (response.ok) words = (await response.json()) as Word[];
  } catch {
    words = [];
  }
  if (!words.length) {
    if (existing.length) return;
    const module = await import('../data/seedWords');
    words = module.SEED_WORDS;
  }
  if (!words.length) return;

  await withStore('words', 'readwrite', async (store) => {
    await requestToPromise(store.clear());
    for (const word of words) {
      store.put(word);
    }
  });
}

export async function getWords() {
  return withStore<Word[]>('words', 'readonly', (store) => requestToPromise(store.getAll() as IDBRequest<Word[]>));
}

export async function replaceWords(words: Word[]) {
  await withStore('words', 'readwrite', async (store) => {
    await requestToPromise(store.clear());
    for (const word of words) store.put(word);
  });
}

export async function getProgress() {
  const items = await withStore<UserProgress[]>('progress', 'readonly', (store) =>
    requestToPromise(store.getAll() as IDBRequest<UserProgress[]>),
  );
  return Object.fromEntries(items.map((item) => [item.word_id, item]));
}

export async function saveProgress(progress: UserProgress) {
  await withStore('progress', 'readwrite', (store) => {
    store.put(progress);
  });
}

export async function clearProgress() {
  await withStore('progress', 'readwrite', (store) => requestToPromise(store.clear()));
  await withStore('events', 'readwrite', (store) => requestToPromise(store.clear()));
}

export async function getSettings() {
  const row = await withStore<{ key: string; value: Settings } | undefined>('settings', 'readonly', (store) =>
    requestToPromise(store.get('settings')),
  );
  const value = row?.value ?? DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...value,
    dailyPlan: { ...DEFAULT_SETTINGS.dailyPlan, ...value.dailyPlan },
    testTypes: { ...DEFAULT_SETTINGS.testTypes, ...value.testTypes },
    notifications: { ...DEFAULT_SETTINGS.notifications, ...value.notifications },
    sound: { ...DEFAULT_SETTINGS.sound, ...value.sound },
    appearance: { ...DEFAULT_SETTINGS.appearance, ...value.appearance },
    ai: { ...DEFAULT_SETTINGS.ai, ...value.ai },
  };
}

export async function saveSettings(settings: Settings) {
  await withStore('settings', 'readwrite', (store) => {
    store.put({ key: 'settings', value: settings });
  });
}

export async function resetSettings() {
  await saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

export async function getEvents() {
  return withStore<ReviewEvent[]>('events', 'readonly', (store) =>
    requestToPromise(store.getAll() as IDBRequest<ReviewEvent[]>),
  );
}

export async function addEvent(event: ReviewEvent) {
  await withStore('events', 'readwrite', (store) => {
    store.put(event);
  });
}

export async function getTutorMessages() {
  return withStore<TutorChatMessage[]>('tutorMessages', 'readonly', (store) =>
    requestToPromise(store.getAll() as IDBRequest<TutorChatMessage[]>),
  );
}

export async function getUserProfile() {
  const profile = await withStore<UserProfile | undefined>('userProfile', 'readonly', (store) =>
    requestToPromise(store.get('local-user')),
  );
  return profile ?? DEFAULT_USER_PROFILE;
}

export async function saveUserProfile(profile: UserProfile) {
  await withStore('userProfile', 'readwrite', (store) => {
    store.put(profile);
  });
}

export async function getLessonProgress() {
  const items = await withStore<LessonProgress[]>('lessonProgress', 'readonly', (store) =>
    requestToPromise(store.getAll() as IDBRequest<LessonProgress[]>),
  );
  return Object.fromEntries(items.map((item) => [item.lesson_id, item]));
}

export async function saveLessonProgress(progress: LessonProgress) {
  await withStore('lessonProgress', 'readwrite', (store) => {
    store.put(progress);
  });
}

export async function getAchievements() {
  return withStore<Achievement[]>('achievements', 'readonly', (store) =>
    requestToPromise(store.getAll() as IDBRequest<Achievement[]>),
  );
}

export async function saveAchievement(achievement: Achievement) {
  await withStore('achievements', 'readwrite', (store) => {
    store.put(achievement);
  });
}

export async function getDailyActivity() {
  const items = await withStore<DailyActivity[]>('dailyActivity', 'readonly', (store) =>
    requestToPromise(store.getAll() as IDBRequest<DailyActivity[]>),
  );
  return Object.fromEntries(items.map((item) => [item.date, item]));
}

export async function saveDailyActivity(activity: DailyActivity) {
  await withStore('dailyActivity', 'readwrite', (store) => {
    store.put(activity);
  });
}

export async function getExerciseResults() {
  return withStore<ExerciseResult[]>('exerciseResults', 'readonly', (store) =>
    requestToPromise(store.getAll() as IDBRequest<ExerciseResult[]>),
  );
}

export async function saveExerciseResult(result: ExerciseResult) {
  await withStore('exerciseResults', 'readwrite', (store) => {
    store.put(result);
  });
}

export async function getSpeakingAttempts() {
  return withStore<SpeakingAttempt[]>('speakingAttempts', 'readonly', (store) =>
    requestToPromise(store.getAll() as IDBRequest<SpeakingAttempt[]>),
  );
}

export async function saveSpeakingAttempt(attempt: SpeakingAttempt) {
  await withStore('speakingAttempts', 'readwrite', (store) => {
    store.put(attempt);
  });
}

export async function getGrammarProgress() {
  const items = await withStore<GrammarProgress[]>('grammarProgress', 'readonly', (store) =>
    requestToPromise(store.getAll() as IDBRequest<GrammarProgress[]>),
  );
  return Object.fromEntries(items.map((item) => [item.topic_id, item]));
}

export async function saveGrammarProgress(progress: GrammarProgress) {
  await withStore('grammarProgress', 'readwrite', (store) => {
    store.put(progress);
  });
}

export async function clearGrammarProgress() {
  await withStore('grammarProgress', 'readwrite', (store) => requestToPromise(store.clear()));
}

export async function saveTutorMessage(message: TutorChatMessage) {
  await withStore('tutorMessages', 'readwrite', (store) => {
    store.put(message);
  });
}

export async function replaceTutorMessages(messages: TutorChatMessage[]) {
  await withStore('tutorMessages', 'readwrite', async (store) => {
    await requestToPromise(store.clear());
    for (const message of messages) store.put(message);
  });
}

export async function clearTutorMessages() {
  await withStore('tutorMessages', 'readwrite', (store) => requestToPromise(store.clear()));
}

export async function exportData() {
  const [words, progress, settings, events, tutorMessages, userProfile, lessonProgress, achievements, dailyActivity, exerciseResults, speakingAttempts, grammarProgress] =
    await Promise.all([
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
    exported_at: new Date().toISOString(),
    words,
    progress: Object.values(progress),
    settings,
    events,
    tutorMessages,
    userProfile,
    lessonProgress: Object.values(lessonProgress),
    achievements,
    dailyActivity: Object.values(dailyActivity),
    exerciseResults,
    speakingAttempts,
    grammarProgress: Object.values(grammarProgress),
  };
}

export async function importData(payload: ImportPayload) {
  if (payload.words?.length) await replaceWords(payload.words);
  if (payload.progress) {
    await withStore('progress', 'readwrite', async (store) => {
      await requestToPromise(store.clear());
      for (const item of payload.progress ?? []) store.put(item);
    });
  }
  if (payload.settings) await saveSettings(payload.settings);
  if (payload.events) {
    await withStore('events', 'readwrite', async (store) => {
      await requestToPromise(store.clear());
      for (const item of payload.events ?? []) store.put(item);
    });
  }
  if (payload.tutorMessages) await replaceTutorMessages(payload.tutorMessages);
  if (payload.userProfile) await saveUserProfile(payload.userProfile);
  if (payload.lessonProgress) {
    await withStore('lessonProgress', 'readwrite', async (store) => {
      await requestToPromise(store.clear());
      for (const item of payload.lessonProgress ?? []) store.put(item);
    });
  }
  if (payload.achievements) {
    await withStore('achievements', 'readwrite', async (store) => {
      await requestToPromise(store.clear());
      for (const item of payload.achievements ?? []) store.put(item);
    });
  }
  if (payload.dailyActivity) {
    await withStore('dailyActivity', 'readwrite', async (store) => {
      await requestToPromise(store.clear());
      for (const item of payload.dailyActivity ?? []) store.put(item);
    });
  }
  if (payload.exerciseResults) {
    await withStore('exerciseResults', 'readwrite', async (store) => {
      await requestToPromise(store.clear());
      for (const item of payload.exerciseResults ?? []) store.put(item);
    });
  }
  if (payload.speakingAttempts) {
    await withStore('speakingAttempts', 'readwrite', async (store) => {
      await requestToPromise(store.clear());
      for (const item of payload.speakingAttempts ?? []) store.put(item);
    });
  }
  if (payload.grammarProgress) {
    await withStore('grammarProgress', 'readwrite', async (store) => {
      await requestToPromise(store.clear());
      for (const item of payload.grammarProgress ?? []) store.put(item);
    });
  }
}
