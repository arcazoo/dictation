import type { PropsWithChildren } from 'react';
import type { View } from '../Layout';
import { BottomNav, type NavItem } from './BottomNav';
import { Icon } from './icons';
import { TopBar } from './TopBar';

export function AppShell({
  children,
  view,
  setView,
  navItems,
  desktopItems,
}: PropsWithChildren<{
  view: View;
  setView: (view: View) => void;
  navItems: NavItem[];
  desktopItems: NavItem[];
}>) {
  const active = [...navItems, ...desktopItems].find((item) => item.id === view);

  return (
    <div className="min-h-screen text-ink-900 dark:text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 p-4 lg:block">
          <div className="flex h-full flex-col rounded-2xl border-2 border-ink-900/[0.07] bg-white p-4 shadow-hard dark:border-white/[0.07] dark:bg-ink-800 dark:shadow-hard-dark">
            <div className="flex items-center gap-3 rounded-2xl border-b-4 border-brand-800 bg-brand-600 p-4 text-white">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-xl font-black">Р</span>
              <div>
                <p className="text-lg font-black leading-tight">Ruscha Tez</p>
                <p className="text-[11px] font-black uppercase tracking-widest opacity-80">Rus tili kursi</p>
              </div>
            </div>
            <nav className="mt-4 space-y-1.5 overflow-y-auto">
              {desktopItems.map((item) => {
                const isActive = view === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setView(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-black transition ${
                      isActive
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-500 hover:bg-ink-50 hover:text-ink-900 dark:text-slate-400 dark:hover:bg-ink-700 dark:hover:text-white'
                    }`}
                  >
                    <Icon name={item.icon} size={20} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="mt-auto rounded-2xl border-2 border-ink-900/[0.07] bg-ink-50 p-4 dark:border-white/[0.07] dark:bg-ink-900">
              <p className="flex items-center gap-2 text-sm font-black">
                <Icon name="sparkles" size={16} className="text-brand-500" />
                AI speaking
              </p>
              <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">Har kuni 3 daqiqa ovozli mashq qiling.</p>
            </div>
          </div>
        </aside>

        <main className="w-full px-3 pb-28 pt-0 sm:px-6 lg:px-8 lg:pb-10 lg:pt-5">
          <TopBar title={active?.label ?? 'Bugun'} view={view} setView={setView} />
          {children}
        </main>
      </div>
      <BottomNav items={navItems} view={view} setView={setView} />
    </div>
  );
}
