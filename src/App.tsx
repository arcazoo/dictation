import { lazy, Suspense, useEffect, useState } from 'react';
import { Layout, type View } from './components/Layout';
import { LoadingState } from './components/ui/LoadingState';
import { useAppData } from './hooks/useAppData';
import { buildLearningPath } from './lib/adaptiveLesson';
import { ErrorsPage } from './pages/ErrorsPage';
import { LearningPathPage } from './pages/LearningPathPage';
import { LessonPlayerPage } from './pages/LessonPlayerPage';
import { SectionsPage } from './pages/SectionsPage';
import { SettingsPage } from './pages/SettingsPage';
import { StatsPage } from './pages/StatsPage';
import { StudyPage } from './pages/StudyPage';
import { TestPage } from './pages/TestPage';
import { TodayPage } from './pages/TodayPage';

// Katta sahifalar alohida chunk bo'lib yuklanadi
const GrammarPage = lazy(() => import('./pages/GrammarPage').then((m) => ({ default: m.GrammarPage })));
const GrammarTopicPage = lazy(() => import('./pages/GrammarTopicPage').then((m) => ({ default: m.GrammarTopicPage })));
const VoiceCoachPage = lazy(() => import('./pages/VoiceCoachPage').then((m) => ({ default: m.VoiceCoachPage })));
import type { LearningLesson, LessonProgress, StudySource } from './types';

const views: View[] = ['today', 'path', 'lesson', 'sections', 'grammar', 'grammarTopic', 'study', 'test', 'ai', 'errors', 'stats', 'settings'];

function getHashView(): View {
  const hash = window.location.hash.replace('#', '') as View;
  return views.includes(hash) ? hash : 'today';
}

export default function App() {
  const data = useAppData();
  const [view, setViewState] = useState<View>(getHashView());
  const [studySource, setStudySource] = useState<StudySource>({ kind: 'today', title: 'Bugungi dars' });
  const [testSource, setTestSource] = useState<StudySource>({ kind: 'today', title: 'Bugungi dars' });
  const [activeLesson, setActiveLesson] = useState<LearningLesson | null>(null);

  useEffect(() => {
    const onHash = () => setViewState(getHashView());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const setView = (next: View) => {
    window.location.hash = next;
    setViewState(next);
  };

  const startStudy = (source: StudySource) => {
    setStudySource(source);
    setView('study');
  };

  const startTest = (source: StudySource) => {
    setTestSource(source);
    setView('test');
  };

  const units = buildLearningPath(data.words, data.progress, data.lessonProgress ?? {});

  const startLesson = (lesson: LearningLesson) => {
    if (lesson.status === 'locked') return;
    setActiveLesson(lesson);
    setView('lesson');
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
          startStudy={startStudy}
          startTest={startTest}
          startLesson={startLesson}
          firstLesson={units[0]?.lessons.find((lesson) => lesson.status === 'available' || lesson.status === 'review_needed') ?? units[0]?.lessons[0]}
          profile={data.userProfile}
          todayActivity={data.dailyActivity[new Date().toISOString().slice(0, 10)]}
        />
      ) : null}
      {view === 'path' ? <LearningPathPage units={units} startLesson={startLesson} /> : null}
      {view === 'lesson' && activeLesson ? (
        <LessonPlayerPage
          lesson={activeLesson}
          words={data.words}
          progress={data.progress}
          settings={data.settings}
          reviewWord={data.reviewWord}
          onFinish={async (summary) => {
            const lessonProgress: LessonProgress = {
              lesson_id: activeLesson.id,
              status: 'completed',
              completed_at: new Date().toISOString(),
              score: summary.score,
              xp_earned: summary.xp,
              mistakes: summary.mistakes,
              attempts: (data.lessonProgress[activeLesson.id]?.attempts ?? 0) + 1,
              progress_percent: 100,
              last_seen: new Date().toISOString(),
            };
            await data.saveLessonResult(lessonProgress, summary.results);
            setView('today');
          }}
        />
      ) : null}
      {view === 'sections' ? (
        <SectionsPage words={data.words} progress={data.progress} startStudy={startStudy} startTest={startTest} />
      ) : null}
      {view === 'grammar' ? (
        <Suspense fallback={<LoadingState />}>
          <GrammarPage setView={setView} />
        </Suspense>
      ) : null}
      {view === 'grammarTopic' ? (
        <Suspense fallback={<LoadingState />}>
          <GrammarTopicPage setView={setView} />
        </Suspense>
      ) : null}
      {view === 'study' ? (
        <StudyPage
          words={data.words}
          progress={data.progress}
          settings={data.settings}
          source={studySource}
          reviewWord={data.reviewWord}
        />
      ) : null}
      {view === 'test' ? (
        <TestPage
          words={data.words}
          progress={data.progress}
          settings={data.settings}
          source={testSource}
          setSource={setTestSource}
          reviewWord={data.reviewWord}
        />
      ) : null}
      {view === 'ai' ? (
        <Suspense fallback={<LoadingState />}>
          <VoiceCoachPage />
        </Suspense>
      ) : null}
      {view === 'errors' ? (
        <ErrorsPage
          words={data.words}
          progress={data.progress}
          startMistakes={() => startStudy({ kind: 'mistakes', title: "Xato so'zlar" })}
        />
      ) : null}
      {view === 'stats' ? (
        <StatsPage
          words={data.words}
          progress={data.progress}
          stats={data.stats}
          profile={data.userProfile}
          dailyActivity={data.dailyActivity}
          achievements={data.achievements}
        />
      ) : null}
      {view === 'settings' ? (
        <SettingsPage
          settings={data.settings}
          updateSettings={data.updateSettings}
          profile={data.userProfile}
          updateProfile={data.updateProfile}
          exportData={data.exportData}
          importData={data.importData}
          clearProgress={data.clearProgress}
          clearMistakes={data.clearMistakes}
          resetSettings={data.resetSettings}
          reload={data.reload}
          syncStatus={data.syncStatus}
          lastSyncedAt={data.lastSyncedAt}
          syncNow={data.syncNow}
        />
      ) : null}
    </Layout>
  );
}
