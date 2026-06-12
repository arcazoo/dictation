/** Yangi UI uchun yagona SVG ikon to'plami (stroke-based, 24x24). */

const PATHS = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
  map: 'M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Zm0 0v14m6-12v14',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Zm2 14h13M8 7h7M8 10.5h5',
  sparkles: 'M12 3l1.8 4.8L18.5 9.5l-4.7 1.7L12 16l-1.8-4.8L5.5 9.5l4.7-1.7L12 3Zm7 10 .9 2.3 2.1.9-2.1.9L19 19.5l-.9-2.4-2.1-.9 2.1-.9.9-2.3ZM5 15l.7 1.8 1.8.7-1.8.7L5 20l-.7-1.8-1.8-.7 1.8-.7L5 15Z',
  user: 'M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm-8 9c0-3.6 3.6-6 8-6s8 2.4 8 6',
  layers: 'M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5M3 16.5l9 5 9-5',
  cards: 'M4 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm4-4h12a2 2 0 0 1 2 2v12',
  clipboard: 'M9 4h6m-7.5 0H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.5M9 2.5h6v3H9v-3ZM8.5 13l2.5 2.5 4.5-5',
  wrench: 'M14.5 6.5a4 4 0 0 1 5-3.9L16 6l2 2 3.4-3.5a4 4 0 0 1-5.4 4.9L7 18.5A2.1 2.1 0 0 1 4 15.4l9.1-9',
  chart: 'M4 20V10m5.5 10V4m5.5 16v-7m5 7V8',
  flame: 'M12 3s1 2.5 1 4.5c0 1.5-1 2.5-1 2.5s3-1 4.5 1.5c1.7 2.7.5 9.5-4.5 9.5S6.3 14.2 8 11.5c1-1.7 1.5-2 1.5-2S8 7 12 3Z',
  heart: 'M12 20.5s-7.5-4.7-9-9C2 8.6 3.6 5.5 7 5.5c2.2 0 3.7 1.3 5 3 1.3-1.7 2.8-3 5-3 3.4 0 5 3.1 4 6-1.5 4.3-9 9-9 9Z',
  zap: 'M13 2 4.5 13.5H11L9.5 22 19 10.5h-6.5L13 2Z',
  trophy: 'M7 4h10v2h4s.5 5-4.5 6c-1 2-2.5 3-4.5 3s-3.5-1-4.5-3C2.5 11 3 6 3 6h4V4Zm5 11v3m-4 3h8m-8 0c0-1.7 1.8-3 4-3s4 1.3 4 3',
  check: 'm5 13 4 4L19 7',
  x: 'M6 6l12 12M18 6 6 18',
  play: 'M7 5v14l12-7L7 5Z',
  arrowLeft: 'M19 12H5m6-7-7 7 7 7',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 0-.2-1.7l2-1.6-2-3.4-2.4 1a8 8 0 0 0-2.9-1.7L14 2h-4l-.5 2.6a8 8 0 0 0-2.9 1.7l-2.4-1-2 3.4 2 1.6A8 8 0 0 0 4 12c0 .6.1 1.1.2 1.7l-2 1.6 2 3.4 2.4-1a8 8 0 0 0 2.9 1.7L10 22h4l.5-2.6a8 8 0 0 0 2.9-1.7l2.4 1 2-3.4-2-1.6c.1-.6.2-1.1.2-1.7Z',
  star: 'm12 3 2.7 5.6 6.3.8-4.6 4.2 1.2 6.1L12 16.8l-5.6 2.9 1.2-6.1L3 9.4l6.3-.8L12 3Z',
  volume: 'M4 9v6h4l5 4V5L8 9H4Zm12.5-1a5.5 5.5 0 0 1 0 8M19 5.5a9 9 0 0 1 0 13',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  size = 22,
  strokeWidth = 2.2,
  className = '',
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
