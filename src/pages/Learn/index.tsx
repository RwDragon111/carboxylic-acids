import React, { useState } from 'react';
import { ACIDS } from '../../data/acids';
import { AcidCard } from '../../components/chemistry/AcidCard';
import { AcidMastery } from '../../types/chemistry';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { playClickSound, playSuccessSound } from '../../utils/audio';

interface LearnProps {
  perAcidProgress: Record<string, AcidMastery>;
  onSetManualMastery: (acidId: string, level: number) => void;
  soundEnabled: boolean;
}

export const Learn: React.FC<LearnProps> = ({
  perAcidProgress,
  onSetManualMastery,
  soundEnabled,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hideName, setHideName] = useState(false);
  const [hideFormula, setHideFormula] = useState(false);
  const [hideExplanation, setHideExplanation] = useState(false);

  const currentAcid = ACIDS[currentIndex];
  const mastery = perAcidProgress[currentAcid.id];

  const handlePrev = () => {
    playClickSound(soundEnabled);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : ACIDS.length - 1));
  };

  const handleNext = () => {
    playClickSound(soundEnabled);
    setCurrentIndex(prev => (prev < ACIDS.length - 1 ? prev + 1 : 0));
  };

  const handleMemorized = () => {
    playSuccessSound(soundEnabled);
    onSetManualMastery(currentAcid.id, 5);
    handleNext();
  };

  const handleRepeat = () => {
    playClickSound(soundEnabled);
    onSetManualMastery(currentAcid.id, 1);
    handleNext();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Кислота {currentIndex + 1} из {ACIDS.length}
          </span>
          <div className="flex gap-1">
            {ACIDS.map((a, i) => (
              <button
                key={a.id}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setCurrentIndex(i);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentIndex
                    ? 'w-6 bg-emerald-500'
                    : (perAcidProgress[a.id]?.mastery || 0) >= 3
                    ? 'bg-emerald-400/50 dark:bg-emerald-600/50'
                    : 'bg-zinc-200 dark:bg-zinc-700'
                }`}
                title={a.trivialName}
                aria-label={`Перейти к ${a.trivialName}`}
              />
            ))}
          </div>
        </div>

        {/* Hide/Show Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHideName(v => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              hideName
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
            }`}
            title="Скрыть/показать название"
          >
            {hideName ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Название</span>
          </button>

          <button
            onClick={() => setHideFormula(v => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              hideFormula
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
            }`}
            title="Скрыть/показать формулу"
          >
            {hideFormula ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Формула</span>
          </button>

          <button
            onClick={() => setHideExplanation(v => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              hideExplanation
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
            }`}
            title="Скрыть/показать объяснение"
          >
            {hideExplanation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Подсказка</span>
          </button>
        </div>
      </div>

      {/* Main Acid Card */}
      <AcidCard
        acid={currentAcid}
        mastery={mastery}
        hideDetails={{
          name: hideName,
          formula: hideFormula,
          explanation: hideExplanation,
        }}
        showAnionDetails={true}
        className="border-2"
      />

      {/* Bottom Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={handlePrev}
          className="py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-center gap-1.5 transition-colors active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        <button
          onClick={handleRepeat}
          className="py-3 px-4 rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/40 flex items-center justify-center gap-1.5 transition-colors active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Повторить</span>
        </button>

        <button
          onClick={handleMemorized}
          className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-colors active:scale-95"
        >
          <Check className="w-4 h-4" />
          <span>Запомнил</span>
        </button>

        <button
          onClick={handleNext}
          className="py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-center gap-1.5 transition-colors active:scale-95"
        >
          <span>Далее</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
