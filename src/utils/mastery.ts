import { AcidMastery, UserStatistics, QuestionType } from '../types/chemistry';
import { ACIDS } from '../data/acids';

export function calculateNewMastery(current: AcidMastery, isCorrect: boolean): AcidMastery {
  const now = Date.now();
  const correct = current.correctAnswers + (isCorrect ? 1 : 0);
  const wrong = current.wrongAnswers + (isCorrect ? 0 : 1);
  const streak = isCorrect ? current.streak + 1 : 0;

  // Mastery score from 0 to 5
  let mastery = current.mastery;
  if (isCorrect) {
    if (streak >= 5 && correct >= 8) {
      mastery = 5;
    } else if (streak >= 3 && correct >= 5) {
      mastery = Math.min(4, mastery + 1);
    } else if (streak >= 2 && correct >= 3) {
      mastery = Math.min(3, mastery + 1);
    } else if (mastery < 2) {
      mastery = Math.min(2, mastery + 1);
    }
  } else {
    // Graceful drop on wrong answer
    mastery = Math.max(0, mastery - 1);
  }

  // Weight for adaptive question selection: higher weight = more frequent appearance
  // Baseline weight is 1.0; wrong answers increase it, consecutive correct decrease it slightly
  let weight = 1.0 + (wrong * 0.4) - (streak * 0.15);
  weight = Math.max(0.3, Math.min(3.5, weight));

  return {
    correctAnswers: correct,
    wrongAnswers: wrong,
    streak,
    mastery,
    lastSeen: now,
    difficultyWeight: weight,
  };
}

export function updateStatisticsWithAnswer(
  prevStats: UserStatistics,
  isCorrect: boolean,
  questionType: QuestionType
): UserStatistics {
  const currentStreak = isCorrect ? prevStats.currentStreak + 1 : 0;
  const bestStreak = Math.max(prevStats.bestStreak, currentStreak);

  const cat = mapQuestionTypeToCategory(questionType);
  const prevCat = prevStats.categoryAccuracy[cat] || { correct: 0, total: 0 };
  const updatedCat = {
    correct: prevCat.correct + (isCorrect ? 1 : 0),
    total: prevCat.total + 1,
  };

  return {
    ...prevStats,
    totalAnswers: prevStats.totalAnswers + 1,
    correctAnswers: prevStats.correctAnswers + (isCorrect ? 1 : 0),
    wrongAnswers: prevStats.wrongAnswers + (isCorrect ? 0 : 1),
    currentStreak,
    bestStreak,
    todayAnswers: prevStats.todayAnswers + 1,
    categoryAccuracy: {
      ...prevStats.categoryAccuracy,
      [cat]: updatedCat,
    },
  };
}

function mapQuestionTypeToCategory(type: QuestionType): keyof UserStatistics['categoryAccuracy'] {
  switch (type) {
    case 'structure_to_trivial':
    case 'trivial_to_structure':
      return 'structures';
    case 'trivial_to_formula':
    case 'formula_to_trivial':
      return 'formulas';
    case 'systematic_to_trivial':
    case 'trivial_to_systematic':
      return 'names';
    case 'acid_to_anion':
    case 'anion_to_acid':
    case 'anion_formula_to_name':
    case 'anion_name_to_formula':
    case 'anion_structure_to_name':
      return 'anions';
    case 'ch2_count_to_acid':
      return 'shmyaga';
  }
}

export function getOverallProgressPercent(progress: Record<string, AcidMastery>): number {
  const totalPossible = ACIDS.length * 5; // 12 * 5 = 60
  if (totalPossible === 0) return 0;
  const currentPoints = Object.values(progress).reduce((acc, p) => acc + (p.mastery || 0), 0);
  return Math.min(100, Math.round((currentPoints / totalPossible) * 100));
}

export function getLearnedCount(progress: Record<string, AcidMastery>): number {
  // Considered "learned" if mastery >= 3
  return Object.values(progress).filter(p => (p.mastery || 0) >= 3).length;
}

export function getAccuracyPercent(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}
