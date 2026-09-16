import React from 'react';
import { PageTab } from '../../components/layout/Navigation';
import { AppState } from '../../types/chemistry';
import {
  getAccuracyPercent,
  getLearnedCount,
  getOverallProgressPercent,
} from '../../utils/mastery';
import {
  BookOpen,
  HelpCircle,
  Layers,
  Sparkles,
  Zap,
  GitCompare,
  AlertTriangle,
  GraduationCap,
  Eye,
  Flame,
  CheckCircle2,
  Calendar,
  Award,
  ChevronRight,
  Trophy,
} from 'lucide-react';

interface HomeProps {
  state: AppState;
  onSelectTab: (tab: PageTab) => void;
  mistakesCount: number;
}

export const Home: React.FC<HomeProps> = ({ state, onSelectTab, mistakesCount }) => {
  const { perAcidProgress, statistics } = state;
  const learnedCount = getLearnedCount(perAcidProgress);
  const overallPercent = getOverallProgressPercent(perAcidProgress);
  const accuracy = getAccuracyPercent(statistics.correctAnswers, statistics.totalAnswers);

  const modes = [
    {
      id: 'learn' as PageTab,
      title: 'Обучение',
      description: 'Изучай кислоты по одной: структуры, формулы, систематические названия и анионы.',
      icon: <BookOpen className="w-6 h-6 text-emerald-500" />,
      badge: 'Пошагово',
    },
    {
      id: 'quiz' as PageTab,
      title: 'Квиз',
      description: '12 типов вопросов с правдоподобными дистракторами и разбором ошибок.',
      icon: <HelpCircle className="w-6 h-6 text-blue-500" />,
      badge: '10/15/20 вопросов',
    },
    {
      id: 'flashcards' as PageTab,
      title: 'Карточки',
      description: 'Интерактивные 3D флип-карточки. Лицевая сторона — структура, оборот — название и формула.',
      icon: <Layers className="w-6 h-6 text-purple-500" />,
      badge: 'Интервально',
    },
    {
      id: 'shmyaga' as PageTab,
      title: 'Шмяга',
      description: '5 мини-игр для ряда Щ–М–Я–Г–А (дикарбоновые кислоты от 0 до 4 групп CH2).',
      icon: <Sparkles className="w-6 h-6 text-emerald-600" />,
      badge: 'Щ–М–Я–Г–А (C0–C4)',
      highlight: true,
    },
    {
      id: 'anions' as PageTab,
      title: 'Анионы',
      description: 'Изучение ровно 6 разрешённых анионов (формиат, ацетат, лактат, бензоат, салицилат, оксалат).',
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      badge: '6 анионов',
    },
    {
      id: 'matching' as PageTab,
      title: 'Сопоставление',
      description: 'Мини-игра на скорость: соединяй кислоты с анионами, структуры с названиями.',
      icon: <GitCompare className="w-6 h-6 text-cyan-500" />,
      badge: 'Мини-игра',
    },
    {
      id: 'mistakes' as PageTab,
      title: 'Ошибки',
      description: mistakesCount > 0
        ? `Тренируй слабые вещества (${mistakesCount} требуют закрепления).`
        : 'Ошибок пока нет. Проходи квизы для выявления слабых мест!',
      icon: <AlertTriangle className="w-6 h-6 text-rose-500" />,
      badge: mistakesCount > 0 ? `${mistakesCount} кислот` : 'Чисто',
    },
    {
      id: 'exam' as PageTab,
      title: 'Экзамен',
      description: '20 контрольных вопросов без подсказок с подробным финальным разбором.',
      icon: <GraduationCap className="w-6 h-6 text-indigo-500" />,
      badge: '20 вопросов',
    },
    {
      id: 'gallery' as PageTab,
      title: 'Галерея молекул',
      description: 'Единый каталог всех 12 кислот и 6 анионов в высоком разрешении.',
      icon: <Eye className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />,
      badge: '18 структур',
    },
  ];

  // Category statistics breakdown
  const cats = statistics.categoryAccuracy;
  const categoryStats = [
    { label: 'Названия', ...cats.names },
    { label: 'Структуры', ...cats.structures },
    { label: 'Формулы', ...cats.formulas },
    { label: 'Анионы', ...cats.anions },
    { label: 'Шмяга', ...cats.shmyaga },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade">
      {/* Hero section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Школьный курс органической химии</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Карбоновые кислоты
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
          Выучи названия, структуры и анионы
        </p>
      </div>

      {/* Main KPI Stats Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Learned acids */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Изучено</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {learnedCount} <span className="text-sm font-medium text-zinc-400">/ 12</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${(learnedCount / 12) * 100}%` }}
            />
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Точность</span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {accuracy}%
          </div>
          <span className="text-xs text-zinc-400">
            {statistics.correctAnswers} из {statistics.totalAnswers} верно
          </span>
        </div>

        {/* Current streak */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Текущая серия</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {statistics.currentStreak} 🔥
          </div>
          <span className="text-xs text-zinc-400">подряд</span>
        </div>

        {/* Best streak */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Лучшая серия</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {statistics.bestStreak}
          </div>
          <span className="text-xs text-zinc-400">максимум</span>
        </div>

        {/* Today's answers */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Сегодня</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {statistics.todayAnswers}
          </div>
          <span className="text-xs text-zinc-400">ответов дано</span>
        </div>
      </div>

      {/* Category Progress Bars */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Прогресс по разделам
          </h3>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Общий прогресс: {overallPercent}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {categoryStats.map(cat => {
            const pct = cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;
            return (
              <div
                key={cat.label}
                className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80"
              >
                <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                  <span className="text-zinc-600 dark:text-zinc-400">{cat.label}</span>
                  <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                    {cat.total > 0 ? `${pct}%` : '—'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">
                  {cat.correct} из {cat.total} верно
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mode Navigation Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Выберите режим
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => onSelectTab(mode.id)}
              className={`text-left p-6 rounded-2xl border transition-all duration-200 group relative flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                mode.highlight
                  ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30 hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/10'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 group-hover:scale-110 transition-transform">
                    {mode.icon}
                  </div>
                  {mode.badge && (
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                        mode.highlight
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {mode.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {mode.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {mode.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Перейти</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
