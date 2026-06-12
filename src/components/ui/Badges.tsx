import { Icon, type IconName } from './icons';

function Badge({ icon, label, value, tone }: { icon: IconName; label: string; value: string | number; tone: string }) {
  return (
    <div className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-2 ${tone}`}>
      <Icon name={icon} size={18} />
      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-widest opacity-70">{label}</p>
        <p className="truncate text-sm font-black leading-tight">{value}</p>
      </div>
    </div>
  );
}

export function XPBadge({ value }: { value: string | number }) {
  return <Badge icon="zap" label="XP" value={value} tone="border-brand-600/20 bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-200" />;
}

export function StreakBadge({ value }: { value: string | number }) {
  return <Badge icon="flame" label="Streak" value={value} tone="border-warn-500/25 bg-warn-100/60 text-warn-800 dark:bg-amber-950/60 dark:text-amber-200" />;
}

export function HeartBadge({ value }: { value: string | number }) {
  return <Badge icon="heart" label="Hearts" value={value} tone="border-danger-500/25 bg-danger-100/60 text-danger-800 dark:bg-rose-950/60 dark:text-rose-200" />;
}

export function LevelBadge({ value }: { value: string | number }) {
  return <Badge icon="star" label="Level" value={value} tone="border-violet-500/25 bg-violet-100/60 text-violet-800 dark:bg-violet-950/60 dark:text-violet-200" />;
}
