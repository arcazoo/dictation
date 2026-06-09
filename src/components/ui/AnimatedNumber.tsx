export function AnimatedNumber({ value }: { value: string | number }) {
  return <span className="inline-block animate-soft-pop tabular-nums">{value}</span>;
}
