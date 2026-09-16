import React, { useState, useEffect } from 'react';
import { useProgress } from './hooks/useProgress';
import { Header } from './components/layout/Header';
import { Navigation, PageTab } from './components/layout/Navigation';
import { TutorialModal } from './components/layout/TutorialModal';
import { ResetConfirmModal } from './components/layout/ResetConfirmModal';

// Pages
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { Quiz } from './pages/Quiz';
import { Flashcards } from './pages/Flashcards';
import { Shmyaga } from './pages/Shmyaga';
import { Anions } from './pages/Anions';
import { Matching } from './pages/Matching';
import { Mistakes } from './pages/Mistakes';
import { Exam } from './pages/Exam';
import { MoleculeGallery } from './pages/MoleculeGallery';

export const App: React.FC = () => {
  const {
    state,
    recordAnswer,
    setManualMastery,
    toggleSound,
    toggleTheme,
    setTutorialCompleted,
    resetAllProgress,
  } = useProgress();

  const [activeTab, setActiveTab] = useState<PageTab>('home');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Sync with URL hash or pathname for direct navigation (e.g. /molecule-gallery or #gallery)
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (hash === 'gallery' || path.includes('molecule-gallery') || path.includes('gallery')) {
        setActiveTab('gallery');
      } else if (hash === 'learn') {
        setActiveTab('learn');
      } else if (hash === 'quiz') {
        setActiveTab('quiz');
      } else if (hash === 'shmyaga') {
        setActiveTab('shmyaga');
      } else if (hash === 'anions') {
        setActiveTab('anions');
      } else if (hash === 'exam') {
        setActiveTab('exam');
      } else if (hash === 'mistakes') {
        setActiveTab('mistakes');
      } else if (hash === 'flashcards') {
        setActiveTab('flashcards');
      }
    };

    handleLocationChange();
    window.addEventListener('hashchange', handleLocationChange);
    return () => window.removeEventListener('hashchange', handleLocationChange);
  }, []);

  // First time launch: show tutorial if not completed
  useEffect(() => {
    if (!state.settings.tutorialCompleted) {
      setIsTutorialOpen(true);
    }
  }, [state.settings.tutorialCompleted]);

  // Mistakes count
  const mistakesCount = Object.values(state.perAcidProgress).filter(
    p => p.wrongAnswers > 0
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500 selection:text-white transition-colors">
      {/* Sticky Header */}
      <Header
        statistics={state.statistics}
        settings={state.settings}
        onToggleSound={toggleSound}
        onToggleTheme={toggleTheme}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenResetConfirm={() => setIsResetConfirmOpen(true)}
        onNavigateHome={() => setActiveTab('home')}
      />

      {/* Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mistakesCount={mistakesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-16">
        {activeTab === 'home' && (
          <Home
            state={state}
            onSelectTab={setActiveTab}
            mistakesCount={mistakesCount}
          />
        )}

        {activeTab === 'learn' && (
          <Learn
            perAcidProgress={state.perAcidProgress}
            onSetManualMastery={setManualMastery}
            soundEnabled={state.settings.soundEnabled}
          />
        )}

        {activeTab === 'quiz' && (
          <Quiz
            perAcidProgress={state.perAcidProgress}
            onRecordAnswer={recordAnswer}
            soundEnabled={state.settings.soundEnabled}
            onNavigateMistakes={() => setActiveTab('mistakes')}
          />
        )}

        {activeTab === 'flashcards' && (
          <Flashcards
            perAcidProgress={state.perAcidProgress}
            onSetManualMastery={setManualMastery}
            soundEnabled={state.settings.soundEnabled}
          />
        )}

        {activeTab === 'shmyaga' && (
          <Shmyaga
            onRecordAnswer={recordAnswer}
            soundEnabled={state.settings.soundEnabled}
          />
        )}

        {activeTab === 'anions' && (
          <Anions
            onRecordAnswer={recordAnswer}
            soundEnabled={state.settings.soundEnabled}
          />
        )}

        {activeTab === 'matching' && (
          <Matching soundEnabled={state.settings.soundEnabled} />
        )}

        {activeTab === 'mistakes' && (
          <Mistakes
            perAcidProgress={state.perAcidProgress}
            onRecordAnswer={recordAnswer}
            soundEnabled={state.settings.soundEnabled}
          />
        )}

        {activeTab === 'exam' && (
          <Exam
            onRecordAnswer={recordAnswer}
            soundEnabled={state.settings.soundEnabled}
          />
        )}

        {activeTab === 'gallery' && <MoleculeGallery />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-400 bg-white/50 dark:bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Карбоновые кислоты — Обучающий тренажёр (100% Offline)</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('gallery')}
              className="hover:text-emerald-500 transition-colors"
            >
              Галерея молекул
            </button>
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="hover:text-emerald-500 transition-colors"
            >
              Обучение
            </button>
          </div>
        </div>
      </footer>

      {/* Onboarding Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onComplete={() => {
          setTutorialCompleted(true);
          setIsTutorialOpen(false);
        }}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetAllProgress}
      />
    </div>
  );
};

export default App;
