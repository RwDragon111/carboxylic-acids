import type { CarbQuestion } from '../data/carbohydrates/questions';

export const CARB_STORAGE_KEY = 'carbohydrates_prep_v1';
export interface CarbProgress {
  read: string[];
  answers: Record<string, { attempts: number; correct: number; lastCorrect: boolean }>;
  exams: { date: string; correct: number; total: number }[];
}
export function emptyCarbProgress(): CarbProgress { return { read: [], answers: {}, exams: [] }; }

export function parseCarbProgress(raw: string | null): CarbProgress {
  if (!raw) return emptyCarbProgress();
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object') return emptyCarbProgress();
    const answers: CarbProgress['answers'] = {};
    if (value.answers && typeof value.answers === 'object') {
      for (const [id, entry] of Object.entries(value.answers)) {
        const a = entry as CarbProgress['answers'][string];
        if (a && Number.isSafeInteger(a.attempts) && a.attempts > 0 && Number.isSafeInteger(a.correct) && a.correct >= 0 && a.correct <= a.attempts && typeof a.lastCorrect === 'boolean') answers[id] = a;
      }
    }
    return {
      read: Array.isArray(value.read) ? value.read.filter((x: unknown) => typeof x === 'string') : [],
      answers,
      exams: Array.isArray(value.exams) ? value.exams.filter((e: CarbProgress['exams'][number]) => e && typeof e.date === 'string' && Number.isSafeInteger(e.total) && e.total > 0 && Number.isSafeInteger(e.correct) && e.correct >= 0 && e.correct <= e.total).slice(0, 20) : [],
    };
  } catch { return emptyCarbProgress(); }
}

export function loadCarbProgress(): CarbProgress {
  try { return parseCarbProgress(localStorage.getItem(CARB_STORAGE_KEY)); }
  catch { return emptyCarbProgress(); }
}

export function recordCarbAnswer(progress: CarbProgress, id: string, correct: boolean): CarbProgress {
  const prev = progress.answers[id];
  return { ...progress, answers: { ...progress.answers, [id]: {
    attempts: (prev?.attempts ?? 0) + 1,
    correct: (prev?.correct ?? 0) + Number(correct),
    lastCorrect: correct,
  } } };
}

export function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Every topic is represented before filling remaining exam places.
export function createCarbExam(bank: CarbQuestion[], topics: string[], count = 30): CarbQuestion[] {
  const chosen = topics.flatMap(topic => shuffled(bank.filter(q => q.topic === topic)).slice(0, 1));
  const ids = new Set(chosen.map(q => q.id));
  return shuffled([...chosen, ...shuffled(bank.filter(q => !ids.has(q.id))).slice(0, Math.max(0, count - chosen.length))]).slice(0, count);
}
