import { useState, useEffect, useCallback } from 'react';
import { AppState, QuestionType } from '../types/chemistry';
import {
  loadAppState,
  saveAppState,
  clearAppState,
  createDefaultProgress,
  INITIAL_STATISTICS,
} from '../utils/storage';
import { calculateNewMastery, updateStatisticsWithAnswer } from '../utils/mastery';

export function useProgress() {
  const [state, setState] = useState<AppState>(() => loadAppState());

  // Save to localStorage on state change
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Handle dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.settings.theme]);

  const recordAnswer = useCallback(
    (acidId: string, isCorrect: boolean, questionType: QuestionType) => {
      setState(prev => {
        const currentAcidMastery = prev.perAcidProgress[acidId] || {
          correctAnswers: 0,
          wrongAnswers: 0,
          streak: 0,
          mastery: 0,
          difficultyWeight: 1.0,
        };

        const updatedMastery = calculateNewMastery(currentAcidMastery, isCorrect);
        const updatedStatistics = updateStatisticsWithAnswer(prev.statistics, isCorrect, questionType);

        return {
          ...prev,
          perAcidProgress: {
            ...prev.perAcidProgress,
            [acidId]: updatedMastery,
          },
          statistics: updatedStatistics,
        };
      });
    },
    []
  );

  const setManualMastery = useCallback((acidId: string, level: number) => {
    setState(prev => {
      const current = prev.perAcidProgress[acidId] || {
        correctAnswers: 0,
        wrongAnswers: 0,
        streak: 0,
        mastery: 0,
        difficultyWeight: 1.0,
      };

      return {
        ...prev,
        perAcidProgress: {
          ...prev.perAcidProgress,
          [acidId]: {
            ...current,
            mastery: Math.max(0, Math.min(5, level)),
            lastSeen: Date.now(),
          },
        },
      };
    });
  }, []);

  const toggleSound = useCallback(() => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        soundEnabled: !prev.settings.soundEnabled,
      },
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: prev.settings.theme === 'dark' ? 'light' : 'dark',
      },
    }));
  }, []);

  const setTutorialCompleted = useCallback((completed: boolean) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        tutorialCompleted: completed,
      },
    }));
  }, []);

  const resetAllProgress = useCallback(() => {
    clearAppState();
    setState(prev => ({
      ...prev,
      perAcidProgress: createDefaultProgress(),
      statistics: INITIAL_STATISTICS,
    }));
  }, []);

  return {
    state,
    recordAnswer,
    setManualMastery,
    toggleSound,
    toggleTheme,
    setTutorialCompleted,
    resetAllProgress,
  };
}
