import { AcidData } from '../types/chemistry';

export const ACIDS: AcidData[] = [
  {
    id: 'formic',
    trivialName: 'Муравьиная кислота',
    systematicName: 'Метановая кислота',
    molecularFormula: 'HCOOH',
    category: 'monocarboxylic',
    pubchemCid: 284,
    structureAsset: './molecules/acids/formic.svg',
    hasAnionQuiz: true,
    anion: {
      name: 'формиат',
      formula: 'HCOO⁻',
      structureAsset: './molecules/anions/formate.svg',
      description: 'Анион муравьиной (метановой) кислоты при отщеплении единственного кислого протона.'
    },
    explanation: 'Муравьиная (метановая) кислота — простейшая карбоновая кислота, где карбоксильная группа связана непосредственно с атомом водорода H–COOH.',
    distractorIds: ['acetic', 'oxalic', 'lactic']
  },
  {
    id: 'acetic',
    trivialName: 'Уксусная кислота',
    systematicName: 'Этановая кислота',
    molecularFormula: 'CH3COOH',
    category: 'monocarboxylic',
    pubchemCid: 176,
    structureAsset: './molecules/acids/acetic.svg',
    hasAnionQuiz: true,
    anion: {
      name: 'ацетат',
      formula: 'CH3COO⁻',
      structureAsset: './molecules/anions/acetate.svg',
      description: 'Анион уксусной (этановой) кислоты: метильная группа связана с карбоксилат-ионом CH3–COO⁻.'
    },
    explanation: 'Уксусная (этановая) кислота содержит одну метильную группу CH3, соединенную с карбоксильной группой: CH3–COOH.',
    distractorIds: ['formic', 'lactic', 'malonic']
  },
  {
    id: 'lactic',
    trivialName: 'Молочная кислота',
    systematicName: '2-гидроксипропановая кислота',
    molecularFormula: 'C3H6O3',
    category: 'hydroxy',
    pubchemCid: 612,
    structureAsset: './molecules/acids/lactic.svg',
    hasAnionQuiz: true,
    anion: {
      name: 'лактат',
      formula: 'C3H5O3⁻',
      structureAsset: './molecules/anions/lactate.svg',
      description: 'Анион молочной кислоты CH3–CH(OH)–COO⁻.'
    },
    explanation: 'Молочная кислота — гидроксикислота: содержит карбоксильную группу –COOH и гидроксильную группу –OH при втором атоме углерода (2-гидроксипропановая кислота).',
    distractorIds: ['acetic', 'salicylic', 'malonic']
  },
  {
    id: 'benzoic',
    trivialName: 'Бензойная кислота',
    systematicName: 'Бензойная кислота',
    molecularFormula: 'C7H6O2',
    category: 'aromatic',
    pubchemCid: 243,
    structureAsset: './molecules/acids/benzoic.svg',
    hasAnionQuiz: true,
    anion: {
      name: 'бензоат',
      formula: 'C7H5O2⁻',
      structureAsset: './molecules/anions/benzoate.svg',
      description: 'Анион бензойной кислоты C6H5–COO⁻.'
    },
    explanation: 'Бензойная кислота — простейшая ароматическая монокарбоновая кислота, где карбоксильная группа –COOH напрямую связана с бензольным кольцом C6H5–COOH.',
    distractorIds: ['salicylic', 'phthalic', 'terephthalic']
  },
  {
    id: 'salicylic',
    trivialName: 'Салициловая кислота',
    systematicName: '2-гидроксибензойная кислота',
    molecularFormula: 'C7H6O3',
    category: 'aromatic',
    pubchemCid: 338,
    structureAsset: './molecules/acids/salicylic.svg',
    hasAnionQuiz: true,
    anion: {
      name: 'салицилат',
      formula: 'C7H5O3⁻',
      structureAsset: './molecules/anions/salicylate.svg',
      description: 'Анион салициловой кислоты при отщеплении протона карбоксильной группы: C6H4(OH)COO⁻.'
    },
    explanation: 'Салициловая кислота содержит бензольное кольцо с гидроксильной группой –OH и карбоксильной группой –COOH в соседних 1,2-положениях (орто-положение).',
    distractorIds: ['benzoic', 'phthalic', 'lactic']
  },
  {
    id: 'phthalic',
    trivialName: 'Фталевая кислота',
    systematicName: 'бензол-1,2-дикарбоновая кислота',
    molecularFormula: 'C8H6O4',
    category: 'aromatic',
    pubchemCid: 1017,
    structureAsset: './molecules/acids/phthalic.svg',
    hasAnionQuiz: false, // Strict: do NOT quiz anion!
    explanation: 'Фталевая кислота содержит две карбоксильные группы –COOH в соседних 1,2-положениях бензольного кольца (орто-дикарбоновая).',
    distractorIds: ['terephthalic', 'benzoic', 'salicylic']
  },
  {
    id: 'terephthalic',
    trivialName: 'Терефталевая кислота',
    systematicName: 'бензол-1,4-дикарбоновая кислота',
    molecularFormula: 'C8H6O4',
    category: 'aromatic',
    pubchemCid: 7489,
    structureAsset: './molecules/acids/terephthalic.svg',
    hasAnionQuiz: false, // Strict: do NOT quiz anion!
    explanation: 'Терефталевая кислота содержит две карбоксильные группы –COOH строго напротив друг друга в 1,4-положениях бензольного кольца (пара-дикарбоновая).',
    distractorIds: ['phthalic', 'benzoic', 'adipic']
  },
  {
    id: 'oxalic',
    trivialName: 'Щавелевая кислота',
    systematicName: 'Этандиовая кислота',
    molecularFormula: 'H2C2O4',
    category: 'dicarboxylic',
    pubchemCid: 971,
    methyleneCount: 0,
    structureAsset: './molecules/acids/oxalic.svg',
    hasAnionQuiz: true,
    anion: {
      name: 'оксалат',
      formula: 'C2O4²⁻',
      structureAsset: './molecules/anions/oxalate.svg',
      description: 'Двухзарядный анион щавелевой кислоты ⁻OOC–COO⁻.'
    },
    explanation: 'Щавелевая кислота — простейшая дикарбоновая кислота (ряд Шмяга: 0 групп CH2), в которой две группы –COOH связаны непосредственно друг с другом: HOOC–COOH.',
    distractorIds: ['malonic', 'succinic', 'formic']
  },
  {
    id: 'malonic',
    trivialName: 'Малоновая кислота',
    systematicName: 'Пропандиовая кислота',
    molecularFormula: 'C3H4O4',
    category: 'dicarboxylic',
    pubchemCid: 867,
    methyleneCount: 1,
    structureAsset: './molecules/acids/malonic.svg',
    hasAnionQuiz: false, // Strict: do NOT quiz anion!
    explanation: 'Малоновая кислота (ряд Шмяга: 1 группа CH2) содержит одну метиленовую группу между карбоксилами: HOOC–CH2–COOH.',
    distractorIds: ['oxalic', 'succinic', 'glutaric']
  },
  {
    id: 'succinic',
    trivialName: 'Янтарная кислота',
    systematicName: 'Бутандиовая кислота',
    molecularFormula: 'C4H6O4',
    category: 'dicarboxylic',
    pubchemCid: 1110,
    methyleneCount: 2,
    structureAsset: './molecules/acids/succinic.svg',
    hasAnionQuiz: false, // Strict: do NOT quiz anion!
    explanation: 'Янтарная кислота (ряд Шмяга: 2 группы CH2) содержит цепочку из двух групп CH2 между карбоксилами: HOOC–(CH2)2–COOH.',
    distractorIds: ['malonic', 'glutaric', 'adipic']
  },
  {
    id: 'glutaric',
    trivialName: 'Глутаровая кислота',
    systematicName: 'Пентандиовая кислота',
    molecularFormula: 'C5H8O4',
    category: 'dicarboxylic',
    pubchemCid: 743,
    methyleneCount: 3,
    structureAsset: './molecules/acids/glutaric.svg',
    hasAnionQuiz: false, // Strict: do NOT quiz anion!
    explanation: 'Глутаровая кислота (ряд Шмяга: 3 группы CH2) содержит три метиленовые группы между карбоксилами: HOOC–(CH2)3–COOH.',
    distractorIds: ['succinic', 'adipic', 'malonic']
  },
  {
    id: 'adipic',
    trivialName: 'Адипиновая кислота',
    systematicName: 'Гександиовая кислота',
    molecularFormula: 'C6H10O4',
    category: 'dicarboxylic',
    pubchemCid: 196,
    methyleneCount: 4,
    structureAsset: './molecules/acids/adipic.svg',
    hasAnionQuiz: false, // Strict: do NOT quiz anion!
    explanation: 'Адипиновая кислота (ряд Шмяга: 4 группы CH2) содержит четыре метиленовые группы между карбоксилами: HOOC–(CH2)4–COOH.',
    distractorIds: ['glutaric', 'succinic', 'terephthalic']
  }
];

export const SHMYAGA_ACID_IDS = ['oxalic', 'malonic', 'succinic', 'glutaric', 'adipic'];

export const ANION_ACID_IDS = ['formic', 'acetic', 'lactic', 'benzoic', 'salicylic', 'oxalic'];

export function getAcidById(id: string): AcidData | undefined {
  return ACIDS.find(a => a.id === id);
}
