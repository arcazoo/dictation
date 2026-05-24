import type { PropsWithChildren } from 'react';

export type View = 'today' | 'sections' | 'study' | 'test' | 'errors' | 'stats' | 'settings';

const navItems: Array<{ id: View; label: string; short: string }> = [
  { id: 'today', label: 'Bugun', short: 'Bugun' },
  { id: 'sections', label: "Bo'limlar", short: "Bo'lim" },
  { id: 'test', label: 'Test', short: 'Test' },
  { id: 'errors', label: 'Xatolar', short: 'Xato' },
  { id: 'settings', label: 'Settings', short: 'Sozla' },
];

export function Layout({
  children,
  view,
  setView,
}: PropsWithChildren<{ view: View; setView: (view: View) => void }>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 dark:border-slate-800 dark:bg-slate-900 lg:block">
          <div className="mb-8">
            <p className="text-2xl font-black text-brand-600">Ruscha Tez</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Active recall lug'at app</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                  view === item.id
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setView('stats')}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                view === 'stats'
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Statistika
            </button>
          </nav>
        </aside>

        <main className="w-full px-4 pb-28 pt-4 sm:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-2 pt-2 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`rounded-lg px-2 py-2 text-center text-xs font-bold ${
                view === item.id ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <span className="block text-lg leading-none">{item.short.slice(0, 1)}</span>
              <span className="mt-1 block">{item.short}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
