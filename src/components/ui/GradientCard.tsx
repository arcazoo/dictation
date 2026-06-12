import type { PropsWithChildren } from 'react';

const variants = {
  emerald: 'from-brand-600 via-brand-500 to-violet-500',
  violet: 'from-violet-600 via-purple-600 to-fuchsia-600',
  amber: 'from-amber-500 via-orange-500 to-rose-500',
  dark: 'from-ink-900 via-ink-800 to-brand-950',
};

export function GradientCard({
  children,
  className = '',
  variant = 'emerald',
}: PropsWithChildren<{ className?: string; variant?: keyof typeof variants }>) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border-2 border-ink-900/10 bg-gradient-to-br ${variants[variant]} p-5 text-white shadow-hard-lg dark:border-white/10 ${className}`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-black/10" />
      <div className="relative">{children}</div>
    </section>
  );
}
