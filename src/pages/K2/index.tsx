import React, { useState, useEffect } from 'react';
import { K2TopicId, K2StorageState, K2ExamAttempt } from '../../types/k2';
import {
  loadK2StorageState,
  saveK2StorageState,
  toggleK2LessonRead,
  recordK2Answer,
  addK2ExamAttempt,
} from '../../utils/k2Storage';
import { K2Dashboard } from './K2Dashboard';
import { K2Theory } from './K2Theory';
import { K2Practice } from './K2Practice';
import { K2Exam } from './K2Exam';
import { K2Mistakes } from './K2Mistakes';
import { QuickReviewModal } from '../../components/k2/QuickReviewModal';
import { ContentManagerModal } from '../../components/k2/ContentManagerModal';
import {
  GraduationCap,
  BookOpen,
  Award,
  AlertTriangle,
  Zap,
  Database,
  LayoutDashboard,
} from 'lucide-react';

interface K2ModuleProps {
  soundEnabled?: boolean;
}

export type K2SubTab = 'dashboard' | 'theory' | 'practice' | 'exam' | 'mistakes';

export const K2Module: React.FC<K2ModuleProps> = ({ soundEnabled = true }) => {
  const [storageState, setStorageState] = useState<K2StorageState>(loadK2StorageState);
  const [activeSubTab, setActiveSubTab] = useState<K2SubTab>('dashboard');
  const [selectedTopicId, setSelectedTopicId] = useState<K2TopicId>('topic1_structure');

  // Modals
  const [isQuickReviewOpen, setIsQuickReviewOpen] = useState(false);
  const [isContentManagerOpen, setIsContentManagerOpen] = useState(false);

  // Sync state changes with localStorage
  const handleToggleLessonRead = (topicId: K2TopicId) => {
    const updated = toggleK2LessonRead(storageState, topicId);
    setStorageState(updated);
  };

  const handleRecordAnswer = (
    questionId: string,
    topicId: K2TopicId,
    userAnswer: any,
    isCorrect: boolean
  ) => {
    const updated = recordK2Answer(storageState, questionId, topicId, userAnswer, isCorrect);
    setStorageState(updated);
  };

  const handleSaveExamAttempt = (attempt: K2ExamAttempt) => {
    const updated = addK2ExamAttempt(storageState, attempt);
    setStorageState(updated);
  };

  const handleAddMistakeFromExam = (questionId: string, topicId: K2TopicId, wrongAns: any) => {
    const updated = recordK2Answer(storageState, questionId, topicId, wrongAns, false);
    setStorageState(updated);
  };

  const unresolvedMistakesCount = Object.values(storageState.mistakes).filter(
    m => !m.resolved
  ).length;

  const subTabs: { id: K2SubTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Обзор', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'theory', label: 'Теория (12 тем)', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'practice', label: 'Практика (180 задач)', icon: <Award className="w-4 h-4" /> },
    { id: 'exam', label: 'Пробный зачёт', icon: <GraduationCap className="w-4 h-4 text-indigo-500" /> },
    {
      id: 'mistakes',
      label: 'Ошибки',
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      badge: unresolvedMistakesCount > 0 ? unresolvedMistakesCount : undefined,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Sub-Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {subTabs.map(tab => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Action Modals Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsQuickReviewOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Шпаргалка (10 мин)</span>
          </button>

          <button
            onClick={() => setIsContentManagerOpen(true)}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            title="Управление данными (JSON экспорт/импорт)"
          >
            <Database className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main SubTab Content */}
      <main>
        {activeSubTab === 'dashboard' && (
          <K2Dashboard
            storageState={storageState}
            onNavigateTab={setActiveSubTab}
            onSelectTopicForTheory={topicId => {
              setSelectedTopicId(topicId as K2TopicId);
              setActiveSubTab('theory');
            }}
            onSelectTopicForPractice={topicId => {
              setSelectedTopicId(topicId as K2TopicId);
              setActiveSubTab('practice');
            }}
            onOpenQuickReview={() => setIsQuickReviewOpen(true)}
            onOpenContentManager={() => setIsContentManagerOpen(true)}
          />
        )}

        {activeSubTab === 'theory' && (
          <K2Theory
            storageState={storageState}
            activeTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            onToggleLessonRead={handleToggleLessonRead}
            onNavigatePractice={topicId => {
              setSelectedTopicId(topicId);
              setActiveSubTab('practice');
            }}
          />
        )}

        {activeSubTab === 'practice' && (
          <K2Practice
            storageState={storageState}
            activeTopicId={selectedTopicId}
            onRecordAnswer={handleRecordAnswer}
            soundEnabled={soundEnabled}
          />
        )}

        {activeSubTab === 'exam' && (
          <K2Exam
            storageState={storageState}
            onSaveAttempt={handleSaveExamAttempt}
            onAddMistakeFromExam={handleAddMistakeFromExam}
            soundEnabled={soundEnabled}
          />
        )}

        {activeSubTab === 'mistakes' && (
          <K2Mistakes
            storageState={storageState}
            onRecordAnswer={handleRecordAnswer}
            soundEnabled={soundEnabled}
          />
        )}
      </main>

      {/* Modals */}
      <QuickReviewModal
        isOpen={isQuickReviewOpen}
        onClose={() => setIsQuickReviewOpen(false)}
      />

      <ContentManagerModal
        isOpen={isContentManagerOpen}
        onClose={() => setIsContentManagerOpen(false)}
        currentState={storageState}
        onStateUpdate={setStorageState}
      />
    </div>
  );
};

export default K2Module;
