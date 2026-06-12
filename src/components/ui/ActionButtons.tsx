import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

/** Chunky 3D-press tugma: pastki qalin chegara, bosilganda pastga siljiydi. */
export function PrimaryActionButton({ children, className = '', ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`min-h-14 rounded-2xl border-b-4 border-brand-800 bg-brand-600 px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition-all hover:bg-brand-500 active:translate-y-[2px] active:border-b-2 disabled:opacity-50 disabled:active:translate-y-0 disabled:active:border-b-4 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryActionButton({ children, className = '', ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`min-h-12 rounded-2xl border-2 border-b-4 border-ink-900/15 bg-white px-4 py-3 text-sm font-black uppercase tracking-wide text-ink-700 transition-all hover:bg-ink-50 active:translate-y-[2px] active:border-b-2 disabled:opacity-50 disabled:active:translate-y-0 disabled:active:border-b-4 dark:border-white/15 dark:bg-ink-800 dark:text-white dark:hover:bg-ink-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function DangerActionButton({ children, className = '', ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`min-h-12 rounded-2xl border-b-4 border-danger-800 bg-danger-600 px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition-all hover:bg-danger-500 active:translate-y-[2px] active:border-b-2 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
