import React, { useState } from 'react';
import { K2TopicId, K2StorageState, K2Question } from '../../types/k2';
import { K2_TOPICS } from '../../data/k2/topics';
import { K2_QUESTIONS } from '../../data/k2/questions';
import { K2TaskCard } from '../../components/k2/K2TaskCard';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';

interface K2MistakesProps {
  storageState: K2StorageState;
  onRecordAnswer: (
    questionId: string,
    topicId: K2TopicId,
    userAnswer: any,
    isCorrect: boolean
  ) => void;
  soundEnabled: boolean;
}

export const K2Mistakes: React.FC<K2MistakesProps> = ({
  storageState,
  onRecordAnswer,
  soundEnabled,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [filterResolved, setFilterResolved] = useState<'unresolved' | 'all'>('unresolved');
  const [drillIndex, setDrillIndex] = useState<number>(0);
  const [isDrillMode, setIsDrillMode] = useState<boolean>(false);

  const mistakesList = Object.values(storageState.mistakes).filter(m => {
    if (selectedTopic !== 'all' && m.topicId !== selectedTopic) return false;
    if (filterResolved === 'unresolved' && m.resolved) return false;
    return true;
  });

  const mistakeQuestions: K2Question[] = mistakesList
    .map(m => K2_QUESTIONS.find((q: K2Question) => q.id === m.questionId))
    .filter((q): q is K2Question => Boolean(q));

  const currentDrillQuestion = mistakeQuestions[drillIndex];

  return (
    <div className="space-y-6 animate-fade">
      {/* Top Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Банк ошибок К2
            </h1>
          </div>
          <p className="text-xs text-zinc-500">
            Вопросы, где вы ошиблись на зачёте или в практике. Для полного освоения требуется 2 правильных ответа подряд.
          </p>
        </div>

        {mistakeQuestions.length > 0 && !isDrillMode && (
          <button
            onClick={() => {
              setIsDrillMode(true);
              setDrillIndex(0);
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-rose-600/20 transition-all shrink-0"
          >
            <span>Отработать ошибки ({mistakeQuestions.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* If in Drill Mode */}
      {isDrillMode && currentDrillQuestion ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              Отработка ошибки {drillIndex + 1} из {mistakeQuestions.length}
            </span>

            <button
              onClick={() => setIsDrillMode(false)}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              Выйти из режима отработки
            </button>
          </div>

          <K2TaskCard
            key={currentDrillQuestion.id}
            question={currentDrillQuestion}
            showFeedbackImmediately={true}
            soundEnabled={soundEnabled}
            numberInSet={drillIndex + 1}
            totalInSet={mistakeQuestions.length}
            onNext={
              drillIndex < mistakeQuestions.length - 1
                ? () => setDrillIndex(drillIndex + 1)
                : () => setIsDrillMode(false)
            }
            onAnswer={(ans, correct) => {
              onRecordAnswer(
                currentDrillQuestion.id,
                currentDrillQuestion.topicId,
                ans,
                correct
              );
            }}
          />
        </div>
      ) : (
        /* Regular List View */
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
              >
                <option value="all">Все темы</option>
                {K2_TOPICS.map(t => (
                  <option key={t.id} value={t.id}>
                    Тема {t.order}: {t.title}
                  </option>
                ))}
              </select>

              <select
                value={filterResolved}
                onChange={e => setFilterResolved(e.target.value as any)}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
              >
                <option value="unresolved">Только неисправленные</option>
                <option value="all">Все (включая усвоенные)</option>
              </select>
            </div>

            <span className="text-zinc-500 font-mono">
              Найдено: {mistakeQuestions.length} вопросов
            </span>
          </div>

          {/* List of mistakes */}
          {mistakeQuestions.length > 0 ? (
            <div className="space-y-4">
              {mistakeQuestions.map((q, idx) => {
                if (!q) return null;
                const mInfo = storageState.mistakes[q.id];

                return (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-500">
                        {K2_TOPICS.find(t => t.id === q.topicId)?.title}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
                          Ошибок: {mInfo?.failCount || 1}
                        </span>
                        {mInfo?.resolved ? (
                          <span className="text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Усвоено
                          </span>
                        ) : (
                          <span className="text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md font-semibold">
                            Серия верных: {mInfo?.streak || 0} / 2
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                      {q.prompt}
                    </h4>

                    {q.typicalMistake && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                        <strong>Ловушка:</strong> {q.typicalMistake}
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setIsDrillMode(true);
                          setDrillIndex(idx);
                        }}
                        className="px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Решить этот вопрос
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty state */
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  В банке ошибок пусто!
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  У вас нет неисправленных ошибок в данном фильтре. Продолжайте тренировку в режиме практики или проверьте себя на пробном зачёте!
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
