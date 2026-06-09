export function LoadingState({ label = 'Yuklanmoqda...' }: { label?: string }) {
  return (
    <div className="grid min-h-64 place-items-center">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-pulse rounded-2xl bg-gradient-to-br from-brand-500 to-sky-500 shadow-glow" />
        <p className="mt-4 text-sm font-black text-slate-500">{label}</p>
      </div>
    </div>
  );
}
