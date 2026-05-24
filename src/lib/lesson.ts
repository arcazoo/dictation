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

export function getChoices(word: Word, words: Word[], reverse = false) {
  const answer = reverse ? word.russian : word.uzbek;
  const pool = words
    .filter((item) => item.id !== word.id)
    .map((item) => (reverse ? item.russian : item.uzbek))
    .filter((value, index, list) => value && list.indexOf(value) === index);
  const distractors = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
  return [...distractors, answer].sort(() => Math.random() - 0.5);
}
