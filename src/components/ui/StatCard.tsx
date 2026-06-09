export function StatCard({ label, value, hint, tone = 'brand' }: { label: string; value: string | number; hint?: string; tone?: 'brand' | 'amber' | 'rose' | 'violet' | 'sky' }) {
  const tones = {
    brand: 'from-brand-50 to-emerald-50 text-brand-700 dark:from-brand-950/60 dark:to-emerald-950/30 dark:text-brand-100',
    amber: 'from-amber-50 to-orange-50 text-amber-700 dark:from-amber-950/60 dark:to-orange-950/30 dark:text-amber-100',
    rose: 'from-rose-50 to-red-50 text-rose-700 dark:from-rose-950/60 dark:to-red-950/30 dark:text-rose-100',
    violet: 'from-violet-50 to-purple-50 text-violet-700 dark:from-violet-950/60 dark:to-purple-950/30 dark:text-violet-100',
    sky: 'from-sky-50 to-blue-50 text-sky-700 dark:from-sky-950/60 dark:to-blue-950/30 dark:text-sky-100',
  };
  return (
    <div className={`rounded-3xl bg-gradient-to-br p-4 shadow-soft ${tones[tone]}`}>
      <p className="text-xs font-bold opacity-75">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
      {hint ? <p className="mt-1 text-xs opacity-70">{hint}</p> : null}
    </div>
  );
}
