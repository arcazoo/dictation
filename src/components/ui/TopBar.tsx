import type { View } from '../Layout';

export function TopBar({ title, view, setView }: { title: string; view: View; setView: (view: View) => void }) {
  return (
    <header className="sticky top-0 z-20 -mx-3 mb-4 border-b border-white/60 bg-white/75 px-3 py-3 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/75 sm:-mx-6 sm:px-6 lg:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
        <div>
          <p className="text-lg font-black text-slate-950 dark:text-white">Ruscha Tez</p>
          <p className="text-xs font-bold text-slate-500">{title}</p>
        </div>
        <button
          type="button"
          onClick={() => setView(view === 'stats' ? 'today' : 'stats')}
          className="rounded-2xl bg-slate-950 px-4 py-2 text-xs font-black text-white dark:bg-white dark:text-slate-950"
        >
          Stats
        </button>
      </div>
    </header>
  );
}
