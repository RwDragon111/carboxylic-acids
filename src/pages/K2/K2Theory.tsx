import React, { useState } from 'react';
import { K2TopicId, K2StorageState } from '../../types/k2';
import { K2_TOPICS, K2_LESSONS } from '../../data/k2/topics';
import { EsterificationDiagram } from '../../components/k2/EsterificationDiagram';
import { TriglycerideDiagram } from '../../components/k2/TriglycerideDiagram';
import {
  BookOpen,
  CheckCircle2,
  Search,
  Zap,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  HelpCircle,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface K2TheoryProps {
  storageState: K2StorageState;
  activeTopicId: K2TopicId;
  onSelectTopic: (topicId: K2TopicId) => void;
  onToggleLessonRead: (topicId: K2TopicId) => void;
  onNavigatePractice: (topicId: K2TopicId) => void;
}

export const K2Theory: React.FC<K2TheoryProps> = ({
  storageState,
  activeTopicId,
  onSelectTopic,
  onToggleLessonRead,
  onNavigatePractice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<number, number>>({});

  const currentLesson = K2_LESSONS[activeTopicId];
  const isCurrentRead = storageState.topicProgress[activeTopicId]?.lessonRead;

  // Filter topics if search query is active
  const filteredTopics = K2_TOPICS.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const lesson = K2_LESSONS[t.id];
    return (
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      lesson?.sections.some(s => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)) ||
      lesson?.searchKeywords.some(k => k.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade">
      {/* LEFT SIDEBAR: Topic Selector */}
      <div className="w-full lg:w-80 shrink-0 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Поиск по теории и формулам..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
        </div>

        {/* Topic List */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 max-h-[70vh] overflow-y-auto space-y-1">
          {filteredTopics.map(t => {
            const isActive = t.id === activeTopicId;
            const isRead = storageState.topicProgress[t.id]?.lessonRead;

            return (
              <button
                key={t.id}
                onClick={() => onSelectTopic(t.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between text-xs group ${
                  isActive
                    ? 'bg-indigo-500 text-white font-semibold shadow-sm'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="text-base shrink-0">{t.icon}</span>
                  <div className="truncate">
                    <span className="text-[10px] opacity-70 block font-mono">
                      Тема {t.order}
                    </span>
                    <span className="truncate block font-medium">{t.title}</span>
                  </div>
                </div>

                {isRead && (
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-emerald-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT MAIN AREA: Lesson Content */}
      <div className="flex-1 space-y-6">
        {currentLesson ? (
          <div className="space-y-6">
            {/* Lesson Header Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    Урок {K2_TOPICS.find(t => t.id === activeTopicId)?.order} из 12
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                    {currentLesson.title}
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1">{currentLesson.subtitle}</p>
                </div>

                {/* Mark as read button */}
                <button
                  onClick={() => onToggleLessonRead(activeTopicId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isCurrentRead
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-transparent hover:border-zinc-300'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${isCurrentRead ? 'text-emerald-500' : 'text-zinc-400'}`}
                  />
                  <span>{isCurrentRead ? 'Урок освоен' : 'Отметить изученным'}</span>
                </button>
              </div>

              {/* Cheat Sheet 1-min Summary */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-amber-900 dark:text-amber-200 block">
                    Суть за 1 минуту:
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {currentLesson.cheatSheetSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* EMBEDDED INTERACTIVE VISUAL CHEMISTRY MODELS */}
            {(activeTopicId === 'topic9_esters' || activeTopicId === 'topic10_hydrolysis') && (
              <EsterificationDiagram />
            )}

            {(activeTopicId === 'topic11_fatty_acids' || activeTopicId === 'topic12_fats_soap') && (
              <TriglycerideDiagram />
            )}

            {/* Lesson Structured Sections */}
            <div className="space-y-5">
              {currentLesson.sections.map((section, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4"
                >
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <span>{section.title}</span>
                  </h2>

                  <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>

                  {section.structuralScheme && (
                    <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800 rounded-xl font-mono text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 overflow-x-auto">
                      {section.structuralScheme}
                    </div>
                  )}

                  {section.trapWarning && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-200">
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-0.5">Ловушка:</span>
                        <span>{section.trapWarning}</span>
                      </div>
                    </div>
                  )}

                  {section.exampleBox && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                        <Lightbulb className="w-4 h-4" />
                        <span>Пример с решением: {section.exampleBox.title}</span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        {section.exampleBox.description}
                      </p>
                      <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-emerald-500/20 font-mono text-emerald-700 dark:text-emerald-300 font-semibold">
                        {section.exampleBox.solution}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Lesson Checkpoint Quizzes */}
            {currentLesson.checkpoints && currentLesson.checkpoints.length > 0 && (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    Экспресс-проверка понимания урока
                  </h3>
                </div>

                <div className="space-y-4">
                  {currentLesson.checkpoints.map((cp, cIdx) => {
                    const userSelected = checkpointAnswers[cIdx];
                    const isAnswered = userSelected !== undefined;
                    const isCorrect = userSelected === cp.correctIndex;

                    return (
                      <div
                        key={cIdx}
                        className="bg-zinc-50 dark:bg-zinc-950/60 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-3"
                      >
                        <p className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                          {cIdx + 1}. {cp.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {cp.options.map((opt, oIdx) => {
                            const isChosen = userSelected === oIdx;
                            const isTarget = oIdx === cp.correctIndex;

                            let btnStyle =
                              'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-400';

                            if (isAnswered) {
                              if (isTarget) {
                                btnStyle =
                                  'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                              } else if (isChosen && !isTarget) {
                                btnStyle =
                                  'bg-rose-500/10 border-rose-500 text-rose-800 dark:text-rose-200 line-through';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={isAnswered}
                                onClick={() =>
                                  setCheckpointAnswers({ ...checkpointAnswers, [cIdx]: oIdx })
                                }
                                className={`text-left p-2.5 rounded-xl border text-xs transition-all ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {isAnswered && (
                          <div className="text-xs text-zinc-500 pt-1 border-t border-zinc-200 dark:border-zinc-800">
                            {isCorrect ? '✅ Верно!' : '❌ Неверно.'} {cp.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <span className="text-xs text-zinc-500">
                Готовы закрепить материал на реальных экзаменационных заданиях?
              </span>

              <button
                onClick={() => onNavigatePractice(activeTopicId)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                <span>Перейти к задачам темы</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-400">Выберите тему для изучения</div>
        )}
      </div>
    </div>
  );
};
