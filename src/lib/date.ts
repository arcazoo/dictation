export function nowIso() {
  return new Date().toISOString();
}

export function addMinutes(minutes: number) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

export function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function isDue(iso?: string) {
  if (!iso) return true;
  return new Date(iso).getTime() <= Date.now();
}

export function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function formatShortDate(iso?: string) {
  if (!iso) return 'Hali yo‘q';
  return new Intl.DateTimeFormat('uz-UZ', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}
