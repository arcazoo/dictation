import type { Settings, StudySource, UserProgress, Word } from '../types';
import { getTodayLesson } from './lesson';

export function getWordsForSource(
  source: StudySource,
  words: Word[],
  progress: Record<string, UserProgress>,
  settings: Settings,
) {
  if (source.kind === 'today') return getTodayLesson(words, progress, settings);
  if (source.kind === 'mistakes') {
    return words
      .filter((word) => (progress[word.id]?.wrong_count ?? 0) > 0)
      .sort((a, b) => (progress[b.id]?.wrong_count ?? 0) - (progress[a.id]?.wrong_count ?? 0));
  }
  if (source.kind === 'category') {
    return words.filter((word) => word.category === source.category).sort((a, b) => a.page - b.page);
  }
  if (source.kind === 'page') {
    return words.filter((word) => word.category === source.category && word.page === source.page);
  }
  const ids = new Set(source.ids);
  return words.filter((word) => ids.has(word.id));
}

export function sourceLabel(source: StudySource) {
  return source.title;
}
