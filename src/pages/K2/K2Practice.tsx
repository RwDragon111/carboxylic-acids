import React, { useState, useMemo } from 'react';
import { K2TopicId, K2Question, K2QuestionType, K2Difficulty, K2StorageState } from '../../types/k2';
import { K2_TOPICS } from '../../data/k2/topics';
import { K2_QUESTIONS } from '../../data/k2/questions';
import { K2TaskCard } from '../../components/k2/K2TaskCard';
import {
  Filter,
  RotateCcw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from 'lucide-react';

interface K2PracticeProps {
  storageState: K2StorageState;
  activeTopicId?: K2TopicId;
  onRecordAnswer: (
    questionId: string,
    topicId: K2TopicId,
    userAnswer: any,
    isCorrect: boolean
  ) => void;
  soundEnabled: boolean;
}

export const K2Practice: React.FC<K2PracticeProps> = ({
  storageState,
  activeTopicId,
  onRecordAnswer,
  soundEnabled,
}) => {
  // Filters
  const [selectedTopic, setSelectedTopic] = useState<string>(activeTopicId || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unsolved' | 'wrong' | 'mastered'>('all');

  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return K2_QUESTIONS.filter((q: K2Question) => {
      if (selectedTopic !== 'all' && q.topicId !== selectedTopic) return false;
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      if (selectedType !== 'all' && q.type !== selectedType) return false;

      const mistake = storageState.mistakes[q.id];
      const isWrong = mistake && !mistake.resolved;
      const isMastered = mistake && mistake.resolved;
      const isAnswered = storageState.history.some((h: any) => h.questionId === q.id);

      if (statusFilter === 'unsolved' && isAnswered) return false;
      if (statusFilter === 'wrong' && !isWrong) return false;
      if (statusFilter === 'mastered' && !isMastered) return false;

      return true;
    });
  }, [selectedTopic, selectedDifficulty, selectedType, statusFilter, storageState]);

  // Safe current question
  const currentQuestion: K2Question | undefined = filteredQuestions[currentIndex];

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRandom = () => {
    if (filteredQuestions.length <= 1) return;
    const rnd = Math.floor(Math.random() * filteredQuestions.length);
    setCurrentIndex(rnd);
  };

  return (
    <div className="space-y-6 animate-fade">
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Фильтры заданий ({filteredQuestions.length} из {K2_QUESTIONS.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedTopic('all');
                setSelectedDifficulty('all');
                setSelectedType('all');
                setStatusFilter('all');
                setCurrentIndex(0);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Сбросить фильтры</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Topic Select */}
          <select
            value={selectedTopic}
            onChange={e => {
              setSelectedTopic(e.target.value);
              setCurrentIndex(0);
            }}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Все 12 тем учебника</option>
            {K2_TOPICS.map(t => (
              <option key={t.id} value={t.id}>
                Тема {t.order}: {t.title}
              </option>
            ))}
          </select>

          {/* Difficulty Select */}
          <select
            value={selectedDifficulty}
            onChange={e => {
              setSelectedDifficulty(e.target.value);
              setCurrentIndex(0);
            }}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Все уровни сложности</option>
            <option value="easy">Базовый уровень</option>
            <option value="medium">Средний уровень</option>
            <option value="hard">Профильный уровень</option>
          </select>

          {/* Question Type Select */}
          <select
            value={selectedType}
            onChange={e => {
              setSelectedType(e.target.value);
              setCurrentIndex(0);
            }}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Все типы механик</option>
            <option value="single_choice">Один правильный ответ</option>
            <option value="multi_choice">Несколько вариантов</option>
            <option value="text_input">Текстовый ввод названия</option>
            <option value="number_input">Числовой ответ</option>
            <option value="matching">Сопоставление пар</option>
            <option value="acidity_sorting">Ряд кислотности (сортировка)</option>
            <option value="find_error">Поиск ошибки</option>
            <option value="calculation">Расчётная задача</option>
          </select>

          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value as any);
              setCurrentIndex(0);
            }}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Любой статус решения</option>
            <option value="unsolved">Только нерешённые</option>
            <option value="wrong">Только с ошибками</option>
            <option value="mastered">Только освоенные</option>
          </select>
        </div>
      </div>

      {/* Main Task Area */}
      {currentQuestion ? (
        <div className="space-y-4">
          {/* Card Navigation Header */}
          <div className="flex items-center justify-between px-1 text-xs">
            <span className="font-semibold text-zinc-500">
              Вопрос {currentIndex + 1} из {filteredQuestions.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRandom}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 transition-colors"
                title="Случайный вопрос из фильтра"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Случайно</span>
              </button>

              <button
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                disabled={currentIndex === filteredQuestions.length - 1}
                onClick={handleNext}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Task Card */}
          <K2TaskCard
            key={currentQuestion.id}
            question={currentQuestion}
            showFeedbackImmediately={true}
            soundEnabled={soundEnabled}
            numberInSet={currentIndex + 1}
            totalInSet={filteredQuestions.length}
            onNext={currentIndex < filteredQuestions.length - 1 ? handleNext : undefined}
            onAnswer={(ans, correct) => {
              onRecordAnswer(currentQuestion.id, currentQuestion.topicId, ans, correct);
            }}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center space-y-3">
          <Layers className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-200">
            Нет вопросов, удовлетворяющих выбранным фильтрам
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Попробуйте расширить фильтры или выбрать «Все темы».
          </p>
          <button
            onClick={() => {
              setSelectedTopic('all');
              setSelectedDifficulty('all');
              setSelectedType('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Сбросить все фильтры
          </button>
        </div>
      )}
    </div>
  );
};
