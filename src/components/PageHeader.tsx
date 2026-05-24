export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-5">
      <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Ruscha Tez</p>
      <h1 className="mt-1 text-2xl font-black sm:text-3xl">{title}</h1>
      {subtitle ? <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{subtitle}</p> : null}
    </header>
  );
}
