export type AcidCategory = 'monocarboxylic' | 'dicarboxylic' | 'hydroxy' | 'aromatic';

export interface AnionInfo {
  name: string;        // e.g. "формиат", "оксалат"
  formula: string;     // e.g. "HCOO⁻", "C2O4²⁻"
  structureAsset: string; // e.g. "/molecules/anions/formate.svg"
  description?: string;
}

export interface AcidData {
  id: string;
  trivialName: string;
  systematicName: string;
  molecularFormula: string;
  category: AcidCategory;
  pubchemCid: number;
  structureAsset: string;
  hasAnionQuiz: boolean;
  anion?: AnionInfo;
  methyleneCount?: number; // 0 for oxalic, 1 for malonic, 2 for succinic, 3 for glutaric, 4 for adipic
  explanation: string;
  distractorIds: string[]; // chemically plausible distractors
}

export type QuestionType =
  | 'structure_to_trivial'     // Type 1
  | 'trivial_to_structure'     // Type 2
  | 'trivial_to_formula'       // Type 3
  | 'formula_to_trivial'       // Type 4
  | 'systematic_to_trivial'    // Type 5
  | 'trivial_to_systematic'    // Type 6
  | 'acid_to_anion'            // Type 7 (only 6 acids)
  | 'anion_to_acid'            // Type 8 (only 6 acids)
  | 'anion_formula_to_name'    // Type 9 (only 6 anions)
  | 'anion_name_to_formula'    // Type 10 (only 6 anions)
  | 'anion_structure_to_name'  // Type 11 (only 6 anions)
  | 'ch2_count_to_acid';       // Type 12 (only Shmyaga 5 acids)

export interface QuizOption {
  id: string;
  text?: string;
  structureAsset?: string;
  formula?: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  acidId: string;
  promptStructureAsset?: string;
  promptFormula?: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface AcidMastery {
  correctAnswers: number;
  wrongAnswers: number;
  streak: number;
  mastery: number; // 0 to 5
  lastSeen?: number;
  nextReview?: number;
  difficultyWeight: number; // higher means needs more review
}

export interface UserStatistics {
  totalAnswers: number;
  correctAnswers: number;
  wrongAnswers: number;
  currentStreak: number;
  bestStreak: number;
  todayAnswers: number;
  lastSessionDate: string;
  categoryAccuracy: {
    names: { correct: number; total: number };
    structures: { correct: number; total: number };
    formulas: { correct: number; total: number };
    anions: { correct: number; total: number };
    shmyaga: { correct: number; total: number };
  };
}

export interface UserSettings {
  soundEnabled: boolean;
  theme: 'light' | 'dark';
  tutorialCompleted: boolean;
  showMnemonics: boolean;
}

export interface AppState {
  perAcidProgress: Record<string, AcidMastery>;
  statistics: UserStatistics;
  settings: UserSettings;
}
