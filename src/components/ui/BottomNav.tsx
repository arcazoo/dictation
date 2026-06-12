import type { View } from '../Layout';
import { Icon, type IconName } from './icons';

export interface NavItem {
  id: View;
  label: string;
  short: string;
  icon: IconName;
}

export function BottomNav({ items, view, setView }: { items: NavItem[]; view: View; setView: (view: View) => void }) {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 px-3 pb-2 lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-2xl border-2 border-ink-900/10 bg-white p-1.5 shadow-hard-lg dark:border-white/10 dark:bg-ink-800 dark:shadow-hard-dark">
        {items.map((item) => {
          const active = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 transition active:scale-95 ${
                active
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon name={item.icon} size={21} />
              <span className="text-[10px] font-black">{item.short}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
