export function IeltsScoreCard({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
      {note ? <p className="mt-1 text-[11px] text-slate-500">{note}</p> : null}
    </div>
  );
}
