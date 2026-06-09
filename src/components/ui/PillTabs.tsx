export function PillTabs<T extends string>({
  value,
  items,
  onChange,
}: {
  value: T;
  items: Array<{ id: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-3xl bg-white/70 p-2 shadow-soft dark:bg-slate-900/70">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`min-h-11 shrink-0 rounded-2xl px-4 text-sm font-black transition ${
            value === item.id ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
