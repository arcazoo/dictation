import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { StatTile } from '../components/StatTile';
import { WordCard } from '../components/WordCard';
import { CATEGORIES } from '../data/categories';
import { getCategoryProgress } from '../lib/lesson';
import type { UserProgress, Word } from '../types';

export function StatsPage({
  words,
  progress,
  stats,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  stats: {
    learned: number;
    todayCount: number;
    accuracy: number;
    streak: number;
    hardWords: Word[];
  };
}) {
  return (
    <>
      <PageHeader title="Statistika" subtitle="Progress, to'g'ri javob foizi va eng qiyin so'zlar." />
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Bugun ishlangan" value={stats.todayCount} />
        <StatTile label="Bugungi aniqlik" value={`${stats.accuracy}%`} />
        <StatTile label="O'rganilgan" value={stats.learned} />
        <StatTile label="Streak" value={`${stats.streak} kun`} />
      </section>
      <section className="mt-4 grid gap-3 lg:grid-cols-3">
        {CATEGORIES.map((category) => (
          <Card key={category.id}>
            <p className="text-sm font-bold text-brand-600">{category.title}</p>
            <p className="mt-2 text-3xl font-black">{getCategoryProgress(words, progress, category.id)}%</p>
          </Card>
        ))}
      </section>
      <section className="mt-4">
        <h2 className="mb-3 text-lg font-black">Eng qiyin so'zlar</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {stats.hardWords.map((word) => (
            <WordCard key={word.id} word={word} meta={`Xato soni: ${progress[word.id]?.wrong_count ?? 0}`} />
          ))}
        </div>
      </section>
    </>
  );
}
