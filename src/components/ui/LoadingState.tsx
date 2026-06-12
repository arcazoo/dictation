export function LoadingState({ label = 'Yuklanmoqda...' }: { label?: string }) {
  return (
    <div className="grid min-h-64 place-items-center">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-bounce-soft rounded-2xl border-b-4 border-brand-800 bg-brand-600" />
        <p className="mt-4 text-sm font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}
