export function VoiceWave({ active }: { active: boolean }) {
  return (
    <div className="flex h-10 items-center justify-center gap-1">
      {[0, 1, 2, 3, 4].map((item) => (
        <span
          key={item}
          className={`w-1.5 rounded-full bg-brand-500 ${active ? 'animate-pulse' : 'opacity-30'}`}
          style={{ height: active ? `${14 + item * 5}px` : '12px', animationDelay: `${item * 90}ms` }}
        />
      ))}
    </div>
  );
}
