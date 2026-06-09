export function ConfettiLayer({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
        <span
          key={item}
          className="absolute h-2 w-2 animate-bounce rounded-full bg-white/80"
          style={{ left: `${12 + item * 11}%`, top: `${8 + (item % 3) * 14}%`, animationDelay: `${item * 80}ms` }}
        />
      ))}
    </div>
  );
}
