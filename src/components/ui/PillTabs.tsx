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
    <div className="flex gap-1.5 overflow-x-auto rounded-2xl border-2 border-ink-900/[0.07] bg-white p-1.5 shadow-hard dark:border-white/[0.07] dark:bg-ink-800">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`min-h-10 shrink-0 rounded-xl px-4 text-sm font-black transition ${
            value === item.id
              ? 'bg-brand-600 text-white'
              : 'text-slate-500 hover:bg-ink-50 dark:text-slate-400 dark:hover:bg-ink-700'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
