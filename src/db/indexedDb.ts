import { DEFAULT_SETTINGS } from '../data/defaultSettings';
import { SEED_WORDS } from '../data/seedWords';
import type { ReviewEvent, Settings, TutorChatMessage, UserProgress, Word } from '../types';

const DB_NAME = 'ruscha-tez-db';
const DB_VERSION = 2;

type StoreName = 'words' | 'progress' | 'settings' | 'events' | 'tutorMessages';

export interface ImportPayload {
  words?: Word[];
  progress?: UserProgress[];
  settings?: Settings;
  events?: ReviewEvent[];
  tutorMessages?: TutorChatMessage[];
}

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

export async function seedDatabase() {
  const existing = await getWords();
  if (existing.length >= SEED_WORDS.length) return;

  await withStore('words', 'readwrite', async (store) => {
    await requestToPromise(store.clear());
    for (const word of SEED_WORDS) {
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
  return row?.value ?? DEFAULT_SETTINGS;
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
  const [words, progress, settings, events, tutorMessages] = await Promise.all([
    getWords(),
    getProgress(),
    getSettings(),
    getEvents(),
    getTutorMessages(),
  ]);
  return {
    exported_at: new Date().toISOString(),
    words,
    progress: Object.values(progress),
    settings,
    events,
    tutorMessages,
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
}
