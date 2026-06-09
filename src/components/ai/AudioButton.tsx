import { useState } from 'react';
import { speakText, stopSpeaking } from '../../lib/speech';

export function AudioButton({
  text,
  lang = 'ru-RU',
  autoLabel = 'Ovoz',
}: {
  text: string;
  lang?: 'ru-RU' | 'uz-UZ' | 'en-US';
  autoLabel?: string;
}) {
  const [playing, setPlaying] = useState(false);

  async function toggle() {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    await speakText(text, { lang });
    setPlaying(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!text.trim()}
      className="min-h-10 rounded-full border border-brand-200 px-3 text-xs font-black text-brand-700 transition hover:bg-brand-50 disabled:opacity-50 dark:border-brand-800 dark:text-brand-200 dark:hover:bg-brand-950"
    >
      {playing ? 'Stop' : autoLabel}
    </button>
  );
}
