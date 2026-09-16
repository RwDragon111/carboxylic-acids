import { AppState, AcidMastery, UserStatistics, UserSettings } from '../types/chemistry';
import { ACIDS } from '../data/acids';

const STORAGE_KEY = 'carboxylic_acids_v1';

export const INITIAL_SETTINGS: UserSettings = {
  soundEnabled: true,
  theme: 'dark',
  tutorialCompleted: false,
  showMnemonics: true,
};

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function createDefaultProgress(): Record<string, AcidMastery> {
  const progress: Record<string, AcidMastery> = {};
  ACIDS.forEach(acid => {
    progress[acid.id] = {
      correctAnswers: 0,
      wrongAnswers: 0,
      streak: 0,
      mastery: 0,
      difficultyWeight: 1.0,
    };
  });
  return progress;
}

export const INITIAL_STATISTICS: UserStatistics = {
  totalAnswers: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
  todayAnswers: 0,
  lastSessionDate: getTodayString(),
  categoryAccuracy: {
    names: { correct: 0, total: 0 },
    structures: { correct: 0, total: 0 },
    formulas: { correct: 0, total: 0 },
    anions: { correct: 0, total: 0 },
    shmyaga: { correct: 0, total: 0 },
  },
};

export function loadAppState(): AppState {
  if (typeof window === 'undefined') {
    return {
      perAcidProgress: createDefaultProgress(),
      statistics: INITIAL_STATISTICS,
      settings: INITIAL_SETTINGS,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        perAcidProgress: createDefaultProgress(),
        statistics: INITIAL_STATISTICS,
        settings: INITIAL_SETTINGS,
      };
    }

    const parsed: Partial<AppState> = JSON.parse(raw);
    const today = getTodayString();

    const stats: UserStatistics = {
      ...INITIAL_STATISTICS,
      ...(parsed.statistics || {}),
      categoryAccuracy: {
        ...INITIAL_STATISTICS.categoryAccuracy,
        ...(parsed.statistics?.categoryAccuracy || {})
      }
    };

    // Reset today count if it's a new day
    if (stats.lastSessionDate !== today) {
      stats.todayAnswers = 0;
      stats.lastSessionDate = today;
    }

    // Ensure all 12 acids exist in perAcidProgress
    const defaultProgress = createDefaultProgress();
    const perAcid = { ...defaultProgress, ...(parsed.perAcidProgress || {}) };

    const settings: UserSettings = {
      ...INITIAL_SETTINGS,
      ...(parsed.settings || {}),
    };

    return {
      perAcidProgress: perAcid,
      statistics: stats,
      settings,
    };
  } catch (e) {
    console.error('Failed to load state from localStorage:', e);
    return {
      perAcidProgress: createDefaultProgress(),
      statistics: INITIAL_STATISTICS,
      settings: INITIAL_SETTINGS,
    };
  }
}

export function saveAppState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

export function clearAppState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
