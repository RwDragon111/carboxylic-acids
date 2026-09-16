import React from 'react';
import { ArrowDown } from 'lucide-react';

export const AnionMechanism: React.FC = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        Как образуются анионы карбоновых кислот?
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
        Карбоксильная группа <span className="font-semibold text-zinc-800 dark:text-zinc-200">–COOH</span> обладает кислотными свойствами из-за сильной поляризации связи O–H. При диссоциации или взаимодействии с основаниями отщепляется катион водорода <span className="font-mono text-emerald-600 dark:text-emerald-400">H⁺</span>, а на кислороде остаётся отрицательный заряд.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monocarboxylic Mechanism */}
        <div className="flex flex-col items-center bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
          <span className="text-xs font-semibold uppercase text-zinc-400 mb-3 tracking-wider">
            Монокарбоновые кислоты
          </span>
          <div className="font-mono text-base font-bold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm">
            R — C(=O) — OH
          </div>
          <div className="my-2 flex flex-col items-center text-emerald-600 dark:text-emerald-400">
            <ArrowDown className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
              − H⁺
            </span>
          </div>
          <div className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 rounded-lg border border-emerald-500/30 shadow-sm">
            R — C(=O) — O⁻
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
            Формиат, ацетат, лактат, бензоат, салицилат
          </span>
        </div>

        {/* Oxalic Acid Mechanism */}
        <div className="flex flex-col items-center bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
          <span className="text-xs font-semibold uppercase text-zinc-400 mb-3 tracking-wider">
            Щавелевая кислота (дикарбоновая)
          </span>
          <div className="font-mono text-base font-bold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm">
            HOOC — COOH
          </div>
          <div className="my-2 flex flex-col items-center text-emerald-600 dark:text-emerald-400">
            <ArrowDown className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
              − 2 H⁺
            </span>
          </div>
          <div className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 rounded-lg border border-emerald-500/30 shadow-sm">
            ⁻OOC — COO⁻ (C2O4²⁻)
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
            Оксалат (двухзарядный анион)
          </span>
        </div>
      </div>
    </div>
  );
};
