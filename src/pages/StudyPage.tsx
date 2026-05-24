import { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { getTodayLesson } from '../lib/lesson';
import type { ReviewResult, Settings, UserProgress, Word } from '../types';

export function StudyPage({
  words,
  progress,
  settings,
  mistakesOnly,
  reviewWord,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  settings: Settings;
  mistakesOnly: boolean;
  reviewWord: (word: Word, result: ReviewResult, mode: 'flashcard') => Promise<void>;
}) {
  const lesson = useMemo(() => {
    if (mistakesOnly) {
      return words
        .filter((word) => (progress[word.id]?.wrong_count ?? 0) > 0)
        .sort((a, b) => (progress[b.id]?.wrong_count ?? 0) - (progress[a.id]?.wrong_count ?? 0));
    }
    return getTodayLesson(words, progress, settings);
  }, [mistakesOnly, progress, settings, words]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const word = lesson[index];

  const speak = () => {
    if (!word || !settings.sound.pronunciation || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(word.russian);
    utterance.lang = 'ru-RU';
    utterance.rate = settings.sound.speed === 'slow' ? 0.75 : settings.sound.speed === 'fast' ? 1.15 : 0.95;
    window.speechSynthesis.speak(utterance);
  };

  async function answer(result: ReviewResult) {
    if (!word) return;
    await reviewWord(word, result, 'flashcard');
    setRevealed(false);
    setIndex((value) => Math.min(value + 1, lesson.length));
  }

  if (!word) {
    return (
      <>
        <PageHeader title="Flashcard" subtitle="Bugungi dars yakunlandi." />
        <Card>
          <p className="text-lg font-bold">Hozircha yangi kartochka yo'q.</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Keyingi takrorlash vaqti kelganda so'zlar yana chiqadi.</p>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={mistakesOnly ? 'Xato so‘zlarni takrorlash' : 'Flashcard'}
        subtitle={`${index + 1}/${lesson.length} - Active recall: avval o'zingiz eslang, keyin tarjimani oching.`}
      />
      <Card className="mx-auto max-w-2xl">
        <div className="min-h-72 rounded-lg bg-slate-50 p-5 text-center dark:bg-slate-800">
          <p className="text-sm font-bold text-brand-600">{word.category_ru} · {word.page}-varaq</p>
          <h2 className="mt-10 text-4xl font-black">{word.russian}</h2>
          {revealed ? <p className="mt-8 text-2xl font-bold text-slate-700 dark:text-slate-100">{word.uzbek}</p> : null}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button variant="secondary" onClick={() => setRevealed((value) => !value)}>
            {revealed ? 'Yopish' : "Tarjimasini ko'rish"}
          </Button>
          <Button variant="ghost" onClick={speak}>Talaffuz</Button>
        </div>
        {revealed ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Button onClick={() => answer('known')}>Bilaman</Button>
            <Button variant="secondary" onClick={() => answer('hard')}>Qiyin</Button>
            <Button variant="danger" onClick={() => answer('unknown')}>Bilmayman</Button>
          </div>
        ) : null}
      </Card>
    </>
  );
}
