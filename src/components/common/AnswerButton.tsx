import React from 'react';
import { QuizOption } from '../../types/chemistry';
import { MoleculeDiagram } from './MoleculeDiagram';
import { Check, X } from 'lucide-react';

export type ButtonStatus = 'default' | 'selected' | 'correct' | 'wrong' | 'revealed';

interface AnswerButtonProps {
  option: QuizOption;
  index: number;
  status: ButtonStatus;
  disabled: boolean;
  onClick: () => void;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  option,
  index,
  status,
  disabled,
  onClick,
}) => {
  const hotkey = index + 1;

  let containerStyles =
    'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 hover:border-emerald-500/60 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 shadow-sm';

  let statusBadge = null;

  if (status === 'selected') {
    containerStyles = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20';
  } else if (status === 'correct' || status === 'revealed') {
    containerStyles = 'bg-emerald-100/90 dark:bg-emerald-900/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30';
    statusBadge = (
      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 ml-auto pl-2">
        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        Верно
      </span>
    );
  } else if (status === 'wrong') {
    containerStyles = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-100 ring-2 ring-red-500/30 animate-shake';
    statusBadge = (
      <span className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 ml-auto pl-2">
        <X className="w-4 h-4 text-red-600 dark:text-red-400" />
        Неверно
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={`Вариант ${hotkey}: ${option.text || option.formula || 'структура'}`}
      className={`relative w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center justify-between group active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        disabled && status === 'default' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      } ${containerStyles}`}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Hotkey number badge */}
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold font-mono border transition-colors ${
            status === 'correct' || status === 'revealed'
              ? 'bg-emerald-500 text-white border-emerald-600'
              : status === 'wrong'
              ? 'bg-red-500 text-white border-red-600'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 group-hover:border-emerald-500/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
          }`}
        >
          {hotkey}
        </span>

        {/* Content: structure image OR text OR formula */}
        {option.structureAsset ? (
          <div className="flex-1 flex justify-center py-1">
            <MoleculeDiagram
              src={option.structureAsset}
              alt="Вариант структуры"
              maxHeight="max-h-24 sm:max-h-28"
              className="w-full max-w-xs"
            />
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            {option.text && (
              <span className="text-base font-medium block truncate">
                {option.text}
              </span>
            )}
            {option.formula && (
              <span className="font-mono text-base font-semibold tracking-wide text-zinc-900 dark:text-zinc-50">
                {option.formula}
              </span>
            )}
          </div>
        )}
      </div>

      {statusBadge}
    </button>
  );
};
