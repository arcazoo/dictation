import type { PropsWithChildren } from 'react';
import { AppShell } from './ui/AppShell';
import type { NavItem } from './ui/BottomNav';

export type View = 'today' | 'path' | 'lesson' | 'sections' | 'study' | 'test' | 'ai' | 'errors' | 'stats' | 'settings';

const navItems: NavItem[] = [
  { id: 'today', label: 'Bugun', short: 'Bugun', icon: 'B' },
  { id: 'path', label: "Yo'l", short: "Yo'l", icon: 'Y' },
  { id: 'sections', label: 'Mashq', short: 'Mashq', icon: 'M' },
  { id: 'ai', label: 'AI Coach', short: 'AI', icon: 'AI' },
  { id: 'settings', label: 'Profil', short: 'Profil', icon: 'P' },
];

const desktopItems: NavItem[] = [
  ...navItems,
  { id: 'study', label: 'Flashcard', short: 'Cards', icon: 'F' },
  { id: 'test', label: 'Test', short: 'Test', icon: 'T' },
  { id: 'errors', label: 'Mistake Repair', short: 'Xato', icon: 'X' },
  { id: 'stats', label: 'Analytics', short: 'Stats', icon: 'S' },
];

export function Layout({
  children,
  view,
  setView,
}: PropsWithChildren<{ view: View; setView: (view: View) => void }>) {
  return (
    <AppShell view={view} setView={setView} navItems={navItems} desktopItems={desktopItems}>
      {children}
    </AppShell>
  );
}
