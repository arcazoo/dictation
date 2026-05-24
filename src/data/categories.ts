import type { CategoryMeta } from '../types';

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'noun',
    title: 'Существительные',
    subtitle: 'Имя существительное - otlar',
    planKey: 'nounsPages',
  },
  {
    id: 'adjective',
    title: 'Прилагательные',
    subtitle: 'Имя прилагательное - sifatlar',
    planKey: 'adjectivesPages',
  },
  {
    id: 'verb',
    title: 'Глаголы',
    subtitle: "Fe'llar",
    planKey: 'verbsPages',
  },
];

export const CATEGORY_RU: Record<string, string> = {
  noun: 'Имя существительное',
  adjective: 'Имя прилагательное',
  verb: 'Глаголы',
};
