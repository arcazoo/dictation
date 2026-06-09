import type { View } from '../Layout';

export interface NavItem {
  id: View;
  label: string;
  short: string;
  icon: string;
}

export function BottomNav({ items, view, setView }: { items: NavItem[]; view: View; setView: (view: View) => void }) {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-white/70 bg-white/88 px-2 pt-2 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/88 lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(item.id)}
            className={`rounded-2xl px-2 py-2 text-center text-xs font-black transition active:scale-[0.96] ${
              view === item.id ? 'bg-slate-950 text-white shadow-soft dark:bg-white dark:text-slate-950' : 'text-slate-500 dark:text-slate-400'
            }`}
            aria-label={item.label}
          >
            <span className="block text-base leading-none">{item.icon}</span>
            <span className="mt-1 block">{item.short}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
