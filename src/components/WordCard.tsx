import type { Word } from '../types';

export function WordCard({ word, meta }: { word: Word; meta?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xl font-black">{word.russian}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{word.uzbek}</p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 dark:bg-brand-600/15 dark:text-brand-100">
          {word.category_ru}
        </span>
      </div>
      {meta ? <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{meta}</p> : null}
    </div>
  );
}
