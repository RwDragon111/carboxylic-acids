import React, { useState, useEffect } from 'react';
import { K2Question, K2ExamAttempt, K2TopicId, K2StorageState } from '../../types/k2';
import { K2_TOPICS } from '../../data/k2/topics';
import { K2_QUESTIONS } from '../../data/k2/questions';
import { K2TaskCard } from '../../components/k2/K2TaskCard';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Flag,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen,
  ArrowRight,
  Pause,
  Play,
} from 'lucide-react';

interface K2ExamProps {
  storageState: K2StorageState;
  onSaveAttempt: (attempt: K2ExamAttempt) => void;
  onAddMistakeFromExam: (questionId: string, topicId: K2TopicId, wrongAns: any) => void;
  soundEnabled: boolean;
}

const EXAM_SESSION_STORAGE_KEY = 'k2_active_exam_session_v1';
const EXAM_QUESTION_COUNT = 30;
const EXAM_TIME_SECONDS = 45 * 60; // 45 minutes

// Generate 30 questions uniformly from all 12 topics
function generateExamQuestions(): K2Question[] {
  const result: K2Question[] = [];
  const questionsByTopic: Record<string, K2Question[]> = {};

  K2_TOPICS.forEach(t => {
    questionsByTopic[t.id] = K2_QUESTIONS.filter((q: K2Question) => q.topicId === t.id);
  });

  // Pick 2-3 questions from each of the 12 topics
  K2_TOPICS.forEach(t => {
    const list = [...(questionsByTopic[t.id] || [])].sort(() => Math.random() - 0.5);
    // Take 2 from each topic (12 * 2 = 24)
    result.push(...list.slice(0, 2));
  });

  // Fill remaining 6 questions from remaining pool randomly
  const alreadyPicked = new Set(result.map((q: K2Question) => q.id));
  const remaining = K2_QUESTIONS.filter((q: K2Question) => !alreadyPicked.has(q.id)).sort(() => Math.random() - 0.5);
  result.push(...remaining.slice(0, EXAM_QUESTION_COUNT - result.length));

  return result.sort(() => Math.random() - 0.5);
}

export const K2Exam: React.FC<K2ExamProps> = ({
  storageState,
  onSaveAttempt,
  onAddMistakeFromExam,
  soundEnabled,
}) => {
  const [examQuestions, setExamQuestions] = useState<K2Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(EXAM_TIME_SECONDS);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isExamActive, setIsExamActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finishedAttempt, setFinishedAttempt] = useState<K2ExamAttempt | null>(null);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  // Restore session from localStorage if exists
  useEffect(() => {
    const saved = localStorage.getItem(EXAM_SESSION_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.questionIds && parsed.questionIds.length === EXAM_QUESTION_COUNT && !parsed.isSubmitted) {
          const qs = parsed.questionIds
            .map((id: string) => K2_QUESTIONS.find((q: K2Question) => q.id === id))
            .filter(Boolean) as K2Question[];

          if (qs.length === EXAM_QUESTION_COUNT) {
            setExamQuestions(qs);
            setUserAnswers(parsed.userAnswers || {});
            setFlaggedQuestions(parsed.flaggedQuestions || {});
            setCurrentIndex(parsed.currentIndex || 0);
            setTimeLeft(parsed.timeLeft || EXAM_TIME_SECONDS);
            setIsExamActive(true);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to restore exam session', e);
      }
    }
  }, []);

  // Autosave active exam session
  useEffect(() => {
    if (isExamActive && !isSubmitted && examQuestions.length > 0) {
      const session = {
        questionIds: examQuestions.map(q => q.id),
        userAnswers,
        flaggedQuestions,
        currentIndex,
        timeLeft,
        isSubmitted: false,
      };
      localStorage.setItem(EXAM_SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  }, [isExamActive, isSubmitted, examQuestions, userAnswers, flaggedQuestions, currentIndex, timeLeft]);

  // Timer countdown
  useEffect(() => {
    if (!isExamActive || isSubmitted || isTimerPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamActive, isSubmitted, isTimerPaused]);

  // Start new exam
  const handleStartExam = () => {
    const qs = generateExamQuestions();
    setExamQuestions(qs);
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentIndex(0);
    setTimeLeft(EXAM_TIME_SECONDS);
    setIsTimerPaused(false);
    setIsExamActive(true);
    setIsSubmitted(false);
    setFinishedAttempt(null);
  };

  // Submit exam
  const handleSubmitExam = () => {
    setShowConfirmFinish(false);
    setIsSubmitted(true);
    setIsExamActive(false);
    localStorage.removeItem(EXAM_SESSION_STORAGE_KEY);

    // Calculate score
    let score = 0;
    const topicBreakdown: Record<string, { total: number; correct: number }> = {};

    examQuestions.forEach(q => {
      if (!topicBreakdown[q.topicId]) {
        topicBreakdown[q.topicId] = { total: 0, correct: 0 };
      }
      topicBreakdown[q.topicId].total += 1;

      const userAns = userAnswers[q.id];
      let isCorrect = false;

      if (q.options && q.correctAnswerSingle !== undefined) {
        isCorrect = userAns === q.correctAnswerSingle;
      } else if (q.type === 'multi_choice') {
        const target = q.correctAnswerMulti || [];
        const chosen = Array.isArray(userAns) ? userAns : [];
        isCorrect =
          chosen.length === target.length &&
          target.every(x => chosen.includes(x));
      } else if (q.acceptedTextAnswers) {
        const norm = String(userAns || '').toLowerCase().trim();
        isCorrect = q.acceptedTextAnswers.some(a => norm === a.toLowerCase().trim());
      } else if (q.numericAnswer) {
        const val = parseFloat(String(userAns || '').replace(',', '.'));
        isCorrect = !isNaN(val) && Math.abs(val - q.numericAnswer.value) <= Math.max(q.numericAnswer.tolerance, 0.05);
      }

      if (isCorrect) {
        score += 1;
        topicBreakdown[q.topicId].correct += 1;
      } else {
        // Record mistake
        onAddMistakeFromExam(q.id, q.topicId, userAns);
      }
    });

    const percent = Math.round((score / examQuestions.length) * 100);
    let grade: 5 | 4 | 3 | 2 = 2;
    if (percent >= 85) grade = 5;
    else if (percent >= 70) grade = 4;
    else if (percent >= 50) grade = 3;

    const attempt: K2ExamAttempt = {
      id: `attempt_${Date.now()}`,
      date: new Date().toISOString(),
      score,
      totalQuestions: examQuestions.length,
      scorePercent: percent,
      grade,
      timeSpentSeconds: EXAM_TIME_SECONDS - timeLeft,
      answers: userAnswers,
    };

    setFinishedAttempt(attempt);
    onSaveAttempt(attempt);
  };

  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== undefined && userAnswers[k] !== null).length;
  const currentQuestion = examQuestions[currentIndex];

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 animate-fade">
      {/* 1. INITIAL SPLASH SCREEN */}
      {!isExamActive && !isSubmitted && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              Пробный зачёт К2
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Комплексная проверка знаний по всей теме «Карбоновые кислоты, сложные эфиры и жиры» (§44–49).
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-400 block mb-0.5">Вопросов</span>
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">30 задач</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Время</span>
              <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">45 минут</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Оценка «5»</span>
              <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">≥ 85%</span>
            </div>
          </div>

          <div className="text-left text-xs text-zinc-500 space-y-1.5 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 block mb-1">
              Правила прохождения:
            </span>
            <p>• Подсказки во время зачёта скрыты для честной проверки готовности.</p>
            <p>• Вы можете свободно переключаться между вопросами и отмечать сомнительные флажком.</p>
            <p>• Прогресс сохраняется автоматически: случайное обновление страницы не сбросит ответы.</p>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 transition-all text-sm flex items-center justify-center gap-2"
          >
            <span>Начать зачёт</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. ACTIVE EXAM RUNNER */}
      {isExamActive && !isSubmitted && currentQuestion && (
        <div className="space-y-5">
          {/* Top Exam Status Bar */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg">
                Вопрос {currentIndex + 1} / {examQuestions.length}
              </span>
              <span className="text-xs text-zinc-400 hidden sm:inline">
                (Отвечено {answeredCount} из {examQuestions.length})
              </span>
            </div>

            {/* Timer Bar */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold px-3 py-1 rounded-xl border ${
                  timeLeft < 300
                    ? 'bg-rose-500/10 text-rose-600 border-rose-500/30 animate-pulse'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTimer(timeLeft)}</span>
              </div>

              <button
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-800"
                title={isTimerPaused ? 'Продолжить' : 'Пауза'}
              >
                {isTimerPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowConfirmFinish(true)}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
              >
                Завершить
              </button>
            </div>
          </div>

          {/* Question Grid Navigator (1 to 30) */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-1.5 min-w-max">
              {examQuestions.map((q, idx) => {
                const isCur = idx === currentIndex;
                const isAns = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null;
                const isFlag = flaggedQuestions[q.id];

                let pillStyle =
                  'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500';
                if (isCur) {
                  pillStyle = 'border-indigo-600 bg-indigo-600 text-white font-bold ring-2 ring-indigo-500/30';
                } else if (isFlag) {
                  pillStyle = 'border-amber-400 bg-amber-500/10 text-amber-600 font-bold';
                } else if (isAns) {
                  pillStyle = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 font-semibold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono border transition-all flex items-center justify-center ${pillStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Question Task Card */}
          <K2TaskCard
            key={currentQuestion.id}
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            showFeedbackImmediately={false}
            isSubmitted={false}
            isFlagged={flaggedQuestions[currentQuestion.id]}
            soundEnabled={soundEnabled}
            numberInSet={currentIndex + 1}
            totalInSet={examQuestions.length}
            onToggleFlag={() =>
              setFlaggedQuestions(prev => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))
            }
            onAnswer={ans => {
              setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: ans }));
            }}
          />

          {/* Prev/Next Buttons */}
          <div className="flex items-center justify-between">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Предыдущий</span>
            </button>

            <button
              disabled={currentIndex === examQuestions.length - 1}
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 disabled:opacity-40"
            >
              <span>Следующий</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. EXAM FINISHED RESULTS SCREEN */}
      {isSubmitted && finishedAttempt && (
        <div className="space-y-6">
          {/* Result Banner */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl font-black ${
                    finishedAttempt.grade >= 4
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : finishedAttempt.grade === 3
                      ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                  }`}
                >
                  {finishedAttempt.grade}
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                    {finishedAttempt.grade === 5
                      ? 'Блестящий результат! Оценка «5»'
                      : finishedAttempt.grade === 4
                      ? 'Хорошая работа! Оценка «4»'
                      : finishedAttempt.grade === 3
                      ? 'Зачёт сдан, но есть пробелы (Оценка «3»)'
                      : 'Зачёт не сдан (Оценка «2»)'}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Верно {finishedAttempt.score} из {finishedAttempt.totalQuestions} заданий ({finishedAttempt.scorePercent}%) • Время: {formatTimer(finishedAttempt.timeSpentSeconds)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleStartExam}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Сдать повторно</span>
              </button>
            </div>

            {/* Questions Detailed Review Header */}
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Полный разбор всех 30 вопросов зачёта:</span>
              </h3>

              <div className="space-y-4">
                {examQuestions.map((q, idx) => (
                  <K2TaskCard
                    key={q.id}
                    question={q}
                    userAnswer={userAnswers[q.id]}
                    showFeedbackImmediately={false}
                    isSubmitted={true}
                    numberInSet={idx + 1}
                    totalInSet={examQuestions.length}
                    soundEnabled={false}
                    onAnswer={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal to finish exam */}
      {showConfirmFinish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Завершить зачёт?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Вы ответили на {answeredCount} из {examQuestions.length} вопросов.
              {answeredCount < examQuestions.length && (
                <span className="text-amber-600 font-semibold block mt-1">
                  ⚠️ Внимание: {examQuestions.length - answeredCount} вопросов остались без ответа!
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmFinish(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Вернуться к зачёту
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl"
              >
                Да, завершить и проверить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
