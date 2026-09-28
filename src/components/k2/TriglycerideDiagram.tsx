import React, { useState } from 'react';
import { Layers, Droplets, Flame, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';

export const TriglycerideDiagram: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'structure' | 'saponification' | 'hydrogenation' | 'micelle'>('structure');
  const [fatType, setFatType] = useState<'stearin' | 'olein'>('stearin');

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
              Интерактивная модель
            </span>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
              Строение жиров, омыление и действие мыла
            </h3>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Стехиометрия омыления 1:3, гидрирование масел и структура мицеллы
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'structure'
                ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-300 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Строение
          </button>
          <button
            onClick={() => setActiveTab('saponification')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'saponification'
                ? 'bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-300 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Омыление (1:3)
          </button>
          <button
            onClick={() => setActiveTab('hydrogenation')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'hydrogenation'
                ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Гидрирование
          </button>
          <button
            onClick={() => setActiveTab('micelle')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'micelle'
                ? 'bg-white dark:bg-zinc-700 text-amber-600 dark:text-amber-300 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Мыло и мицелла
          </button>
        </div>
      </div>

      {/* TAB 1: Structure */}
      {activeTab === 'structure' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Выберите тип триглицерида:</span>
            <div className="inline-flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setFatType('stearin')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  fatType === 'stearin'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Тристеарин (твёрдый жир)
              </button>
              <button
                onClick={() => setFatType('olein')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  fatType === 'olein'
                    ? 'bg-white dark:bg-zinc-700 text-amber-600 dark:text-amber-300 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Триолеин (жидкое масло)
              </button>
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 overflow-x-auto">
            <div className="min-w-[500px] flex items-center justify-center font-mono">
              {/* Glycerol backbone column */}
              <div className="flex flex-col items-end pr-2 border-r-2 border-blue-400 dark:border-blue-600 space-y-4">
                <div className="bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm font-bold">
                  CH₂—
                </div>
                <div className="bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm font-bold">
                  CH—
                </div>
                <div className="bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm font-bold">
                  CH₂—
                </div>
              </div>

              {/* Ester bonds and tails column */}
              <div className="flex flex-col space-y-4 pl-3">
                {[1, 2, 3].map(row => (
                  <div key={row} className="flex items-center gap-2">
                    <span className="bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs font-bold border border-purple-300 dark:border-purple-800">
                      O—CO—
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-semibold ${
                        fatType === 'stearin'
                          ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {fatType === 'stearin' ? (
                        'C₁₇H₃₅ (насыщенный хвост)'
                      ) : (
                        <span>
                          C₁₇H₃₃ <span className="font-sans text-[10px] text-amber-600">(цис-двойная связь!)</span>
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-3 text-xs text-zinc-500 font-sans">
              Остаток трёхатомного спирта глицерина + 3 сложноэфирные связи + 3 остатка жирных кислот
            </div>
          </div>

          <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {fatType === 'stearin' ? (
              <p>
                <strong>Тристеарин (C₁₇H₃₅COO)₃C₃H₅:</strong> Все три радикала предельные, линейные. Они плотно укладываются в кристаллическую решетку, поэтому животные жиры при комнатной температуре — <strong>твёрдые</strong>.
              </p>
            ) : (
              <p>
                <strong>Триолеин (C₁₇H₃₃COO)₃C₃H₅:</strong> Природная <em>цис-конфигурация</em> двойных связей создает изгиб (кинк) в углеводородной цепи, препятствуя плотной упаковке. Поэтому растительные жиры при 20°C — <strong>жидкие масла</strong>.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Saponification */}
      {activeTab === 'saponification' && (
        <div className="space-y-4">
          <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <div className="min-w-[650px] flex items-center justify-between text-center font-mono">
              {/* Fat Molecule */}
              <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                <span className="text-[11px] font-sans font-bold text-zinc-500 block mb-1">
                  1 моль жира
                </span>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  (RCOO)₃C₃H₅
                </div>
                <span className="text-[10px] text-purple-600 font-sans mt-1 block">
                  3 сложноэфирные связи
                </span>
              </div>

              <span className="text-xl font-bold text-zinc-400 px-2">+</span>

              {/* 3 NaOH */}
              <div className="p-3 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-900/60 rounded-xl shadow-sm">
                <span className="text-[11px] font-sans font-bold text-amber-600 block mb-1">
                  Строго 3 моль щёлочи!
                </span>
                <div className="text-lg font-bold text-amber-600">
                  3 NaOH
                </div>
                <span className="text-[10px] text-zinc-400 font-sans mt-1 block">
                  по 1 на каждую связь
                </span>
              </div>

              {/* Arrow */}
              <div className="px-2 text-center">
                <span className="text-xs text-zinc-500 font-sans block">t°</span>
                <span className="text-2xl text-emerald-500 font-bold">⟶</span>
                <span className="text-[10px] text-emerald-600 font-sans font-bold block">
                  100% необратимо
                </span>
              </div>

              {/* Glycerol */}
              <div className="p-3 bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900 rounded-xl shadow-sm">
                <span className="text-[11px] font-sans font-bold text-blue-600 block mb-1">
                  1 моль глицерина
                </span>
                <div className="text-sm font-bold text-blue-600">
                  C₃H₅(OH)₃
                </div>
                <span className="text-[10px] text-zinc-400 font-sans mt-1 block">
                  Трёхатомный спирт
                </span>
              </div>

              <span className="text-xl font-bold text-zinc-400 px-2">+</span>

              {/* 3 Soaps */}
              <div className="p-3 bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-900 rounded-xl shadow-sm">
                <span className="text-[11px] font-sans font-bold text-emerald-600 block mb-1">
                  3 моль мыла!
                </span>
                <div className="text-sm font-bold text-emerald-600">
                  3 R—COONa
                </div>
                <span className="text-[10px] text-emerald-600 font-sans mt-1 block">
                  Натриевая соль (мыло)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm block">
                Стехиометрическое правило омыления
              </span>
              <p>
                Отношение количеств вещества жира и щёлочи всегда строго <span className="font-mono font-bold">1 : 3</span>. Если по условию задачи на омыление триглицерида израсходовано 0.3 моль NaOH, значит, исходного жира было ровно <strong>0.1 моль</strong>, а образовалось <strong>0.1 моль глицерина</strong> и <strong>0.3 моль мыла</strong>!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Hydrogenation */}
      {activeTab === 'hydrogenation' && (
        <div className="space-y-4">
          <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <div className="min-w-[620px] flex items-center justify-between text-center font-mono">
              {/* Liquid oil */}
              <div className="p-3 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-900/60 rounded-xl shadow-sm">
                <span className="text-[11px] font-sans font-bold text-amber-600 block mb-1">
                  Триолеин (масло)
                </span>
                <div className="text-sm font-bold text-amber-600">
                  (C₁₇H₃₃COO)₃C₃H₅
                </div>
                <span className="text-[10px] text-zinc-500 font-sans mt-1 block">
                  Жидкое, 3 двойные связи
                </span>
              </div>

              <span className="text-xl font-bold text-zinc-400 px-2">+</span>

              {/* 3 H2 */}
              <div className="p-3 bg-white dark:bg-zinc-900 border border-indigo-300 dark:border-indigo-900 rounded-xl shadow-sm">
                <span className="text-[11px] font-sans font-bold text-indigo-600 block mb-1">
                  Водород
                </span>
                <div className="text-lg font-bold text-indigo-600">
                  3 H₂
                </div>
                <span className="text-[10px] text-zinc-400 font-sans mt-1 block">
                  по 1 H₂ на связь
                </span>
              </div>

              {/* Arrow */}
              <div className="px-3 text-center">
                <span className="text-xs text-zinc-600 dark:text-zinc-300 font-sans font-bold block">
                  Ni, t°, p
                </span>
                <span className="text-2xl text-indigo-500 font-bold">⟶</span>
                <span className="text-[10px] text-zinc-400 font-sans block">гидрирование</span>
              </div>

              {/* Solid fat */}
              <div className="p-3 bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-900 rounded-xl shadow-sm">
                <span className="text-[11px] font-sans font-bold text-emerald-600 block mb-1">
                  Тристеарин (сало)
                </span>
                <div className="text-sm font-bold text-emerald-600">
                  (C₁₇H₃₅COO)₃C₃H₅
                </div>
                <span className="text-[10px] text-emerald-600 font-sans mt-1 block">
                  Твёрдый жир (маргарин)
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
            <span className="font-bold text-indigo-700 dark:text-indigo-300 block">
              Внимание: расчет водорода на триглицериды
            </span>
            <p>
              • Для триолеата (олеиновая кислота, 1 двойная связь в остатке) требуется <strong>3 моль H₂</strong> на 1 моль жира.<br />
              • Для трилинолеата (линолевая кислота, 2 двойные связи в остатке) требуется <strong>6 моль H₂</strong> на 1 моль жира!
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: Micelle & Hard water */}
      {activeTab === 'micelle' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Micelle diagram representation */}
            <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 flex flex-col items-center justify-center space-y-3">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Строение молекулы мыла (Стеарат натрия)
              </span>

              <div className="flex items-center font-mono text-xs">
                {/* Hydrophobic tail */}
                <div className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-l-xl border border-zinc-300 dark:border-zinc-700">
                  CH₃—(CH₂)₁₆—
                </div>
                {/* Hydrophilic head */}
                <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-r-xl font-bold border border-emerald-600">
                  —COO⁻ Na⁺
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full text-center text-[11px] font-sans">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  <strong>Гидрофобный хвост</strong><br />
                  Растворяется в капле жира и грязи
                </div>
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  <strong>Гидрофильная голова</strong><br />
                  Притягивается к диполям воды
                </div>
              </div>
            </div>

            {/* Hard water problem */}
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2 text-rose-700 dark:text-rose-400 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Проблема жёсткой воды</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Обычное мыло <strong>теряет моющее действие</strong> в жёсткой воде, содержащей ионы Ca²⁺ и Mg²⁺. Ионы кальция образуют с остатками жирных кислот нерастворимый липкий хлопьевидный осадок:
                </p>
                <div className="mt-2 font-mono text-xs font-bold text-rose-700 dark:text-rose-300 bg-white/70 dark:bg-zinc-900/70 p-2 rounded-lg border border-rose-200 dark:border-rose-900">
                  2 C₁₇H₃₅COO⁻ + Ca²⁺ ⟶ (C₁₇H₃₅COO)₂Ca ↓
                </div>
              </div>

              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                💡 <em>В отличие от мыла, синтетические моющие средства (СМС, алкилсульфаты R-OSO₃Na) не осаждаются кальцием и отлично моют даже в морской воде!</em>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
