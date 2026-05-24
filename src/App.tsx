import { useEffect, useState } from 'react';
import { Layout, type View } from './components/Layout';
import { useAppData } from './hooks/useAppData';
import { ErrorsPage } from './pages/ErrorsPage';
import { SectionsPage } from './pages/SectionsPage';
import { SettingsPage } from './pages/SettingsPage';
import { StatsPage } from './pages/StatsPage';
import { StudyPage } from './pages/StudyPage';
import { TestPage } from './pages/TestPage';
import { TodayPage } from './pages/TodayPage';

const views: View[] = ['today', 'sections', 'study', 'test', 'errors', 'stats', 'settings'];

function getHashView(): View {
  const hash = window.location.hash.replace('#', '') as View;
  return views.includes(hash) ? hash : 'today';
}

export default function App() {
  const data = useAppData();
  const [view, setViewState] = useState<View>(getHashView());
  const [mistakesOnly, setMistakesOnly] = useState(false);

  useEffect(() => {
    const onHash = () => setViewState(getHashView());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const setView = (next: View) => {
    window.location.hash = next;
    setViewState(next);
    if (next !== 'study') setMistakesOnly(false);
  };

  if (data.loading || !data.settings.appearance) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
        <div className="rounded-lg bg-white p-6 text-center shadow-soft dark:bg-slate-900">
          <p className="text-2xl font-black text-brand-600">Ruscha Tez</p>
          <p className="mt-2 text-sm text-slate-500">Lug'at yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout view={view} setView={setView}>
      {view === 'today' ? (
        <TodayPage
          words={data.words}
          progress={data.progress}
          settings={data.settings}
          learned={data.stats.learned}
          accuracy={data.stats.accuracy}
          setView={setView}
        />
      ) : null}
      {view === 'sections' ? <SectionsPage words={data.words} progress={data.progress} /> : null}
      {view === 'study' ? (
        <StudyPage
          words={data.words}
          progress={data.progress}
          settings={data.settings}
          mistakesOnly={mistakesOnly}
          reviewWord={data.reviewWord}
        />
      ) : null}
      {view === 'test' ? (
        <TestPage words={data.words} progress={data.progress} settings={data.settings} reviewWord={data.reviewWord} />
      ) : null}
      {view === 'errors' ? (
        <ErrorsPage
          words={data.words}
          progress={data.progress}
          startMistakes={() => {
            setMistakesOnly(true);
            setView('study');
          }}
        />
      ) : null}
      {view === 'stats' ? <StatsPage words={data.words} progress={data.progress} stats={data.stats} /> : null}
      {view === 'settings' ? (
        <SettingsPage
          settings={data.settings}
          updateSettings={data.updateSettings}
          exportData={data.exportData}
          importData={data.importData}
          clearProgress={data.clearProgress}
          clearMistakes={data.clearMistakes}
          resetSettings={data.resetSettings}
          reload={data.reload}
        />
      ) : null}
    </Layout>
  );
}
