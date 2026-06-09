import type { PropsWithChildren } from 'react';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <section className={`rounded-3xl border border-white/70 bg-white/90 p-5 shadow-soft backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/86 ${className}`}>
      {children}
    </section>
  );
}
