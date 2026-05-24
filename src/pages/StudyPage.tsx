import { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { getWordsForSource } from '../lib/source';
import type { ReviewResult, Settings, StudySource, UserProgress, Word } from '../types';

export function StudyPage({
  words,
  progress,
  settings,
  source,
  reviewWord,
}: {
  words: Word[];
  progress: Record<string, UserProgress>;
  settings: Settings;
  source: StudySource;
  reviewWord: (word: Word, result: ReviewResult, mode: 'flashcard') => Promise<void>;
}) {
  const lesson = useMemo(() => getWordsForSource(source, words, progress, settings), [progress, settings, source, words]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const word = lesson[index];
  const percent = lesson.length ? Math.round((index / lesson.length) * 100) : 0;

  useEffect(() => {
    setIndex(0);
    setRevealed(false);
  }, [source]);

  const speak = () => {
    if (!word || !settings.sound.pronunciation || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(word.russian);
    utterance.lang = 'ru-RU';
    utterance.rate = settings.sound.speed === 'slow' ? 0.75 : settings.sound.speed === 'fast' ? 1.15 : 0.95;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (settings.sound.autoPlay) speak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word?.id]);

  async function answer(result: ReviewResult) {
    if (!word) return;
    await reviewWord(word, result, 'flashcard');
    setRevealed(false);
    setIndex((value) => Math.min(value + 1, lesson.length));
  }

  if (!word) {
    return (
      <>
        <PageHeader title={source.title} subtitle="Bu ro'yxat yakunlandi." />
        <Card>
          <p className="text-lg font-bold">Hozircha kartochka yo'q.</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Boshqa list tanlang yoki keyingi takrorlash vaqtini kuting.</p>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={source.title}
        subtitle={`${index + 1}/${lesson.length} - avval eslang, keyin tarjimani oching.`}
      />
      <Card className="mx-auto max-w-2xl">
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-brand-600 transition-all" style={{ width: `${percent}%` }} />
        </div>
        <div className="min-h-[19rem] rounded-lg bg-slate-50 p-5 text-center dark:bg-slate-800">
          <p className="text-sm font-bold text-brand-600">{word.category_ru} · {word.page}-varaq</p>
          <h2 className="mt-10 text-4xl font-black sm:text-5xl">{word.russian}</h2>
          {revealed ? <p className="mt-8 text-2xl font-bold text-slate-700 dark:text-slate-100">{word.uzbek}</p> : null}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button variant="secondary" onClick={() => setRevealed((value) => !value)}>
            {revealed ? 'Yopish' : "Tarjimasini ko'rish"}
          </Button>
          <Button variant="ghost" onClick={speak}>
            Talaffuz
          </Button>
        </div>
        {revealed ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Button onClick={() => answer('known')}>Bilaman</Button>
            <Button variant="secondary" onClick={() => answer('hard')}>
              Qiyin
            </Button>
            <Button variant="danger" onClick={() => answer('unknown')}>
              Bilmayman
            </Button>
          </div>
        ) : null}
        <Button variant="ghost" className="mt-3 w-full" onClick={() => setIndex((value) => Math.min(value + 1, lesson.length))}>
          O'tkazib yuborish
        </Button>
      </Card>
    </>
  );
}
