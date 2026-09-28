export function normalizeRussianText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[«»""''`,.;!?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function checkTextAnswer(
  userInput: string,
  acceptedList: string[],
  requiresStrictIupac = false
): { isCorrect: boolean; feedback?: string } {
  const normInput = normalizeRussianText(userInput);
  if (!normInput) return { isCorrect: false, feedback: 'Ответ не введен' };

  for (const accepted of acceptedList) {
    const normAccepted = normalizeRussianText(accepted);
    if (normInput === normAccepted) {
      return { isCorrect: true };
    }

    // Also accept without the trailing word "кислота" if user omitted it
    const strippedInput = normInput.replace(/\s*кислота$/, '').trim();
    const strippedAccepted = normAccepted.replace(/\s*кислота$/, '').trim();
    if (strippedInput === strippedAccepted && strippedInput.length > 2) {
      return { isCorrect: true };
    }
  }

  // Check if user entered trivial name when IUPAC was strictly requested
  if (requiresStrictIupac) {
    const commonTrivialPairs: Record<string, string> = {
      'муравьиная': 'метановая',
      'уксусная': 'этановая',
      'пропионовая': 'пропановая',
      'масляная': 'бутановая',
      'валериановая': 'пентановая',
      'капроновая': 'гексановая',
      'щавелевая': 'этандиовая',
      'малоновая': 'пропандиовая',
      'янтарная': 'бутандиовая',
      'глутаровая': 'пентандиовая',
      'адипиновая': 'гександиовая',
    };
    for (const [triv, iupac] of Object.entries(commonTrivialPairs)) {
      if (normInput.includes(triv)) {
        return {
          isCorrect: false,
          feedback: `Вы указали тривиальное название («${triv}»). В задании требуется систематическое по ИЮПАК («${iupac} кислота»).`,
        };
      }
    }
  }

  return { isCorrect: false };
}

export function checkNumericAnswer(
  userInput: string | number,
  targetValue: number,
  tolerance = 0.05
): { isCorrect: boolean; userValue?: number } {
  const cleanStr = String(userInput).replace(',', '.').replace(/[^\d.-]/g, '').trim();
  const val = parseFloat(cleanStr);
  if (isNaN(val)) return { isCorrect: false };

  // Check absolute or relative tolerance
  const diff = Math.abs(val - targetValue);
  const maxAllowed = Math.max(tolerance, Math.abs(targetValue) * 0.03); // at least 3% tolerance or absolute tolerance
  return {
    isCorrect: diff <= maxAllowed,
    userValue: val,
  };
}

export function checkMultiChoice(
  selectedIndices: number[],
  correctIndices: number[]
): boolean {
  if (selectedIndices.length !== correctIndices.length) return false;
  const s1 = new Set(selectedIndices);
  return correctIndices.every(idx => s1.has(idx));
}

export function checkMatching(
  userMatches: Record<string, string>, // leftId -> rightId
  correctPairs: { id: string; left: string; right: string }[]
): boolean {
  return correctPairs.every(pair => userMatches[pair.id] === pair.id);
}

export function checkSorting(
  items: { id: string; order: number }[]
): boolean {
  for (let i = 0; i < items.length - 1; i++) {
    if (items[i].order > items[i + 1].order) return false;
  }
  return true;
}
