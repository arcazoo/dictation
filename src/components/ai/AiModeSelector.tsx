import type { AiCoachMode } from '../../types';

const modes: Array<{ id: AiCoachMode; label: string }> = [
  { id: 'chat', label: 'Chat' },
  { id: 'speakingPractice', label: 'Speaking' },
  { id: 'listeningPractice', label: 'Listening' },
  { id: 'ieltsSpeaking', label: 'IELTS' },
  { id: 'rolePlay', label: 'Role Play' },
  { id: 'mistakes', label: 'Mistakes' },
  { id: 'strictMotivator', label: 'Strict Coach' },
];

export function AiModeSelector({ value, onChange }: { value: AiCoachMode; onChange: (value: AiCoachMode) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {modes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onChange(mode.id)}
          className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-black transition ${
            value === mode.id
              ? 'bg-brand-600 text-white shadow-soft'
              : 'bg-white text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
