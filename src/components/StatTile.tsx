export function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
      <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{label}</p>
      <p className="mt-2 text-xl font-black sm:text-2xl">{value}</p>
    </div>
  );
}
