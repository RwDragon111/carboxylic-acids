export type K2TopicId =
  | 'topic1_structure'
  | 'topic2_formulas'
  | 'topic3_nomenclature'
  | 'topic4_isomerism'
  | 'topic5_acidity'
  | 'topic6_reactions'
  | 'topic7_synthesis'
  | 'topic8_derivatives'
  | 'topic9_esters'
  | 'topic10_hydrolysis'
  | 'topic11_fatty_acids'
  | 'topic12_fats_soap';

export interface K2TopicMeta {
  id: K2TopicId;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  icon?: string;
  subsections?: string[];
  estimatedMinutes: number;
  questionCount: number;
}

export interface K2LessonSection {
  title: string;
  content: string; // Markdown / formatted text
  keyFormula?: string;
  structuralScheme?: string; // Formula representation or scheme
  exampleBox?: {
    title: string;
    description: string;
    solution: string;
  };
  trapWarning?: string; // Common mistake to avoid
}

export interface K2Lesson {
  topicId: K2TopicId;
  title: string;
  subtitle: string;
  cheatSheetSummary: string; // Compact 1-2 min version
  sections: K2LessonSection[];
  checkpoints: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  searchKeywords: string[];
}

export type K2QuestionType =
  | 'single_choice'
  | 'multi_choice'
  | 'text_input'
  | 'number_input'
  | 'matching'
  | 'structure_identify'
  | 'name_to_structure'
  | 'reaction_products'
  | 'reaction_coefficients'
  | 'reaction_conditions'
  | 'acidity_sorting'
  | 'find_error'
  | 'ester_to_acid_alcohol'
  | 'reaction_chain'
  | 'calculation';

export type K2Difficulty = 'easy' | 'medium' | 'hard';

export interface K2MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface K2Question {
  id: string;
  topicId: K2TopicId;
  difficulty: K2Difficulty;
  type: K2QuestionType;
  prompt: string;
  subPrompt?: string;
  formulaDisplay?: string;
  structureAsset?: string;
  // Options for single_choice, multi_choice, etc.
  options?: string[];
  correctAnswerSingle?: number; // index of option
  correctAnswerMulti?: number[]; // indices of options
  // For text_input (string or list of accepted synonyms)
  acceptedTextAnswers?: string[];
  requiresStrictIupac?: boolean;
  // For number_input / calculation
  numericAnswer?: {
    value: number;
    tolerance: number; // e.g. 0.05
    unit: string;
  };
  // For matching
  matchingPairs?: K2MatchingPair[];
  // For sorting (acidity / chain)
  sortingItems?: { id: string; label: string; order: number }[];
  // For reaction_coefficients or reaction_products
  reactionData?: {
    reactants: string;
    products: string;
    equation: string;
    coefficientsExplanation?: string;
  };
  // For ester_to_acid_alcohol
  esterDecomposition?: {
    ester: string;
    acidName: string;
    alcoholName: string;
  };
  explanation: string;
  typicalMistake?: string;
  relatedLessonAnchor?: string;
  sourceNote?: string;
}

export interface K2UserAnswerRecord {
  questionId: string;
  topicId: K2TopicId;
  userAnswer: any;
  isCorrect: boolean;
  timestamp: number;
}

export interface K2TopicProgress {
  topicId: K2TopicId;
  lessonRead: boolean;
  questionsAnswered: number;
  questionsCorrect: number;
  masteryPercent: number;
  lastStudiedDate?: string;
}

export interface K2MistakeRecord {
  questionId: string;
  topicId: K2TopicId;
  failCount: number;
  streak: number;
  resolved: boolean;
  lastAttempt?: number;
}

export interface K2ExamAttempt {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  scorePercent: number;
  grade: 5 | 4 | 3 | 2;
  timeSpentSeconds: number;
  answers: Record<string, any>;
  weakTopicIds?: K2TopicId[];
}

export interface K2StorageState {
  version: number;
  topicProgress: Record<K2TopicId, K2TopicProgress>;
  mistakes: Record<string, K2MistakeRecord>;
  history: K2UserAnswerRecord[];
  examAttempts: K2ExamAttempt[];
  activeExamSession?: {
    questionIds: string[];
    answers: Record<string, any>;
    flagged: Record<string, boolean>;
    currentIndex: number;
    timeLeft: number;
  };
}

export type K2ProgressState = K2StorageState;
