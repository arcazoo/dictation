export function ProgressRing({
  value,
  label,
  size = 104,
}: {
  value: number;
  label?: string;
  size?: number;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 104 104" aria-hidden="true">
        <circle cx="52" cy="52" r={radius} fill="none" stroke="currentColor" strokeWidth="11" className="text-ink-100 dark:text-ink-900" />
        <circle
          cx="52"
          cy="52"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-brand-500"
          transform="rotate(-90 52 52)"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-black">{Math.round(value)}%</p>
        {label ? <p className="text-[10px] font-black uppercase tracking-wide opacity-70">{label}</p> : null}
      </div>
    </div>
  );
}
