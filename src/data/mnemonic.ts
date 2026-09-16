export interface ShmyagaItem {
  id: string;
  letter: string;
  word: string;
  name: string;
  ch2Count: number;
  formula: string;
  structureAsset: string;
}

export const SHMYAGA_MNEMONIC: ShmyagaItem[] = [
  {
    id: 'oxalic',
    letter: 'Щ',
    word: 'Ща',
    name: 'Щавелевая',
    ch2Count: 0,
    formula: 'HOOC–COOH',
    structureAsset: './molecules/acids/oxalic.svg',
  },
  {
    id: 'malonic',
    letter: 'М',
    word: 'Мама',
    name: 'Малоновая',
    ch2Count: 1,
    formula: 'HOOC–CH2–COOH',
    structureAsset: './molecules/acids/malonic.svg',
  },
  {
    id: 'succinic',
    letter: 'Я',
    word: 'Ягоды',
    name: 'Янтарная',
    ch2Count: 2,
    formula: 'HOOC–(CH2)2–COOH',
    structureAsset: './molecules/acids/succinic.svg',
  },
  {
    id: 'glutaric',
    letter: 'Г',
    word: 'Готовит',
    name: 'Глутаровая',
    ch2Count: 3,
    formula: 'HOOC–(CH2)3–COOH',
    structureAsset: './molecules/acids/glutaric.svg',
  },
  {
    id: 'adipic',
    letter: 'А',
    word: 'Ане',
    name: 'Адипиновая',
    ch2Count: 4,
    formula: 'HOOC–(CH2)4–COOH',
    structureAsset: './molecules/acids/adipic.svg',
  },
];

export const MNEMONIC_PHRASE = '«Ща Мама Ягоды Готовит Ане»';
