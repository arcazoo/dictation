import type { PropsWithChildren } from 'react';

export function Screen({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`mx-auto w-full max-w-6xl space-y-5 animate-soft-pop ${className}`}>{children}</div>;
}
