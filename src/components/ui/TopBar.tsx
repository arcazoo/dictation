import type { View } from '../Layout';
import { Icon } from './icons';

export function TopBar({ title, view, setView }: { title: string; view: View; setView: (view: View) => void }) {
  return (
    <header className="sticky top-0 z-20 -mx-3 mb-4 border-b-2 border-ink-900/[0.07] bg-[#f4f5fb]/90 px-3 py-3 backdrop-blur-md dark:border-white/[0.07] dark:bg-ink-950/90 sm:-mx-6 sm:px-6 lg:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl border-b-4 border-brand-800 bg-brand-600 font-black text-white">
            Р
          </span>
          <div>
            <p className="text-base font-black leading-tight text-ink-900 dark:text-white">Ruscha Tez</p>
            <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">{title}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setView(view === 'stats' ? 'today' : 'stats')}
          aria-label="Statistika"
          className={`grid h-10 w-10 place-items-center rounded-xl border-2 transition active:scale-95 ${
            view === 'stats'
              ? 'border-brand-600 bg-brand-600 text-white'
              : 'border-ink-900/10 bg-white text-slate-500 dark:border-white/10 dark:bg-ink-800 dark:text-slate-400'
          }`}
        >
          <Icon name="chart" size={20} />
        </button>
      </div>
    </header>
  );
}
