import React, { useState } from 'react';
import { Eye, RefreshCw, Trophy, ArrowRight, Check, X } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Узнавай кислоты по структуре',
      description:
        'Изучай наглядные структурные формулы в классическом школьном стиле: явно видны C=O двумя линиями, группы OH, CH2, CH3 и бензольные кольца.',
      icon: <Eye className="w-12 h-12 text-emerald-500" />,
    },
    {
      title: 'Повторяй то, где ошибаешься',
      description:
        'Адаптивный алгоритм отслеживает твои затруднения. Кислоты с частыми ошибками появляются чаще, пока ты надёжно их не закрепишь.',
      icon: <RefreshCw className="w-12 h-12 text-emerald-500" />,
    },
    {
      title: 'Дойди до 100%',
      description:
        'Пройди режим «Шмяга» для дикарбоновых кислот, запомни 6 ключевых анионов, сопоставляй пары и сдай итоговый Экзамен на 20 вопросов!',
      icon: <Trophy className="w-12 h-12 text-emerald-500" />,
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center">
          {current.icon}
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center gap-1.5 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-8 bg-emerald-500'
                  : 'w-2 bg-zinc-200 dark:bg-zinc-700'
              }`}
            />
          ))}
        </div>

        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          {current.title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
          {current.description}
        </p>

        <button
          onClick={handleNext}
          className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
        >
          {isLast ? (
            <>
              <Check className="w-5 h-5" />
              <span>Начать</span>
            </>
          ) : (
            <>
              <span>Далее</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
