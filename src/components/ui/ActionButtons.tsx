import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export function PrimaryActionButton({ children, className = '', ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`min-h-14 rounded-2xl bg-gradient-to-r from-brand-500 to-sky-500 px-5 py-3 text-sm font-black text-white shadow-glow transition hover:brightness-105 active:scale-[0.98] disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryActionButton({ children, className = '', ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`min-h-12 rounded-2xl bg-white/85 px-4 py-3 text-sm font-black text-slate-800 shadow-soft ring-1 ring-slate-200 transition hover:bg-white active:scale-[0.98] disabled:opacity-50 dark:bg-slate-900/85 dark:text-slate-100 dark:ring-slate-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
