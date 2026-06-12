import type { GrammarModuleMeta, GrammarProgress, GrammarTopic, LearningMethod } from '../../types';
import { MODULE_1 } from './module1';
import { MODULE_2 } from './module2';
import { MODULE_3 } from './module3';
import { MODULE_4 } from './module4';
import { MODULE_5 } from './module5';
import { MODULE_6 } from './module6';
import { MODULE_7 } from './module7';
import { MODULE_8 } from './module8';

export const GRAMMAR_MODULES: GrammarModuleMeta[] = [
  { id: 1, title: 'Asos', subtitle: 'Alifbo, talaffuz, eng sodda gaplar', level: 'A1', icon: 'А' },
  { id: 2, title: 'Ot va rod', subtitle: "Rod, ko'plik, egalik", level: 'A1', icon: 'Р' },
  { id: 3, title: 'Kelishiklar', subtitle: '6 kelishik — poydevor', level: 'A1', icon: 'П' },
  { id: 4, title: "Fe'l", subtitle: 'Tuslanish, zamonlar, aspekt', level: 'A2', icon: 'Г' },
  { id: 5, title: "Harakat fe'llari", subtitle: 'идти/ходить, prefikslar', level: 'A2', icon: 'И' },
  { id: 6, title: 'Sifat va ravish', subtitle: 'Moslashuv, qiyoslash', level: 'A2', icon: 'С' },
  { id: 7, title: 'Sintaksis', subtitle: 'Murakkab gap, sonlar, modallar', level: 'B1', icon: 'К' },
  { id: 8, title: 'Nutq amaliyoti', subtitle: 'Kesim, yuklamalar, muloqot', level: 'B1', icon: 'Д' },
];

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  ...MODULE_1,
  ...MODULE_2,
  ...MODULE_3,
  ...MODULE_4,
  ...MODULE_5,
  ...MODULE_6,
  ...MODULE_7,
  ...MODULE_8,
];

export const TOPIC_BY_ID = new Map(GRAMMAR_TOPICS.map((topic) => [topic.id, topic]));

export function topicsForModule(moduleId: number) {
  return GRAMMAR_TOPICS.filter((topic) => topic.module === moduleId).sort((a, b) => a.order - b.order);
}

export function moduleProgressPercent(moduleId: number, progress: Record<string, GrammarProgress>) {
  const topics = topicsForModule(moduleId);
  if (!topics.length) return 0;
  const completed = topics.filter((topic) => progress[topic.id]?.completed).length;
  return Math.round((completed / topics.length) * 100);
}

/** Takrorlash kerak bo'lgan grammatika mavzulari (sodda SRS: 3 kunlik interval). */
export function dueGrammarTopics(progress: Record<string, GrammarProgress>) {
  const now = Date.now();
  return GRAMMAR_TOPICS.filter((topic) => {
    const item = progress[topic.id];
    if (!item || !item.completed) return false;
    return new Date(item.next_review).getTime() <= now;
  });
}

/** Keyingi o'rganilmagan mavzu — "davom etish" tugmasi uchun. */
export function nextGrammarTopic(progress: Record<string, GrammarProgress>) {
  return GRAMMAR_TOPICS.find((topic) => !progress[topic.id]?.completed);
}

export const LEARNING_METHODS: LearningMethod[] = [
  {
    id: 'active-recall',
    title: 'Active Recall',
    goal: "Qoidani o'qib qo'ymasdan, javobni xotiradan chiqarish.",
    steps: ["Savolni ko'ring", 'Javobni yozing yoki ayting', "Keyin to'g'ri javob bilan solishtiring"],
    bestFor: "So'z, kelishik, fe'l tuslash",
  },
  {
    id: 'pattern-drill',
    title: 'Pattern Drill',
    goal: "Bitta grammatik qolipni ko'p variantda avtomatlashtirish.",
    steps: ["Qolipni ko'ring", "So'zni almashtiring", 'Gapni ovoz chiqarib ayting'],
    bestFor: 'Я хочу..., Мне нужно..., У меня есть...',
  },
  {
    id: 'sentence-transform',
    title: 'Sentence Transformation',
    goal: "Gapni zamon, shaxs yoki kelishik bo'yicha o'zgartirish.",
    steps: ["Berilgan gapni o'qing", "Talab qilingan shaklga o'tkazing", 'Xatoni izoh bilan tuzating'],
    bestFor: "Fe'l zamonlari, savol/inkor gap",
  },
  {
    id: 'shadowing',
    title: 'Shadowing',
    goal: "Ruscha gap ritmini va talaffuzini ko'chirish.",
    steps: ['Gapni tinglang', 'Darhol ortidan ayting', '3 marta takrorlang'],
    bestFor: 'Speaking va listening',
  },
  {
    id: 'dictation',
    title: 'Mini Dictation',
    goal: "Eshitilgan ruscha gapni yozish orqali listening va spellingni kuchaytirish.",
    steps: ['Gapni eshiting', 'Yozing', "So'zma-so'z tekshiring"],
    bestFor: "Harflar, yumshoq belgi, predloglar",
  },
  {
    id: 'role-play',
    title: 'Role Play',
    goal: 'Grammatikani real vaziyatda ishlatish.',
    steps: ['Vaziyat tanlang', 'Ruscha javob bering', 'AI yoki app xatoni tuzatsin'],
    bestFor: "Do'kon, restoran, taksi, ish, telefon",
  },
];
