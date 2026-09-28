import {
  K2StorageState,
  K2TopicId,
  K2TopicProgress,
  K2ExamAttempt,
  K2MistakeRecord,
  K2UserAnswerRecord,
} from '../types/k2';

export const K2_STORAGE_KEY = 'k2_prep_progress_v1';

export const ALL_TOPIC_IDS: K2TopicId[] = [
  'topic1_structure',
  'topic2_formulas',
  'topic3_nomenclature',
  'topic4_isomerism',
  'topic5_acidity',
  'topic6_reactions',
  'topic7_synthesis',
  'topic8_derivatives',
  'topic9_esters',
  'topic10_hydrolysis',
  'topic11_fatty_acids',
  'topic12_fats_soap',
];

export function createDefaultK2Progress(): K2StorageState {
  const topicProgress: Record<K2TopicId, K2TopicProgress> = {} as any;
  for (const tid of ALL_TOPIC_IDS) {
    topicProgress[tid] = {
      topicId: tid,
      lessonRead: false,
      questionsAnswered: 0,
      questionsCorrect: 0,
      masteryPercent: 0,
    };
  }

  return {
    version: 1,
    topicProgress,
    mistakes: {},
    history: [],
    examAttempts: [],
  };
}

export function loadK2StorageState(): K2StorageState {
  if (typeof window === 'undefined') return createDefaultK2Progress();
  try {
    const raw = localStorage.getItem(K2_STORAGE_KEY);
    if (!raw) return createDefaultK2Progress();
    const parsed = JSON.parse(raw);
    const def = createDefaultK2Progress();

    // Ensure all 12 topics exist
    const mergedTopics: Record<K2TopicId, K2TopicProgress> = { ...def.topicProgress };
    if (parsed.topicProgress) {
      for (const tid of ALL_TOPIC_IDS) {
        if (parsed.topicProgress[tid]) {
          mergedTopics[tid] = { ...def.topicProgress[tid], ...parsed.topicProgress[tid] };
        }
      }
    }

    return {
      version: parsed.version || 1,
      topicProgress: mergedTopics,
      mistakes: parsed.mistakes || {},
      history: parsed.history || [],
      examAttempts: parsed.examAttempts || [],
      activeExamSession: parsed.activeExamSession,
    };
  } catch (err) {
    console.error('Failed to load K2 progress:', err);
    return createDefaultK2Progress();
  }
}

export const loadK2Progress = loadK2StorageState;

export function saveK2StorageState(state: K2StorageState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(K2_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save K2 progress:', err);
  }
}

export const saveK2Progress = saveK2StorageState;

export function resetK2Progress(): K2StorageState {
  const def = createDefaultK2Progress();
  saveK2StorageState(def);
  return def;
}

export function toggleK2LessonRead(
  prevState: K2StorageState,
  topicId: K2TopicId
): K2StorageState {
  const currentTopic = prevState.topicProgress[topicId];
  const isNowRead = !currentTopic?.lessonRead;

  const newState: K2StorageState = {
    ...prevState,
    topicProgress: {
      ...prevState.topicProgress,
      [topicId]: {
        ...currentTopic,
        lessonRead: isNowRead,
        lastStudiedDate: new Date().toISOString(),
      },
    },
  };
  saveK2StorageState(newState);
  return newState;
}

export const markK2LessonRead = toggleK2LessonRead;

export function recordK2Answer(
  prevState: K2StorageState,
  questionId: string,
  topicId: K2TopicId,
  userAnswer: any,
  isCorrect: boolean
): K2StorageState {
  const currentTopic = prevState.topicProgress[topicId] || {
    topicId,
    lessonRead: false,
    questionsAnswered: 0,
    questionsCorrect: 0,
    masteryPercent: 0,
  };

  const answered = currentTopic.questionsAnswered + 1;
  const correct = currentTopic.questionsCorrect + (isCorrect ? 1 : 0);
  const mastery = Math.min(100, Math.round((correct / 15) * 100)); // 15 questions per topic

  const updatedTopic: K2TopicProgress = {
    ...currentTopic,
    questionsAnswered: answered,
    questionsCorrect: correct,
    masteryPercent: mastery,
    lastStudiedDate: new Date().toISOString(),
  };

  // Update mistake tracking
  const updatedMistakes: Record<string, K2MistakeRecord> = { ...prevState.mistakes };
  const currentMistake = updatedMistakes[questionId];

  if (!isCorrect) {
    updatedMistakes[questionId] = {
      questionId,
      topicId,
      failCount: (currentMistake?.failCount || 0) + 1,
      streak: 0,
      resolved: false,
      lastAttempt: Date.now(),
    };
  } else if (currentMistake) {
    const nextStreak = (currentMistake.streak || 0) + 1;
    updatedMistakes[questionId] = {
      ...currentMistake,
      streak: nextStreak,
      resolved: nextStreak >= 2, // 2 correct answers in a row marks it resolved
      lastAttempt: Date.now(),
    };
  }

  // Record history (keep last 500)
  const historyItem: K2UserAnswerRecord = {
    questionId,
    topicId,
    userAnswer,
    isCorrect,
    timestamp: Date.now(),
  };
  const updatedHistory = [historyItem, ...prevState.history].slice(0, 500);

  const newState: K2StorageState = {
    ...prevState,
    topicProgress: {
      ...prevState.topicProgress,
      [topicId]: updatedTopic,
    },
    mistakes: updatedMistakes,
    history: updatedHistory,
  };

  saveK2StorageState(newState);
  return newState;
}

export function addK2ExamAttempt(
  prevState: K2StorageState,
  attempt: K2ExamAttempt
): K2StorageState {
  const newState: K2StorageState = {
    ...prevState,
    examAttempts: [attempt, ...prevState.examAttempts],
  };
  saveK2StorageState(newState);
  return newState;
}

export function exportK2ProgressAsJson(state: K2StorageState): string {
  return JSON.stringify(state, null, 2);
}

export function importK2ProgressFromJson(jsonStr: string): K2StorageState | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object' || !parsed.topicProgress) {
      return null;
    }
    const def = createDefaultK2Progress();
    const merged: K2StorageState = {
      version: parsed.version || 1,
      topicProgress: { ...def.topicProgress, ...parsed.topicProgress },
      mistakes: parsed.mistakes || {},
      history: parsed.history || [],
      examAttempts: parsed.examAttempts || [],
      activeExamSession: parsed.activeExamSession,
    };
    saveK2StorageState(merged);
    return merged;
  } catch (e) {
    console.error('Invalid K2 JSON progress import', e);
    return null;
  }
}
