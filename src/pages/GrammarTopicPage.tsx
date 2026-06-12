import { useMemo, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientCard } from '../components/ui/GradientCard';
import { PrimaryActionButton, SecondaryActionButton } from '../components/ui/ActionButtons';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Screen } from '../components/ui/Screen';
import { EmptyState } from '../components/ui/EmptyState';
import { TOPIC_BY_ID, nextGrammarTopic } from '../content/grammar';
import { normalizeAnswer } from '../lib/answer';
import { speakText } from '../lib/speech';
import { useAppStore } from '../store/appStore';
import type { GrammarExercise, GrammarProgress } from '../types';
import type { View } from '../components/Layout';

type Phase = 'theory' | 'drill' | 'done';

/** TTS uchun urg'u belgilarini olib tashlaymiz */
function speakRu(text: string) {
  void speakText(text.normalize('NFD').replace(/́/g, '').normalize('NFC'), { lang: 'ru-RU' });
}

function levenshtein(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

function gradeAnswer(input: string, expected: string) {
  const a = normalizeAnswer(input);
  const b = normalizeAnswer(expected);
  if (!a) return false;
  if (a === b) return true;
  // Kichik imlo xatosiga yon bosamiz (faqat uzunroq javoblarda)
  return b.length > 4 && levenshtein(a, b) <= 1;
}

function isInputExercise(type: GrammarExercise['type']) {
  return type === 'fillBlank' || type === 'transform' || type === 'translate' || type === 'conjugationDrill' || type === 'errorHunt';
}

export function GrammarTopicPage({ setView }: { setView: (view: View) => void }) {
  const topicId = useAppStore((state) => state.activeGrammarTopicId);
  const grammarProgress = useAppStore((state) => state.grammarProgress);
  const saveGrammarResult = useAppStore((state) => state.saveGrammarResult);
  const setActiveGrammarTopic = useAppStore((state) => state.setActiveGrammarTopic);

  const topic = topicId ? TOPIC_BY_ID.get(topicId) : undefined;

  const [phase, setPhase] = useState<Phase>('theory');
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [input, setInput] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const [builtTokens, setBuiltTokens] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [earnedXp, setEarnedXp] = useState(0);

  const exercises = useMemo(() => topic?.exercises ?? [], [topic]);
  const exercise = exercises[index];

  if (!topic) {
    return (
      <Screen>
        <EmptyState title="Mavzu topilmadi" text="Grammatika kursidan mavzu tanlang." action="Kursga qaytish" onAction={() => setView('grammar')} />
      </Screen>
    );
  }

  const resetExerciseState = () => {
    setInput('');
    setPicked(null);
    setBuiltTokens([]);
    setFeedback(null);
  };

  const startDrill = () => {
    setPhase('drill');
    setIndex(0);
    setCorrect(0);
    setWrong(0);
    resetExerciseState();
  };

  const check = () => {
    if (!exercise || feedback) return;
    let userAnswer = input;
    if (exercise.choices) userAnswer = picked ?? '';
    if (exercise.type === 'sentenceBuilder' && exercise.tokens) userAnswer = builtTokens.join(' ');
    const ok = gradeAnswer(userAnswer, exercise.answer);
    setFeedback(ok ? 'correct' : 'wrong');
    if (ok) setCorrect((value) => value + 1);
    else setWrong((value) => value + 1);
  };

  const next = async () => {
    if (index + 1 < exercises.length) {
      setIndex((value) => value + 1);
      resetExerciseState();
      return;
    }
    // Drill tugadi — natijani saqlaymiz
    const total = exercises.length;
    const score = total ? Math.round((correct / total) * 100) : 0;
    const previous = grammarProgress[topic.id];
    const completed = score >= 70 || Boolean(previous?.completed);
    const reviewDays = score >= 90 ? 7 : 3;
    const nextReview = new Date(Date.now() + reviewDays * 24 * 60 * 60 * 1000).toISOString();
    const progress: GrammarProgress = {
      topic_id: topic.id,
      exercises_done: (previous?.exercises_done ?? 0) + total,
      correct_count: (previous?.correct_count ?? 0) + correct,
      wrong_count: (previous?.wrong_count ?? 0) + wrong,
      best_score: Math.max(previous?.best_score ?? 0, score),
      completed,
      last_seen: new Date().toISOString(),
      next_review: nextReview,
    };
    const xp = correct * 10 + (score === 100 ? 20 : 0);
    setEarnedXp(xp);
    await saveGrammarResult(progress, xp);
    setPhase('done');
  };

  // ======================= Nazariya =======================
  if (phase === 'theory') {
    return (
      <Screen className="max-w-3xl">
        <GradientCard variant="violet">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest opacity-80">
                {topic.module}-modul · {topic.level}
              </p>
              <h1 className="mt-1 text-2xl font-black">{topic.title}</h1>
              <p className="mt-1 text-sm font-bold opacity-90">{topic.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setView('grammar')}
              className="rounded-2xl bg-white/20 px-4 py-2 text-sm font-black"
            >
              Orqaga
            </button>
          </div>
        </GradientCard>

        {topic.theory.map((section) => (
          <GlassCard key={section.heading}>
            <h2 className="text-lg font-black">{section.heading}</h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600 dark:text-slate-300">{section.body}</p>
            {section.table ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[320px] border-collapse text-sm">
                  <tbody>
                    {section.table.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex === 0 ? 'bg-violet-50 dark:bg-violet-950/40' : 'odd:bg-slate-50/60 dark:odd:bg-slate-900/40'}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`border border-slate-200 px-3 py-2 dark:border-slate-700 ${
                              rowIndex === 0 ? 'font-black text-violet-700 dark:text-violet-200' : 'font-bold'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </GlassCard>
        ))}

        {topic.comparisonWithUzbek ? (
          <div className="rounded-3xl border-l-4 border-brand-500 bg-brand-50 p-5 dark:bg-brand-950/40">
            <p className="text-xs font-black uppercase tracking-widest text-brand-600 dark:text-brand-200">O'zbek tili bilan solishtirish</p>
            <p className="mt-2 text-sm font-bold leading-relaxed text-slate-700 dark:text-slate-200">{topic.comparisonWithUzbek}</p>
          </div>
        ) : null}

        <GlassCard>
          <h2 className="text-lg font-black">Misollar</h2>
          <div className="mt-3 space-y-2">
            {topic.examples.map((example) => (
              <div key={example.ru} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => speakRu(example.ru)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-100 text-sm text-violet-700 transition active:scale-90 dark:bg-violet-900/60 dark:text-violet-200"
                  aria-label="Tinglash"
                >
                  ▶
                </button>
                <div className="min-w-0">
                  <p className="text-base font-black">{example.ru}</p>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{example.uz}</p>
                  {example.note ? <p className="mt-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">💡 {example.note}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {topic.commonMistakes.length ? (
          <GlassCard>
            <h2 className="text-lg font-black">O'zbeklar qiladigan tipik xatolar</h2>
            <div className="mt-3 space-y-2">
              {topic.commonMistakes.map((mistake) => (
                <div key={mistake.wrong} className="rounded-2xl bg-rose-50/70 p-3 dark:bg-rose-950/30">
                  <p className="text-sm font-black">
                    <span className="text-rose-600 line-through dark:text-rose-400">{mistake.wrong}</span>
                    <span className="mx-2 text-slate-400">→</span>
                    <span className="text-success-700 dark:text-success-500">{mistake.right}</span>
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-600 dark:text-slate-300">{mistake.why_uz}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        ) : null}

        {topic.miniDialogue ? (
          <GlassCard>
            <h2 className="text-lg font-black">Mini dialog</h2>
            <div className="mt-3 space-y-2">
              {topic.miniDialogue.map((line, lineIndex) => (
                <button
                  key={lineIndex}
                  type="button"
                  onClick={() => speakRu(line.ru)}
                  className={`block w-full max-w-[85%] rounded-2xl p-3 text-left ${
                    lineIndex % 2 === 0
                      ? 'bg-violet-50 dark:bg-violet-950/40'
                      : 'ml-auto bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{line.speaker}</p>
                  <p className="text-sm font-black">{line.ru}</p>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{line.uz}</p>
                </button>
              ))}
            </div>
          </GlassCard>
        ) : null}

        <PrimaryActionButton className="w-full" onClick={startDrill}>
          Mashqni boshlash ({exercises.length} ta savol)
        </PrimaryActionButton>
      </Screen>
    );
  }

  // ======================= Natija =======================
  if (phase === 'done') {
    const total = exercises.length;
    const score = total ? Math.round((correct / total) * 100) : 0;
    const next_ = nextGrammarTopic(useAppStore.getState().grammarProgress);
    return (
      <Screen className="max-w-xl">
        <GlassCard className="text-center">
          <div className="mx-auto w-fit">
            <ProgressRing value={score} label={`${score}%`} />
          </div>
          <h1 className="mt-4 text-2xl font-black">{score >= 70 ? 'Mavzu tugatildi! 🎉' : 'Yana bir bor urinib ko‘ring'}</h1>
          <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
            {correct} to‘g‘ri · {wrong} xato · +{earnedXp} XP
          </p>
          <div className="mt-6 grid gap-3">
            {score < 70 ? (
              <PrimaryActionButton onClick={startDrill}>Qayta mashq qilish</PrimaryActionButton>
            ) : next_ ? (
              <PrimaryActionButton
                onClick={() => {
                  setActiveGrammarTopic(next_.id);
                  setPhase('theory');
                  setIndex(0);
                  setCorrect(0);
                  setWrong(0);
                  resetExerciseState();
                }}
              >
                Keyingi mavzu: {next_.title}
              </PrimaryActionButton>
            ) : null}
            <SecondaryActionButton onClick={() => setView('grammar')}>Kursga qaytish</SecondaryActionButton>
          </div>
        </GlassCard>
      </Screen>
    );
  }

  // ======================= Drill =======================
  if (!exercise) {
    return (
      <Screen>
        <EmptyState title="Mashqlar topilmadi" text="Bu mavzuda mashqlar yo'q." action="Kursga qaytish" onAction={() => setView('grammar')} />
      </Screen>
    );
  }

  const remainingTokens = exercise.tokens?.filter((token) => {
    const used = builtTokens.filter((built) => built === token).length;
    const available = exercise.tokens!.filter((item) => item === token).length;
    return used < available;
  });

  return (
    <Screen className="max-w-xl">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setView('grammar')} className="text-2xl font-black text-slate-400" aria-label="Chiqish">
          ×
        </button>
        <ProgressBar value={Math.round((index / exercises.length) * 100)} className="flex-1" tone="violet" />
        <span className="text-xs font-black text-slate-400">
          {index + 1}/{exercises.length}
        </span>
      </div>

      <GlassCard className={feedback === 'wrong' ? 'animate-shake' : 'animate-slide-up'} key={exercise.id}>
        <p className="text-[10px] font-black uppercase tracking-widest text-violet-500">{exerciseTypeLabel(exercise.type)}</p>
        <h2 className="mt-2 text-xl font-black leading-snug">{exercise.prompt}</h2>

        {exercise.choices ? (
          <div className="mt-5 grid gap-2">
            {exercise.choices.map((choice) => {
              const isPicked = picked === choice;
              const showResult = feedback !== null;
              const isAnswer = normalizeAnswer(choice) === normalizeAnswer(exercise.answer);
              return (
                <button
                  key={choice}
                  type="button"
                  disabled={showResult}
                  onClick={() => setPicked(choice)}
                  className={`min-h-12 rounded-2xl border-2 border-b-4 px-4 py-3 text-left text-sm font-black transition active:translate-y-[2px] active:border-b-2 disabled:active:translate-y-0 ${
                    showResult && isAnswer
                      ? 'border-success-600 bg-success-100 text-success-700 dark:bg-success-700/20 dark:text-success-500'
                      : showResult && isPicked
                        ? 'border-danger-600 bg-danger-100 text-danger-700 dark:bg-danger-700/20 dark:text-danger-500'
                        : isPicked
                          ? 'border-violet-600 bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200'
                          : 'border-ink-900/12 bg-white text-slate-700 hover:border-violet-500/40 dark:border-white/12 dark:bg-ink-900 dark:text-slate-200'
                  }`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        ) : null}

        {exercise.type === 'sentenceBuilder' && exercise.tokens ? (
          <div className="mt-5">
            <div className="min-h-14 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
              <div className="flex flex-wrap gap-2">
                {builtTokens.map((token, tokenIndex) => (
                  <button
                    key={`${token}-${tokenIndex}`}
                    type="button"
                    disabled={feedback !== null}
                    onClick={() => setBuiltTokens((current) => current.filter((_, i) => i !== tokenIndex))}
                    className="rounded-xl bg-violet-100 px-3 py-2 text-sm font-black text-violet-700 dark:bg-violet-900/60 dark:text-violet-200"
                  >
                    {token}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {remainingTokens?.map((token, tokenIndex) => (
                <button
                  key={`${token}-${tokenIndex}`}
                  type="button"
                  disabled={feedback !== null}
                  onClick={() => setBuiltTokens((current) => [...current, token])}
                  className="rounded-xl bg-white px-3 py-2 text-sm font-black text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700"
                >
                  {token}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {isInputExercise(exercise.type) ? (
          <input
            value={input}
            disabled={feedback !== null}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') check();
            }}
            placeholder="Javobingizni yozing..."
            className="mt-5 w-full rounded-2xl border-2 border-ink-900/12 bg-white px-4 py-3 text-base font-bold outline-none transition focus:border-violet-500 dark:border-white/12 dark:bg-ink-900"
            autoFocus
          />
        ) : null}

        {feedback ? (
          <div
            className={`mt-5 rounded-2xl p-4 ${
              feedback === 'correct' ? 'bg-success-100 dark:bg-success-700/20' : 'bg-danger-100 dark:bg-danger-700/20'
            }`}
          >
            <p className={`text-sm font-black ${feedback === 'correct' ? 'text-success-700 dark:text-success-500' : 'text-danger-700 dark:text-danger-500'}`}>
              {feedback === 'correct' ? "To'g'ri! ✓" : `To'g'ri javob: ${exercise.answer}`}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-600 dark:text-slate-300">{exercise.explanation_uz}</p>
          </div>
        ) : null}
      </GlassCard>

      {feedback === null ? (
        <PrimaryActionButton
          className="w-full"
          onClick={check}
          disabled={exercise.choices ? !picked : exercise.type === 'sentenceBuilder' ? builtTokens.length === 0 : !input.trim()}
        >
          Tekshirish
        </PrimaryActionButton>
      ) : (
        <PrimaryActionButton className="w-full" onClick={() => void next()}>
          {index + 1 < exercises.length ? 'Davom etish' : 'Yakunlash'}
        </PrimaryActionButton>
      )}
    </Screen>
  );
}

function exerciseTypeLabel(type: GrammarExercise['type']) {
  switch (type) {
    case 'choose':
      return 'Tanlang';
    case 'fillBlank':
      return "Bo'sh joyni to'ldiring";
    case 'transform':
      return "Shaklni o'zgartiring";
    case 'translate':
      return 'Tarjima qiling';
    case 'caseDetector':
      return 'Aniqlang';
    case 'conjugationDrill':
      return 'Tuslang';
    case 'sentenceBuilder':
      return 'Gap tuzing';
    case 'errorHunt':
      return 'Xatoni toping';
    default:
      return 'Mashq';
  }
}
