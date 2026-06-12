const tones = {
  brand: 'text-brand-600 dark:text-brand-400',
  amber: 'text-warn-600 dark:text-warn-500',
  rose: 'text-danger-600 dark:text-danger-500',
  violet: 'text-violet-600 dark:text-violet-400',
  sky: 'text-sky-600 dark:text-sky-400',
};

export function StatCard({
  label,
  value,
  hint,
  tone = 'brand',
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: keyof typeof tones;
}) {
  return (
    <div className="rounded-2xl border-2 border-ink-900/[0.07] bg-white p-4 shadow-hard dark:border-white/[0.07] dark:bg-ink-800 dark:shadow-hard-dark">
      <p className={`text-[11px] font-black uppercase tracking-widest ${tones[tone]}`}>{label}</p>
      <p className="mt-2 text-2xl font-black text-ink-900 dark:text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </div>
  );
}
