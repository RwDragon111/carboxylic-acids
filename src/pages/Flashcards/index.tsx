import React, { useState } from 'react';
import { ACIDS } from '../../data/acids';
import { AcidMastery } from '../../types/chemistry';
import { MoleculeDiagram } from '../../components/common/MoleculeDiagram';
import { playClickSound, playSuccessSound } from '../../utils/audio';
import { useHotkeys } from '../../hooks/useHotkeys';
import { RotateCw, ChevronLeft, ChevronRight, Check, HelpCircle, X } from 'lucide-react';

interface FlashcardsProps {
  perAcidProgress: Record<string, AcidMastery>;
  onSetManualMastery: (acidId: string, level: number) => void;
  soundEnabled: boolean;
}

export const Flashcards: React.FC<FlashcardsProps> = ({
  perAcidProgress,
  onSetManualMastery,
  soundEnabled,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentAcid = ACIDS[currentIndex];
  const mastery = perAcidProgress[currentAcid.id]?.mastery || 0;

  const handleFlip = () => {
    playClickSound(soundEnabled);
    setIsFlipped(prev => !prev);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev < ACIDS.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : ACIDS.length - 1));
  };

  const handleAnswer = (level: number) => {
    playSuccessSound(soundEnabled);
    onSetManualMastery(currentAcid.id, level);
    handleNext();
  };

  useHotkeys({
    onSpace: handleFlip,
    enabled: true,
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6 animate-fade">
      {/* Header / counter */}
      <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        <span>Карточка {currentIndex + 1} из {ACIDS.length}</span>
        <span className="font-mono">Уровень знания: {mastery} / 5</span>
      </div>

      {/* Flip card container */}
      <div
        onClick={handleFlip}
        className="w-full h-96 cursor-pointer perspective-1000 select-none group"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Face: Structural Formula */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between items-center shadow-lg group-hover:border-emerald-500/50 transition-colors">
            <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
              Назовите кислоту по структуре
            </span>

            <div className="w-full flex-1 flex items-center justify-center my-2">
              <MoleculeDiagram
                src={currentAcid.structureAsset}
                alt="Структурная формула"
                maxHeight="max-h-56"
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Нажмите или [Пробел], чтобы перевернуть</span>
            </div>
          </div>

          {/* Back Face: Names, Formula & Anion */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white dark:bg-zinc-900 border-2 border-emerald-500/40 rounded-3xl p-6 flex flex-col justify-between text-center shadow-xl">
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
              Ответ
            </span>

            <div className="space-y-3 my-auto">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {currentAcid.trivialName}
              </h3>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {currentAcid.systematicName}
              </p>

              <div className="inline-block font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-1.5 rounded-xl border border-emerald-500/30">
                {currentAcid.molecularFormula}
              </div>

              {currentAcid.hasAnionQuiz && currentAcid.anion && (
                <div className="pt-2 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="font-bold">Анион: </span>
                  <span>{currentAcid.anion.name}</span>
                  <span className="font-mono ml-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    ({currentAcid.anion.formula})
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-zinc-400">
              Оцените, насколько хорошо вы помните это вещество
            </p>
          </div>
        </div>
      </div>

      {/* Answer Buttons (Не знаю / Сомневаюсь / Знаю) */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleAnswer(1)}
          className="py-3 px-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-500/30 text-red-700 dark:text-red-300 font-semibold text-xs sm:text-sm hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center gap-1.5 transition-colors active:scale-95"
        >
          <X className="w-4 h-4 text-red-500" />
          <span>Не знаю</span>
        </button>

        <button
          onClick={() => handleAnswer(3)}
          className="py-3 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold text-xs sm:text-sm hover:bg-amber-100 dark:hover:bg-amber-900/40 flex items-center justify-center gap-1.5 transition-colors active:scale-95"
        >
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>Сомневаюсь</span>
        </button>

        <button
          onClick={() => handleAnswer(5)}
          className="py-3 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-colors active:scale-95"
        >
          <Check className="w-4 h-4" />
          <span>Знаю</span>
        </button>
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Предыдущая</span>
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1"
        >
          <span>Следующая</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
