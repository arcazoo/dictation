import type { SpeechRecognitionState } from '../../lib/speechRecognition';

export function MicrophoneButton({
  state,
  onStart,
  onStop,
}: {
  state: SpeechRecognitionState;
  onStart: () => void;
  onStop: () => void;
}) {
  const active = state === 'listening' || state === 'processing';
  const label =
    state === 'unsupported'
      ? 'Mic yoq'
      : state === 'listening'
        ? 'Tugatish'
        : state === 'processing'
          ? 'Tekshirilmoqda'
          : 'Ovoz bilan javob';

  return (
    <button
      type="button"
      onClick={active ? onStop : onStart}
      disabled={state === 'unsupported' || state === 'processing'}
      className={`min-h-14 rounded-full px-5 text-sm font-black text-white shadow-soft transition active:scale-[0.98] disabled:opacity-60 ${
        active ? 'bg-red-500' : 'bg-brand-600 hover:bg-brand-700'
      }`}
    >
      {label}
    </button>
  );
}
