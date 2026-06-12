import type { PropsWithChildren } from 'react';
import { AppShell } from './ui/AppShell';
import type { NavItem } from './ui/BottomNav';

export type View =
  | 'today'
  | 'path'
  | 'lesson'
  | 'sections'
  | 'grammar'
  | 'grammarTopic'
  | 'study'
  | 'test'
  | 'ai'
  | 'errors'
  | 'stats'
  | 'settings';

const navItems: NavItem[] = [
  { id: 'today', label: 'Bugun', short: 'Bugun', icon: 'home' },
  { id: 'path', label: "Yo'l", short: "Yo'l", icon: 'map' },
  { id: 'grammar', label: 'Grammatika', short: 'Gram', icon: 'book' },
  { id: 'ai', label: 'AI Coach', short: 'AI', icon: 'sparkles' },
  { id: 'settings', label: 'Profil', short: 'Profil', icon: 'user' },
];

const desktopItems: NavItem[] = [
  ...navItems,
  { id: 'sections', label: 'Mashq markazi', short: 'Mashq', icon: 'layers' },
  { id: 'study', label: 'Flashcard', short: 'Cards', icon: 'cards' },
  { id: 'test', label: 'Test', short: 'Test', icon: 'clipboard' },
  { id: 'errors', label: 'Xatolar ustaxonasi', short: 'Xato', icon: 'wrench' },
  { id: 'stats', label: 'Statistika', short: 'Stats', icon: 'chart' },
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
