export function ProgressBar({
  value,
  className = '',
  tone = 'brand',
}: {
  value: number;
  className?: string;
  tone?: 'brand' | 'amber' | 'rose' | 'violet' | 'sky' | 'success';
}) {
  const colors = {
    brand: 'bg-brand-500',
    amber: 'bg-warn-500',
    rose: 'bg-danger-500',
    violet: 'bg-violet-500',
    sky: 'bg-sky-500',
    success: 'bg-success-500',
  };

  return (
    <div className={`h-3.5 overflow-hidden rounded-full border border-ink-900/10 bg-ink-100 dark:border-white/10 dark:bg-ink-900 ${className}`}>
      <div
        className={`relative h-full rounded-full ${colors[tone]} transition-all duration-500`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      >
        <div className="absolute inset-x-2 top-0.5 h-1 rounded-full bg-white/35" />
      </div>
    </div>
  );
}
