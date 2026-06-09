import type { PropsWithChildren } from 'react';

export function GlassCard({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <section className={`rounded-3xl border border-white/70 bg-white/72 p-5 shadow-soft backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/72 ${className}`}>
      {children}
    </section>
  );
}
