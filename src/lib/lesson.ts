import type { Category, Settings, UserProgress, Word } from '../types';
import { CATEGORIES } from '../data/categories';
import { isDue } from './date';

const WORDS_PER_PAGE = 20;

function interleave(groups: Word[][]) {
  const result: Word[] = [];
  let index = 0;
  while (groups.some((group) => index < group.length)) {
    for (const group of groups) {
      if (group[index]) result.push(group[index]);
    }
    index += 1;
  }
  return result;
}

export function getDueWords(words: Word[], progress: Record<string, UserProgress>, limit = 40) {
  return words
    .filter((word) => {
      const item = progress[word.id];
      return item && item.status !== 'new' && isDue(item.next_review);
    })
    .sort((a, b) => (progress[b.id]?.wrong_count ?? 0) - (progress[a.id]?.wrong_count ?? 0))
    .slice(0, limit);
}

export function getNewWords(words: Word[], progress: Record<string, UserProgress>, settings: Settings) {
  const chunks = CATEGORIES.map((category) => {
    const target = Math.max(0, Math.round(settings.dailyPlan[category.planKey] * WORDS_PER_PAGE));
    return words
      .filter((word) => word.category === category.id && !progress[word.id])
      .sort((a, b) => a.page - b.page || a.russian.localeCompare(b.russian))
      .slice(0, target);
  });

  return settings.lessonOrder === 'mixed' ? interleave(chunks) : chunks.flat();
}

export function getTodayLesson(words: Word[], progress: Record<string, UserProgress>, settings: Settings) {
  const due = getDueWords(words, progress, settings.dailyReviewLimit);
  const dueIds = new Set(due.map((word) => word.id));
  const newWords = getNewWords(words, progress, settings).filter((word) => !dueIds.has(word.id));
  const weightedMistakes = due.filter((word) => (progress[word.id]?.wrong_count ?? 0) >= 2);
  const lesson = [...due, ...weightedMistakes, ...newWords];
  if (settings.lessonOrder === 'category') return lesson.sort((a, b) => categoryOrder(a.category) - categoryOrder(b.category));
  return lesson;
}

function categoryOrder(category: Category) {
  return category === 'noun' ? 0 : category === 'adjective' ? 1 : 2;
}

export function getPageStatus(words: Word[], progress: Record<string, UserProgress>, category: Category, page: number) {
  const pageWords = words.filter((word) => word.category === category && word.page === page);
  if (pageWords.length === 0) return 'Boshlanmagan';
  const pageProgress = pageWords.map((word) => progress[word.id]).filter(Boolean);
  if (pageProgress.length === 0) return 'Boshlanmagan';
  if (pageProgress.some((item) => isDue(item.next_review))) return 'Takrorlash kerak';
  if (pageProgress.length < pageWords.length) return "O'rganilmoqda";
  if (pageProgress.every((item) => item.status === 'mastered' || item.status === 'known')) return 'Tugagan';
  return "O'rganilmoqda";
}

export function getCategoryProgress(words: Word[], progress: Record<string, UserProgress>, category: Category) {
  const categoryWords = words.filter((word) => word.category === category);
  if (!categoryWords.length) return 0;
  const learned = categoryWords.filter((word) => progress[word.id]?.status === 'known' || progress[word.id]?.status === 'mastered');
  return Math.round((learned.length / categoryWords.length) * 100);
}

/**
 * Duolingo-uslubidagi aqlli distraktorlar: tasodifiy emas, javobga o'xshash
 * so'zlar tanlanadi (bir kategoriya, o'xshash uzunlik, umumiy boshlanish).
 */
export function getChoices(word: Word, words: Word[], reverse = false) {
  const answer = reverse ? word.russian : word.uzbek;
  const seen = new Set<string>([answer.toLowerCase()]);
  const candidates: Array<{ value: string; score: number }> = [];

  for (const item of words) {
    if (item.id === word.id) continue;
    const value = reverse ? item.russian : item.uzbek;
    const key = value?.toLowerCase();
    if (!value || !key || seen.has(key)) continue;
    seen.add(key);

    let score = Math.random() * 2; // ozgina tasodif — har safar bir xil bo'lmasin
    if (item.category === word.category) score += 3;
    const lengthDiff = Math.abs(value.length - answer.length);
    score += Math.max(0, 4 - lengthDiff);
    if (key[0] === answer[0]?.toLowerCase()) score += 3;
    if (key.slice(0, 2) === answer.slice(0, 2).toLowerCase()) score += 2;
    if (key.slice(-2) === answer.slice(-2).toLowerCase()) score += 1.5;
    candidates.push({ value, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  // Eng o'xshash 10 tadan 3 tasini tasodifiy olamiz
  const top = candidates.slice(0, 10);
  const distractors: string[] = [];
  while (distractors.length < 3 && top.length) {
    const index = Math.floor(Math.random() * top.length);
    distractors.push(top.splice(index, 1)[0].value);
  }
  return [...distractors, answer].sort(() => Math.random() - 0.5);
}
