function Badge({ label, value, tone }: { label: string; value: string | number; tone: string }) {
  return (
    <div className={`rounded-2xl px-3 py-2 text-center shadow-soft ${tone}`}>
      <p className="text-[10px] font-bold opacity-70">{label}</p>
      <p className="text-sm font-black">{value}</p>
    </div>
  );
}

export function XPBadge({ value }: { value: string | number }) {
  return <Badge label="XP" value={value} tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-100" />;
}

export function StreakBadge({ value }: { value: string | number }) {
  return <Badge label="Streak" value={value} tone="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-100" />;
}

export function HeartBadge({ value }: { value: string | number }) {
  return <Badge label="Hearts" value={value} tone="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-100" />;
}

export function LevelBadge({ value }: { value: string | number }) {
  return <Badge label="Level" value={value} tone="bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-100" />;
}
