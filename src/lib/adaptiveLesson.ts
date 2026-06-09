import { CATEGORIES } from '../data/categories';
import type { LearningLesson, LearningUnit, LessonProgress, Settings, UserProgress, Word } from '../types';
import { getDueWords, getTodayLesson } from './lesson';

const PAGES_PER_UNIT = 5;

export function confidenceForWord(progress?: UserProgress) {
  if (!progress) return 0;
  if (typeof progress.confidence === 'number') return progress.confidence;
  const total = progress.correct_count + progress.wrong_count;
  if (!total) return 20;
  return Math.max(0, Math.min(100, Math.round((progress.correct_count / total) * 100 + progress.level * 8)));
}

export function buildLearningPath(
  words: Word[],
  progress: Record<string, UserProgress>,
  lessonProgress: Record<string, LessonProgress>,
) {
  const units: LearningUnit[] = [];

  for (let unitIndex = 0; unitIndex < 10; unitIndex += 1) {
    const startPage = unitIndex * PAGES_PER_UNIT + 1;
    const endPage = startPage + PAGES_PER_UNIT - 1;
    const lessons: LearningLesson[] = [];

    for (const category of CATEGORIES) {
      for (let page = startPage; page <= endPage; page += 1) {
        const pageWords = words.filter((word) => word.category === category.id && word.page === page);
        if (!pageWords.length) continue;
        const id = `${category.id}-${page}`;
        lessons.push({
          id,
          unit_id: `unit-${unitIndex + 1}`,
          title: `${category.title} ${page}-varaq`,
          subtitle: `${pageWords.length} ta so‘z`,
          category: category.id,
          page,
          type: 'page',
          status: resolveLessonStatus(id, lessons.length, unitIndex, lessonProgress),
          xp: 60,
          wordIds: pageWords.map((word) => word.id),
        });
      }
    }

    const reviewId = `unit-${unitIndex + 1}-review`;
    lessons.push({
      id: reviewId,
      unit_id: `unit-${unitIndex + 1}`,
      title: 'Review',
      subtitle: 'Eski va qiyin so‘zlar',
      type: 'review',
      status: resolveLessonStatus(reviewId, lessons.length, unitIndex, lessonProgress),
      xp: 80,
      wordIds: words
        .filter((word) => word.page >= startPage && word.page <= endPage)
        .slice(0, 30)
        .map((word) => word.id),
    });

    const completed = lessons.filter((lesson) => lessonProgress[lesson.id]?.status === 'completed').length;
    units.push({
      id: `unit-${unitIndex + 1}`,
      title: `Unit ${unitIndex + 1}`,
      subtitle: `${startPage}-${endPage}-varaqlar`,
      lessons,
      progress_percent: Math.round((completed / lessons.length) * 100),
    });
  }

  markFirstAvailable(units);
  markReviewNeeded(units, words, progress);
  return units;
}

export function buildDailyAdaptiveLesson(
  words: Word[],
  progress: Record<string, UserProgress>,
  settings: Settings,
) {
  const targetMinutes = settings.difficulty === 'hard' ? 15 : settings.reviewMode === 'hard' ? 15 : 10;
  const targetWords = targetMinutes <= 5 ? 12 : targetMinutes <= 10 ? 20 : targetMinutes <= 15 ? 30 : 45;
  const due = getDueWords(words, progress, Math.ceil(targetWords * 0.45));
  const mistakes = words
    .filter((word) => (progress[word.id]?.wrong_count ?? 0) > 0)
    .sort((a, b) => (progress[b.id]?.wrong_count ?? 0) - (progress[a.id]?.wrong_count ?? 0))
    .slice(0, Math.ceil(targetWords * 0.25));
  const newWords = getTodayLesson(words, progress, settings).slice(0, targetWords);
  const seen = new Set<string>();
  return [...due, ...mistakes, ...newWords].filter((word) => {
    if (seen.has(word.id)) return false;
    seen.add(word.id);
    return true;
  }).slice(0, targetWords);
}

function resolveLessonStatus(
  id: string,
  lessonIndex: number,
  unitIndex: number,
  lessonProgress: Record<string, LessonProgress>,
) {
  const saved = lessonProgress[id]?.status;
  if (saved) return saved;
  if (unitIndex === 0 && lessonIndex === 0) return 'available';
  return 'locked';
}

function markFirstAvailable(units: LearningUnit[]) {
  let unlocked = false;
  for (const unit of units) {
    for (const lesson of unit.lessons) {
      if (lesson.status === 'completed') continue;
      if (!unlocked) {
        lesson.status = lesson.status === 'locked' ? 'available' : lesson.status;
        unlocked = true;
      }
    }
  }
}

function markReviewNeeded(units: LearningUnit[], words: Word[], progress: Record<string, UserProgress>) {
  const wordById = new Map(words.map((word) => [word.id, word]));
  for (const unit of units) {
    for (const lesson of unit.lessons) {
      if (lesson.status === 'completed') {
        const due = lesson.wordIds.some((id) => {
          const word = wordById.get(id);
          if (!word) return false;
          const item = progress[word.id];
          return item && new Date(item.next_review).getTime() <= Date.now();
        });
        if (due) lesson.status = 'review_needed';
      }
    }
  }
}
