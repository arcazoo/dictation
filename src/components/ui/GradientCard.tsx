import type { PropsWithChildren } from 'react';

const variants = {
  emerald: 'from-brand-500 via-emerald-500 to-sky-500',
  violet: 'from-violet-500 via-purple-500 to-sky-500',
  amber: 'from-amber-400 via-orange-500 to-rose-500',
  dark: 'from-slate-950 via-slate-900 to-slate-800',
};

export function GradientCard({
  children,
  className = '',
  variant = 'emerald',
}: PropsWithChildren<{ className?: string; variant?: keyof typeof variants }>) {
  return (
    <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${variants[variant]} p-5 text-white shadow-glow ${className}`}>
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      <div className="absolute -bottom-20 left-4 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
      <div className="relative">{children}</div>
    </section>
  );
}
