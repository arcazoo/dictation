import type { SpeakingFeedback } from '../../types';
import { AudioButton } from './AudioButton';
import { IeltsScoreCard } from './IeltsScoreCard';

export function SpeakingFeedbackCard({ feedback }: { feedback: SpeakingFeedback }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-soft dark:border-brand-900 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-brand-600">Speaking feedback</p>
          <h3 className="mt-1 text-3xl font-black">{feedback.score}/100</h3>
        </div>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-black text-purple-700 dark:bg-purple-950 dark:text-purple-200">
          IELTS {feedback.ieltsBand}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <IeltsScoreCard label="Fluency" value={feedback.fluency} />
        <IeltsScoreCard label="Grammar" value={feedback.grammar} />
        <IeltsScoreCard label="Vocabulary" value={feedback.vocabulary} />
        <IeltsScoreCard label="Pronunciation" value={feedback.pronunciationEstimate} note="taxminiy" />
        <IeltsScoreCard label="Relevance" value={feedback.relevance} />
      </div>

      {feedback.mistakes.length ? (
        <div className="mt-4">
          <p className="text-sm font-black">Xatolar</p>
          <div className="mt-2 space-y-2">
            {feedback.mistakes.map((mistake, index) => (
              <div key={`${mistake.original}-${index}`} className="rounded-xl bg-red-50 p-3 text-sm dark:bg-red-950/30">
                <p className="font-bold text-red-700 dark:text-red-200">{mistake.original}</p>
                <p className="mt-1 font-bold text-emerald-700 dark:text-emerald-200">{mistake.corrected}</p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{mistake.explanation_uz}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 rounded-xl bg-brand-50 p-3 dark:bg-brand-950/40">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black">Yaxshiroq javob</p>
          <AudioButton text={feedback.betterAnswer_ru} />
        </div>
        <p className="mt-2 font-bold">{feedback.betterAnswer_ru}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{feedback.betterAnswer_uz}</p>
      </div>

      <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        {feedback.motivation_uz}
      </p>

      {feedback.nextQuestion_ru ? (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black">Keyingi savol</p>
            <AudioButton text={feedback.nextQuestion_ru} />
          </div>
          <p className="mt-2 text-lg font-black">{feedback.nextQuestion_ru}</p>
        </div>
      ) : null}
    </div>
  );
}
