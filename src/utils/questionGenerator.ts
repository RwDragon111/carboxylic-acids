import { ACIDS, ANION_ACID_IDS, SHMYAGA_ACID_IDS, getAcidById } from '../data/acids';
import { AcidData, AcidMastery, QuestionType, QuizOption, QuizQuestion } from '../types/chemistry';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Select an acid based on adaptive difficulty weights
export function selectWeightedAcid(
  acidsList: AcidData[],
  perAcidProgress?: Record<string, AcidMastery>
): AcidData {
  if (!perAcidProgress) {
    return acidsList[Math.floor(Math.random() * acidsList.length)];
  }

  const weights = acidsList.map(a => {
    const p = perAcidProgress[a.id];
    return p ? p.difficultyWeight : 1.0;
  });

  const totalWeight = weights.reduce((acc, w) => acc + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < acidsList.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return acidsList[i];
    }
  }

  return acidsList[0];
}

// Get 3 plausible distractors for a given acid
function getDistractorAcids(target: AcidData, pool: AcidData[]): AcidData[] {
  const chosen: AcidData[] = [];

  // First pick from specific distractorIds if present in pool
  for (const distId of target.distractorIds) {
    const dist = pool.find(a => a.id === distId && a.id !== target.id);
    if (dist && !chosen.some(c => c.id === dist.id)) {
      chosen.push(dist);
      if (chosen.length === 3) break;
    }
  }

  // If still need more, pick from same category or random
  if (chosen.length < 3) {
    const sameCat = pool.filter(a => a.category === target.category && a.id !== target.id && !chosen.some(c => c.id === a.id));
    for (const a of shuffle(sameCat)) {
      chosen.push(a);
      if (chosen.length === 3) break;
    }
  }

  // If still need more, pick from remaining pool
  if (chosen.length < 3) {
    const remaining = pool.filter(a => a.id !== target.id && !chosen.some(c => c.id === a.id));
    for (const a of shuffle(remaining)) {
      chosen.push(a);
      if (chosen.length === 3) break;
    }
  }

  return chosen.slice(0, 3);
}

export function generateQuestion(
  preferredType?: QuestionType,
  targetAcidId?: string,
  perAcidProgress?: Record<string, AcidMastery>
): QuizQuestion {
  const anionAcids = ACIDS.filter(a => ANION_ACID_IDS.includes(a.id) && a.hasAnionQuiz && a.anion);
  const shmyagaAcids = ACIDS.filter(a => SHMYAGA_ACID_IDS.includes(a.id) && a.methyleneCount !== undefined);

  // Available question types
  const allTypes: QuestionType[] = [
    'structure_to_trivial',
    'trivial_to_structure',
    'trivial_to_formula',
    'formula_to_trivial',
    'systematic_to_trivial',
    'trivial_to_systematic',
    'acid_to_anion',
    'anion_to_acid',
    'anion_formula_to_name',
    'anion_name_to_formula',
    'anion_structure_to_name',
    'ch2_count_to_acid',
  ];

  const type = preferredType || allTypes[Math.floor(Math.random() * allTypes.length)];

  // Choose appropriate target acid depending on question constraints
  let target: AcidData;
  if (targetAcidId) {
    target = getAcidById(targetAcidId) || ACIDS[0];
  } else if (
    type === 'acid_to_anion' ||
    type === 'anion_to_acid' ||
    type === 'anion_formula_to_name' ||
    type === 'anion_name_to_formula' ||
    type === 'anion_structure_to_name'
  ) {
    target = selectWeightedAcid(anionAcids, perAcidProgress);
  } else if (type === 'ch2_count_to_acid') {
    target = selectWeightedAcid(shmyagaAcids, perAcidProgress);
  } else {
    target = selectWeightedAcid(ACIDS, perAcidProgress);
  }

  const distractors = getDistractorAcids(
    target,
    (type.startsWith('anion') || type === 'acid_to_anion') ? anionAcids :
    type === 'ch2_count_to_acid' ? shmyagaAcids : ACIDS
  );

  const qId = `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  switch (type) {
    case 'structure_to_trivial': {
      const options: QuizOption[] = shuffle([
        { id: target.id, text: target.trivialName },
        ...distractors.map(d => ({ id: d.id, text: d.trivialName })),
      ]);
      return {
        id: qId,
        type,
        acidId: target.id,
        prompt: 'Какая карбоновая кислота изображена на структурной формуле?',
        promptStructureAsset: target.structureAsset,
        options,
        correctOptionId: target.id,
        explanation: target.explanation,
      };
    }

    case 'trivial_to_structure': {
      const options: QuizOption[] = shuffle([
        { id: target.id, structureAsset: target.structureAsset, text: 'Вариант' },
        ...distractors.map(d => ({ id: d.id, structureAsset: d.structureAsset, text: 'Вариант' })),
      ]);
      return {
        id: qId,
        type,
        acidId: target.id,
        prompt: `Выберите структурную формулу: ${target.trivialName}`,
        options,
        correctOptionId: target.id,
        explanation: target.explanation,
      };
    }

    case 'trivial_to_formula': {
      const options: QuizOption[] = shuffle([
        { id: target.id, formula: target.molecularFormula },
        ...distractors.map(d => ({ id: d.id, formula: d.molecularFormula })),
      ]);
      return {
        id: qId,
        type,
        acidId: target.id,
        prompt: `Укажите молекулярную формулу: ${target.trivialName}`,
        options,
        correctOptionId: target.id,
        explanation: `Молекулярная формула ${target.trivialName.toLowerCase()} — ${target.molecularFormula}. ${target.explanation}`,
      };
    }

    case 'formula_to_trivial': {
      const options: QuizOption[] = shuffle([
        { id: target.id, text: target.trivialName },
        ...distractors.map(d => ({ id: d.id, text: d.trivialName })),
      ]);
      return {
        id: qId,
        type,
        acidId: target.id,
        prompt: 'Какой кислоте соответствует молекулярная формула?',
        promptFormula: target.molecularFormula,
        options,
        correctOptionId: target.id,
        explanation: `Формуле ${target.molecularFormula} соответствует ${target.trivialName}. ${target.explanation}`,
      };
    }

    case 'systematic_to_trivial': {
      const options: QuizOption[] = shuffle([
        { id: target.id, text: target.trivialName },
        ...distractors.map(d => ({ id: d.id, text: d.trivialName })),
      ]);
      return {
        id: qId,
        type,
        acidId: target.id,
        prompt: `Укажите тривиальное название для кислоты: «${target.systematicName}»`,
        options,
        correctOptionId: target.id,
        explanation: `Систематическое название «${target.systematicName}» соответствует тривиальному названию «${target.trivialName}».`,
      };
    }

    case 'trivial_to_systematic': {
      const options: QuizOption[] = shuffle([
        { id: target.id, text: target.systematicName },
        ...distractors.map(d => ({ id: d.id, text: d.systematicName })),
      ]);
      return {
        id: qId,
        type,
        acidId: target.id,
        prompt: `Каково систематическое (ИЮПАК) название для: «${target.trivialName}»?`,
        options,
        correctOptionId: target.id,
        explanation: `Тривиальному названию «${target.trivialName}» соответствует систематическое «${target.systematicName}».`,
      };
    }

    case 'acid_to_anion': {
      const targetAnion = target.anion!;
      const anionDistractors = distractors.filter(d => d.anion).map(d => ({
        id: d.id,
        text: d.anion!.name,
      }));
      const options: QuizOption[] = shuffle([
        { id: target.id, text: targetAnion.name },
        ...anionDistractors,
      ]);
      return {
        id: qId,
        type,
        acidId: target.id,
        prompt: `Как называется анион кислоты: ${target.trivialName}?`,
        options,
        correctOptionId: target.id,
        explanation: `Анион ${target.trivialName.toLowerCase()} называется «${targetAnion.name}» (${targetAnion.formula}). ${targetAnion.description || ''}`,
      };
    }

    case 'anion_to_acid': {
      const targetAnion = target.anion!;
      const options: QuizOption[] = shuffle([
        { id: target.id, text: target.trivialName },
        ...distractors.map(d => ({ id: d.id, text: d.trivialName })),
      ]);
      return {
        id: qId,
        type,
        acidId: target.id,
        prompt: `Аниону «${targetAnion.name}» (${targetAnion.formula}) соответствует какая кислота?`,
        options,
        correctOptionId: target.id,
        explanation: `Анион «${targetAnion.name}» образуется при диссоциации ${target.trivialName.toLowerCase()}.`,
      };
    }

    case 'anion_formula_to_name': {
      const targetAnion = target.anion!;
      const anionDistractors = distractors.filter(d => d.anion).map(d => ({
        id: d.id,
        text: d.anion!.name,
      }));
      const options: QuizOption[] = shuffle([
        { id: target.id, text: targetAnion.name },
        ...anionDistractors,
      ]);
      return {
        id: qId,
        type,
        acidId: target.id,
        prompt: 'Как называется анион с формулой:',
        promptFormula: targetAnion.formula,
        options,
        correctOptionId: target.id,
        explanation: `Формула ${targetAnion.formula} принадлежит аниону «${targetAnion.name}» (${target.trivialName}).`,
      };
    }

    case 'anion_name_to_formula': {
      const targetAnion = target.anion!;
      const anionDistractors = distractors.filter(d => d.anion).map(d => ({
        id: d.id,
        formula: d.anion!.formula,
      }));
      const options: QuizOption[] = shuffle([
        { id: target.id, formula: targetAnion.formula },
        ...anionDistractors,
      ]);
      return {
        id: qId,
        type,
        acidId: target.id,
        prompt: `Укажите химическую формулу аниона: «${targetAnion.name}»`,
        options,
        correctOptionId: target.id,
        explanation: `Формула аниона «${targetAnion.name}» — ${targetAnion.formula}.`,
      };
    }

    case 'anion_structure_to_name': {
      const targetAnion = target.anion!;
      const anionDistractors = distractors.filter(d => d.anion).map(d => ({
        id: d.id,
        text: d.anion!.name,
      }));
      const options: QuizOption[] = shuffle([
        { id: target.id, text: targetAnion.name },
        ...anionDistractors,
      ]);
      return {
        id: qId,
        type,
        acidId: target.id,
        prompt: 'Какой анион изображен на структурной формуле?',
        promptStructureAsset: targetAnion.structureAsset,
        options,
        correctOptionId: target.id,
        explanation: `Это структура аниона «${targetAnion.name}» (${targetAnion.formula}) от ${target.trivialName.toLowerCase()}.`,
      };
    }

    case 'ch2_count_to_acid': {
      const count = target.methyleneCount ?? 0;
      const shmyagaDistractors = distractors.filter(d => d.methyleneCount !== undefined);
      const options: QuizOption[] = shuffle([
        { id: target.id, text: target.trivialName },
        ...shmyagaDistractors.map(d => ({ id: d.id, text: d.trivialName })),
      ]);
      return {
        id: qId,
        type,
        acidId: target.id,
        prompt: `Какая дикарбоновая кислота содержит ровно ${count} ${count === 1 ? 'группу' : count >= 2 && count <= 4 ? 'группы' : 'групп'} CH2 между карбоксилами?`,
        options,
        correctOptionId: target.id,
        explanation: `Ряд Шмяга (Щ-М-Я-Г-А: 0-1-2-3-4 CH2): ${target.trivialName} содержит ровно ${count} CH2. ${target.explanation}`,
      };
    }
  }
}

export function generateQuizSession(
  count: number,
  perAcidProgress?: Record<string, AcidMastery>
): QuizQuestion[] {
  const session: QuizQuestion[] = [];
  const usedTypes = new Set<QuestionType>();

  for (let i = 0; i < count; i++) {
    // Alternate question types to provide variety
    const question = generateQuestion(undefined, undefined, perAcidProgress);
    session.push(question);
    usedTypes.add(question.type);
  }

  return session;
}

export function generateExamSession(): QuizQuestion[] {
  // Exam has exactly 20 questions covering all 12 acids + anions + shmyaga
  return generateQuizSession(20);
}
