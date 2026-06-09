import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-brand-500 to-sky-500 text-white shadow-glow hover:brightness-105 active:scale-[0.98]',
  secondary: 'bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 active:scale-[0.98] dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-800 dark:hover:bg-slate-800',
  danger: 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-soft hover:brightness-105 active:scale-[0.98]',
  ghost: 'bg-transparent text-slate-700 hover:bg-white/70 active:scale-[0.98] dark:text-slate-200 dark:hover:bg-slate-800/70',
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }>) {
  return (
    <button
      className={`min-h-12 rounded-2xl px-5 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
