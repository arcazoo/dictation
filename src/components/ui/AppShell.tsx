import type { PropsWithChildren } from 'react';
import type { View } from '../Layout';
import { BottomNav, type NavItem } from './BottomNav';
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
    <div className="min-h-screen text-slate-950 dark:text-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-80 shrink-0 p-4 lg:block">
          <div className="flex h-full flex-col rounded-[2rem] border border-white/70 bg-white/78 p-4 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/72">
            <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-sky-500 p-5 text-white shadow-glow">
              <p className="text-2xl font-black">Ruscha Tez</p>
              <p className="mt-1 text-sm font-bold opacity-85">Adaptive learning coach</p>
            </div>
            <nav className="mt-5 space-y-2">
              {desktopItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={`flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 text-left text-sm font-black transition ${
                    view === item.id
                      ? 'bg-slate-950 text-white shadow-soft dark:bg-white dark:text-slate-950'
                      : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-xs dark:bg-slate-800">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-auto rounded-3xl bg-slate-950 p-4 text-white dark:bg-white dark:text-slate-950">
              <p className="text-sm font-black">AI speaking</p>
              <p className="mt-1 text-xs opacity-70">Har kuni 3 daqiqa ovozli mashq qiling.</p>
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
