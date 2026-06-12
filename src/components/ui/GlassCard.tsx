import type { PropsWithChildren } from 'react';

/** Yangi UI: shisha effekti o'rniga solid panel — 2px chegara va qattiq soya. */
export function GlassCard({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={`rounded-2xl border-2 border-ink-900/[0.07] bg-white p-5 shadow-hard dark:border-white/[0.07] dark:bg-ink-800 dark:shadow-hard-dark ${className}`}
    >
      {children}
    </section>
  );
}
