import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { WordCard } from '../components/WordCard';
import { formatShortDate } from '../lib/date';
import type { UserProgress, Word } from '../types';

export function ErrorsPage({
  words,
  progress,
  startMistakes,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  startMistakes: () => void;
}) {
  const mistakes = words
    .filter((word) => (progress[word.id]?.wrong_count ?? 0) > 0)
    .sort((a, b) => (progress[b.id]?.wrong_count ?? 0) - (progress[a.id]?.wrong_count ?? 0));

  return (
    <>
      <PageHeader title="Xatolar" subtitle="Noto'g'ri javob berilgan so'zlar avtomatik shu yerda yig'iladi." />
      <div className="mb-4 flex justify-between gap-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">{mistakes.length} ta xato so'z</p>
        <Button onClick={startMistakes} disabled={!mistakes.length}>Faqat xato so'zlarni takrorlash</Button>
      </div>
      <section className="grid gap-3 lg:grid-cols-2">
        {mistakes.map((word) => {
          const item = progress[word.id];
          return (
            <WordCard
              key={word.id}
              word={word}
              meta={`Xato: ${item?.wrong_count ?? 0} · Oxirgi: ${formatShortDate(item?.last_seen)} · Keyingi: ${formatShortDate(item?.next_review)}`}
            />
          );
        })}
      </section>
    </>
  );
}
