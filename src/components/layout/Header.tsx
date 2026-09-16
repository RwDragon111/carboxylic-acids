import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Moon, Sun, RotateCcw, HelpCircle, Flame, Target, Maximize, Minimize } from 'lucide-react';
import { UserStatistics, UserSettings } from '../../types/chemistry';
import { getAccuracyPercent } from '../../utils/mastery';

interface HeaderProps {
  statistics: UserStatistics;
  settings: UserSettings;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onOpenTutorial: () => void;
  onOpenResetConfirm: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  statistics,
  settings,
  onToggleSound,
  onToggleTheme,
  onOpenTutorial,
  onOpenResetConfirm,
  onNavigateHome,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const accuracy = getAccuracyPercent(statistics.correctAnswers, statistics.totalAnswers);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
          aria-label="На главную"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-emerald-500 transition-colors">
            –COOH
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              Карбоновые кислоты
            </h1>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Тренажёр и справочник
            </span>
          </div>
        </button>

        {/* Live Mini Stats */}
        <div className="hidden md:flex items-center gap-4 text-xs font-semibold">
          {statistics.currentStreak >= 2 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>{statistics.currentStreak} подряд</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
            <Target className="w-3.5 h-3.5 text-emerald-500" />
            <span>Точность: {accuracy}%</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            title={settings.soundEnabled ? 'Выключить звук' : 'Включить звук'}
            aria-label={settings.soundEnabled ? 'Выключить звук' : 'Включить звук'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            title={settings.theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            aria-label="Переключить тему"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-600" />
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
            aria-label={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>

          {/* Tutorial Reopen */}
          <button
            onClick={onOpenTutorial}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            title="Инструкция / Обучение"
            aria-label="Открыть обучение"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Reset Progress */}
          <button
            onClick={onOpenResetConfirm}
            className="p-2 rounded-lg text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            title="Сбросить прогресс"
            aria-label="Сбросить прогресс"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
