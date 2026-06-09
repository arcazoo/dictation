export function ProgressBar({
  value,
  className = '',
  tone = 'brand',
}: {
  value: number;
  className?: string;
  tone?: 'brand' | 'amber' | 'rose' | 'violet' | 'sky';
}) {
  const colors = {
    brand: 'from-brand-500 to-sky-500',
    amber: 'from-amber-400 to-orange-500',
    rose: 'from-rose-400 to-red-500',
    violet: 'from-violet-500 to-purple-500',
    sky: 'from-sky-400 to-blue-500',
  };

  return (
    <div className={`h-3 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800 ${className}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r ${colors[tone]} transition-all duration-500`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
