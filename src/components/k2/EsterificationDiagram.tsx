import React, { useState } from 'react';
import { Sparkles, ArrowRight, RefreshCw, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

export const EsterificationDiagram: React.FC = () => {
  const [showIsotope, setShowIsotope] = useState(false);
  const [mode, setMode] = useState<'acidic' | 'alkaline'>('acidic');

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              Интерактивная схема
            </span>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
              Механизм этерификации и гидролиза
            </h3>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Наглядно: откуда уходит вода и почему омыление необратимо
          </p>
        </div>

        {/* Buttons / Toggles */}
        <div className="flex items-center gap-2">
          {/* Mode Selector */}
          <div className="inline-flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setMode('acidic')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === 'acidic'
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              Кислотная (обратимо)
            </button>
            <button
              onClick={() => setMode('alkaline')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === 'alkaline'
                  ? 'bg-white dark:bg-zinc-700 text-amber-600 dark:text-amber-300 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              Щелочная (омыление)
            </button>
          </div>

          {/* Isotope Toggle */}
          {mode === 'acidic' && (
            <button
              onClick={() => setShowIsotope(!showIsotope)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                showIsotope
                  ? 'bg-purple-500 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                  : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-purple-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Меченый атом ¹⁸O</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Chemical Diagram */}
      {mode === 'acidic' ? (
        <div className="space-y-4">
          <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <div className="min-w-[620px] flex items-center justify-between text-center font-mono">
              {/* Reactant 1: Carboxylic Acid */}
              <div className="flex flex-col items-center bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900/50 rounded-xl p-3 shadow-sm">
                <span className="text-[11px] font-sans font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  Уксусная кислота
                </span>
                <div className="flex items-center text-lg sm:text-xl font-bold">
                  <span className="text-blue-600 dark:text-blue-400">CH₃—C(=O)</span>
                  <span className="text-zinc-400 mx-0.5">—</span>
                  <span className="bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700/60">
                    OH
                  </span>
                </div>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-sans">
                  Отщепляет OH-группу!
                </span>
              </div>

              {/* Plus Sign */}
              <span className="text-xl font-bold text-zinc-400 px-2">+</span>

              {/* Reactant 2: Alcohol */}
              <div className="flex flex-col items-center bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-3 shadow-sm">
                <span className="text-[11px] font-sans font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  Этиловый спирт
                </span>
                <div className="flex items-center text-lg sm:text-xl font-bold">
                  <span className="bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700/60">
                    H
                  </span>
                  <span className="text-zinc-400 mx-0.5">—</span>
                  <span
                    className={`px-1.5 py-0.5 rounded border transition-colors ${
                      showIsotope
                        ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-400 animate-pulse font-extrabold'
                        : 'text-emerald-600 dark:text-emerald-400 border-transparent'
                    }`}
                  >
                    {showIsotope ? '¹⁸O' : 'O'}—C₂H₅
                  </span>
                </div>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-sans">
                  Отщепляет H!
                </span>
              </div>

              {/* Catalyst & Reversible Arrow */}
              <div className="flex flex-col items-center px-2">
                <span className="text-[11px] font-sans text-indigo-600 dark:text-indigo-400 font-semibold mb-0.5">
                  H₂SO₄(конц), t°
                </span>
                <div className="flex items-center text-zinc-400 font-bold text-2xl tracking-tighter">
                  <span className="text-indigo-500">⇌</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-sans mt-0.5">обратимо</span>
              </div>

              {/* Product 1: Ester */}
              <div className="flex flex-col items-center bg-white dark:bg-zinc-900 border border-purple-200 dark:border-purple-900/50 rounded-xl p-3 shadow-sm">
                <span className="text-[11px] font-sans font-semibold text-purple-600 dark:text-purple-400 mb-1">
                  Этилацетат (эфир)
                </span>
                <div className="flex items-center text-lg sm:text-xl font-bold">
                  <span className="text-blue-600 dark:text-blue-400">CH₃—C(=O)</span>
                  <span className="text-zinc-400 mx-0.5">—</span>
                  <span
                    className={`px-1.5 py-0.5 rounded border transition-colors ${
                      showIsotope
                        ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-400 font-extrabold'
                        : 'text-emerald-600 dark:text-emerald-400 border-transparent'
                    }`}
                  >
                    {showIsotope ? '¹⁸O' : 'O'}—C₂H₅
                  </span>
                </div>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 mt-1 font-sans">
                  {showIsotope ? 'Метка ¹⁸O вошла в эфир!' : 'Сложноэфирная связь'}
                </span>
              </div>

              {/* Plus Sign */}
              <span className="text-xl font-bold text-zinc-400 px-2">+</span>

              {/* Product 2: Water */}
              <div className="flex flex-col items-center bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 shadow-sm">
                <span className="text-[11px] font-sans font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  Вода
                </span>
                <div className="flex items-center text-lg sm:text-xl font-bold">
                  <span className="bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700/60">
                    H—OH
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 font-sans">
                  {showIsotope ? 'Обычный ¹⁶O' : 'H(спирт) + OH(кислота)'}
                </span>
              </div>
            </div>
          </div>

          {/* Explanation Callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
                <span className="font-bold text-amber-800 dark:text-amber-300 block">
                  Главная ловушка зачёта
                </span>
                <p>
                  Большинство учеников считают, что спирт отдает <span className="font-mono font-bold">OH</span> (как щёлочь). Это грубая ошибка! Гидроксил уходит от <strong>кислоты</strong>, а водород — от <strong>спирта</strong>.
                </p>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3.5 flex items-start gap-2.5">
              <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
                <span className="font-bold text-purple-800 dark:text-purple-300 block">
                  Доказательство методом меченых атомов (¹⁸O)
                </span>
                <p>
                  Спирт синтезируют с тяжелым изотопом <span className="font-mono font-bold">C₂H₅—¹⁸OH</span>. В результате реакции весь изотоп ¹⁸O оказывается в молекуле <strong>эфира</strong>, доказывая расщепление связи C—OH у кислоты.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Alkaline Mode (Saponification) */
        <div className="space-y-4">
          <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <div className="min-w-[620px] flex items-center justify-between text-center font-mono">
              {/* Ester */}
              <div className="flex flex-col items-center bg-white dark:bg-zinc-900 border border-purple-200 dark:border-purple-900/50 rounded-xl p-3 shadow-sm">
                <span className="text-[11px] font-sans font-semibold text-purple-600 dark:text-purple-400 mb-1">
                  Этилацетат
                </span>
                <div className="text-lg sm:text-xl font-bold text-purple-700 dark:text-purple-300">
                  CH₃—COO—C₂H₅
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 font-sans">Сложный эфир</span>
              </div>

              {/* Plus Sign */}
              <span className="text-xl font-bold text-zinc-400 px-2">+</span>

              {/* Alkali */}
              <div className="flex flex-col items-center bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 shadow-sm">
                <span className="text-[11px] font-sans font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  Щёлочь (водн.)
                </span>
                <div className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400">
                  NaOH
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 font-sans">Гидроксид натрия</span>
              </div>

              {/* Irreversible Arrow */}
              <div className="flex flex-col items-center px-3">
                <span className="text-[11px] font-sans text-amber-600 dark:text-amber-400 font-semibold mb-0.5">
                  t°
                </span>
                <div className="flex items-center text-amber-600 dark:text-amber-400 font-bold text-2xl">
                  <span>⟶</span>
                </div>
                <span className="text-[10px] text-rose-500 font-sans font-bold mt-0.5">
                  НЕОБРАТИМО
                </span>
              </div>

              {/* Salt of acid */}
              <div className="flex flex-col items-center bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-3 shadow-sm">
                <span className="text-[11px] font-sans font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  Ацетат натрия (соль)
                </span>
                <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  CH₃COO⁻ Na⁺
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-sans">
                  Карбоксилат-анион
                </span>
              </div>

              {/* Plus Sign */}
              <span className="text-xl font-bold text-zinc-400 px-2">+</span>

              {/* Alcohol */}
              <div className="flex flex-col items-center bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900/50 rounded-xl p-3 shadow-sm">
                <span className="text-[11px] font-sans font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  Этанол
                </span>
                <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                  C₂H₅OH
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 font-sans">Спирт</span>
              </div>
            </div>
          </div>

          {/* Explanation Why Irreversible */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1.5">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm block">
                Почему щелочной гидролиз (омыление) строго необратим?
              </span>
              <p>
                В щелочной среде образуется не свободная кислота, а её соль (анион <span className="font-mono font-bold">R—COO⁻</span>). Анион карбоксилата отрицательно заряжен и резонансно стабилизирован — он электростатически отталкивает спирт и не вступает в обратную реакцию этерификации. Равновесие необратимо сдвинуто вправо на 100%.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
