import React from 'react';
import { K2StorageState } from '../../types/k2';
import { K2_TOPICS } from '../../data/k2/topics';
import { STUDY_SCENARIOS } from '../../data/k2/quickReview';
import {
  GraduationCap,
  BookOpen,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  Database,
} from 'lucide-react';

interface K2DashboardProps {
  storageState: K2StorageState;
  onNavigateTab: (tab: 'theory' | 'practice' | 'exam' | 'mistakes') => void;
  onSelectTopicForTheory: (topicId: string) => void;
  onSelectTopicForPractice: (topicId: string) => void;
  onOpenQuickReview: () => void;
  onOpenContentManager: () => void;
}

export const K2Dashboard: React.FC<K2DashboardProps> = ({
  storageState,
  onNavigateTab,
  onSelectTopicForTheory,
  onSelectTopicForPractice,
  onOpenQuickReview,
  onOpenContentManager,
}) => {
  const { topicProgress, mistakes, examAttempts } = storageState;

  // Real calculations
  const totalTopics = K2_TOPICS.length;
  const readLessonsCount = Object.values(topicProgress).filter(t => t.lessonRead).length;

  let totalQuestionsAnswered = 0;
  let totalQuestionsCorrect = 0;
  Object.values(topicProgress).forEach(tp => {
    totalQuestionsAnswered += tp.questionsAnswered;
    totalQuestionsCorrect += tp.questionsCorrect;
  });

  const accuracyPct =
    totalQuestionsAnswered > 0
      ? Math.round((totalQuestionsCorrect / totalQuestionsAnswered) * 100)
      : 0;

  // Overall readiness score (composite of read lessons 30% and practice accuracy 70%)
  const lessonsShare = (readLessonsCount / totalTopics) * 30;
  const practiceShare =
    totalQuestionsAnswered > 0
      ? Math.min(70, (totalQuestionsCorrect / 120) * 70) // up to 70% if 120 questions solved
      : 0;
  const overallReadiness = Math.round(lessonsShare + practiceShare);

  const unresolvedMistakesCount = Object.values(mistakes).filter(m => !m.resolved).length;

  const bestExamScore = examAttempts.reduce((max, a) => Math.max(max, a.scorePercent), 0);

  return (
    <div className="space-y-8 animate-fade">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-emerald-900/10 border border-indigo-200/50 dark:border-indigo-800/30 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Школьный зачёт 10 класса • Профильный уровень</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              К2: Карбоновые кислоты, сложные эфиры и жиры
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Интерактивный учебник по §44–49 Карцовой и Лёвкина, банк из 180 заданий 15 типов, пробный зачёт из 30 вопросов и полная ликвидация пробелов.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={onOpenQuickReview}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-sm shadow-amber-500/20 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Повторить за 10 минут</span>
            </button>

            <button
              onClick={() => onNavigateTab('exam')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-indigo-600/20 transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Сдать пробный зачёт К2</span>
            </button>
          </div>
        </div>

        {/* Readiness progress bar */}
        <div className="pt-2">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <span>Готовность к зачёту</span>
              <span className="text-zinc-400 font-normal">
                ({readLessonsCount}/12 тем изучено, {totalQuestionsCorrect} заданий решено)
              </span>
            </span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {overallReadiness}%
            </span>
          </div>
          <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, overallReadiness)}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Stats Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Read Lessons */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Теория</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {readLessonsCount} <span className="text-sm font-medium text-zinc-400">/ 12</span>
          </div>
          <span className="text-[11px] text-zinc-500">уроков освоено</span>
        </div>

        {/* Questions Solved */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Практика</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalQuestionsCorrect} <span className="text-sm font-medium text-zinc-400">/ 180</span>
          </div>
          <span className="text-[11px] text-zinc-500">точность {accuracyPct}%</span>
        </div>

        {/* Mistakes Bank */}
        <div
          onClick={() => onNavigateTab('mistakes')}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm cursor-pointer hover:border-rose-400 transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ошибки</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {unresolvedMistakesCount}
          </div>
          <span className="text-[11px] text-zinc-500">требуют отработки →</span>
        </div>

        {/* Best Exam Score */}
        <div
          onClick={() => onNavigateTab('exam')}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm cursor-pointer hover:border-indigo-400 transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Лучший зачёт</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {bestExamScore > 0 ? `${bestExamScore}%` : '—'}
          </div>
          <span className="text-[11px] text-zinc-500">
            {examAttempts.length > 0 ? `${examAttempts.length} попыток` : 'ещё не сдавался'}
          </span>
        </div>
      </div>

      {/* Preparation Scenarios */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Сценарии экспресс-подготовки
            </h2>
          </div>
          <span className="text-xs text-zinc-500">Выберите удобный темп</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STUDY_SCENARIOS.map(sc => (
            <div
              key={sc.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-400/50 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {sc.duration}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Цель: {sc.targetScore}
                  </span>
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                  {sc.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {sc.description}
                </p>
              </div>

              <div className="space-y-1.5 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                {sc.steps.map(s => (
                  <div
                    key={s.step}
                    className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {s.step}
                    </span>
                    <span className="leading-tight">{s.title}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  const firstStep = sc.steps[0];
                  if (firstStep.tab === 'review') {
                    onOpenQuickReview();
                  } else {
                    onNavigateTab(firstStep.tab as any);
                  }
                }}
                className="w-full py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Начать сценарий</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 12 Topics Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              12 Учебных тем (§44–49 Карцова & Лёвкин)
            </h2>
          </div>
          <span className="text-xs text-zinc-500">
            {readLessonsCount} из {totalTopics} пройдено
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {K2_TOPICS.map(topic => {
            const prog = topicProgress[topic.id];
            const isRead = prog?.lessonRead;
            const solved = prog?.questionsCorrect || 0;
            const totalInTopic = 15; // 15 questions per topic
            const pct = Math.min(100, Math.round((solved / totalInTopic) * 100));

            return (
              <div
                key={topic.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                        {topic.icon}
                      </span>
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 block">
                          Тема {topic.order} • {topic.subsections?.length || 3} подраздела
                        </span>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-snug">
                          {topic.title}
                        </h3>
                      </div>
                    </div>

                    {isRead && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                    )}
                  </div>

                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-500">Решено задач:</span>
                    <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">
                      {solved} / {totalInTopic} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSelectTopicForTheory(topic.id)}
                      className="flex-1 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs rounded-lg transition-colors"
                    >
                      Теория
                    </button>
                    <button
                      onClick={() => onSelectTopicForPractice(topic.id)}
                      className="flex-1 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-semibold text-xs rounded-lg transition-colors border border-emerald-500/20"
                    >
                      Задачи
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Utility Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-500">
        <span>Данные прогресса автоматически сохраняются локально в вашем браузере.</span>
        <button
          onClick={onOpenContentManager}
          className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 transition-colors"
        >
          <Database className="w-4 h-4" />
          <span>Экспорт / Импорт / Сброс</span>
        </button>
      </div>
    </div>
  );
};
