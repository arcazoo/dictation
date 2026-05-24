export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-4 sm:mb-5">
      <p className="hidden text-sm font-bold uppercase tracking-wide text-brand-600 sm:block">Ruscha Tez</p>
      <h1 className="mt-1 text-2xl font-black leading-tight sm:text-3xl">{title}</h1>
      {subtitle ? <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{subtitle}</p> : null}
    </header>
  );
}
