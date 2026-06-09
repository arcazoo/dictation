import type { CoachTone } from '../../types';

const tones: Array<{ id: CoachTone; label: string }> = [
  { id: 'kind', label: 'Yumshoq' },
  { id: 'normal', label: 'Oddiy' },
  { id: 'strict', label: 'Qattiq' },
  { id: 'funnyStrict', label: 'Hazilkash qattiq' },
];

export function CoachToneSelector({ value, onChange }: { value: CoachTone; onChange: (value: CoachTone) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {tones.map((tone) => (
        <button
          key={tone.id}
          type="button"
          onClick={() => onChange(tone.id)}
          className={`min-h-11 rounded-lg px-3 text-xs font-black transition ${
            value === tone.id
              ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
          }`}
        >
          {tone.label}
        </button>
      ))}
    </div>
  );
}
