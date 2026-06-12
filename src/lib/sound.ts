/** Duolingo-uslubidagi qisqa feedback ovozlari — WebAudio, fayl kerak emas. */

let context: AudioContext | null = null;

function getContext() {
  if (typeof window === 'undefined') return null;
  if (!context) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

function tone(frequency: number, startAt: number, duration: number, type: OscillatorType = 'sine', volume = 0.18) {
  const ctx = getContext();
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(ctx.currentTime + startAt);
  oscillator.stop(ctx.currentTime + startAt + duration + 0.05);
}

export function playCorrect() {
  tone(660, 0, 0.12);
  tone(880, 0.1, 0.18);
}

export function playWrong() {
  tone(220, 0, 0.2, 'square', 0.1);
  tone(180, 0.15, 0.25, 'square', 0.1);
}

export function playCombo() {
  tone(660, 0, 0.1);
  tone(880, 0.08, 0.1);
  tone(1100, 0.16, 0.2);
}

export function playFinish() {
  tone(523, 0, 0.15);
  tone(659, 0.12, 0.15);
  tone(784, 0.24, 0.15);
  tone(1046, 0.36, 0.35);
}
