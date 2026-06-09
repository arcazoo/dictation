export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

export function getBestVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  return (
    voices.find((voice) => voice.lang === lang) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase())) ??
    null
  );
}

export function stopSpeaking(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function speakText(
  text: string,
  options: {
    lang?: 'ru-RU' | 'uz-UZ' | 'en-US';
    rate?: number;
    pitch?: number;
    volume?: number;
  } = {},
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text.trim()) {
      resolve();
      return;
    }

    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang ?? 'ru-RU';
    utterance.rate = options.rate ?? 0.95;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;
    const voice = getBestVoice(utterance.lang);
    if (voice) utterance.voice = voice;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}
