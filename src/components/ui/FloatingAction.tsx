import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export function FloatingAction({ children, className = '', ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`fixed bottom-24 right-4 z-30 min-h-14 rounded-full bg-gradient-to-r from-brand-500 to-sky-500 px-5 text-sm font-black text-white shadow-glow active:scale-[0.98] lg:hidden ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
