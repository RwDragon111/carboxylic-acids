import React, { useState } from 'react';
import {
  K2_CHEAT_SHEET,
  EXAM_TRAPS,
  COMPARISON_TABLE_ACIDS_VS_ESTERS,
  FATTY_ACIDS_TABLE,
} from '../../data/k2/quickReview';
import { ChemText } from '../common/ChemText';
import {
  X,
  Zap,
  AlertTriangle,
  Table,
  Layers,
  Search,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

interface QuickReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickReviewModal: React.FC<QuickReviewModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sheet' | 'traps' | 'tables'>('sheet');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredTraps = EXAM_TRAPS.filter(
    t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.misconception.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.truth.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Повторить за 10 минут
              </h2>
              <p className="text-xs text-zinc-500">
                Самые концентрированные правила, ряды кислотности и ловушки зачёта К2
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('sheet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'sheet'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Шпаргалка</span>
            </button>
            <button
              onClick={() => setActiveTab('traps')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'traps'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>10 Главных ловушек</span>
            </button>
            <button
              onClick={() => setActiveTab('tables')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tables'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Сводные таблицы</span>
            </button>
          </div>

          {activeTab === 'traps' && (
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по ловушкам..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-7 pr-3 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2 top-2" />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Cheat Sheet */}
          {activeTab === 'sheet' && (
            <div className="space-y-6">
              {K2_CHEAT_SHEET.map(sec => (
                <div
                  key={sec.id}
                  className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                    <span className="text-xl">{sec.icon}</span>
                    <h3>{sec.title}</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {sec.points.map((pt, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl p-3.5 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300"
                      >
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                          {pt.heading}
                        </span>
                        <div className="leading-relaxed">
                          <ChemText text={pt.text} inline />
                        </div>
                        {pt.formula && (
                          <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/20 text-xs mt-1">
                            <ChemText text={pt.formula} inline />
                          </div>
                        )}
                        {pt.warning && (
                          <div className="font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 p-2 rounded-lg text-[11px] mt-1">
                            ⚠️ <ChemText text={pt.warning} inline />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: 10 Traps */}
          {activeTab === 'traps' && (
            <div className="space-y-4">
              {filteredTraps.map(trap => (
                <div
                  key={trap.id}
                  className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                      {trap.id}
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                      <ChemText text={trap.title} inline />
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-200">
                      <span className="font-bold block mb-1">❌ Как часто ошибаются:</span>
                      <p><ChemText text={trap.misconception} inline /></p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
                      <span className="font-bold block mb-1">✅ Как на самом деле (правда):</span>
                      <p><ChemText text={trap.truth} inline /></p>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                      Химическое обоснование:
                    </span>
                    <div className="leading-relaxed">
                      <ChemText text={trap.chemicalReason} inline />
                    </div>
                    <div className="font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1 text-[11px]">
                      Пример: <ChemText text={trap.example} inline />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Comparison Tables */}
          {activeTab === 'tables' && (
            <div className="space-y-6">
              {/* Acids vs Esters vs Alcohols */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>Сравнение: Карбоновые кислоты, Сложные эфиры и Спирты</span>
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold border-b border-zinc-200 dark:border-zinc-800">
                        <th className="p-3">Свойство</th>
                        <th className="p-3 text-emerald-600">Карбоновые кислоты</th>
                        <th className="p-3 text-purple-600">Сложные эфиры</th>
                        <th className="p-3 text-blue-600">Одноатомные спирты</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                      {COMPARISON_TABLE_ACIDS_VS_ESTERS.map((row, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                          <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">
                            {row.parameter}
                          </td>
                          <td className="p-3 text-zinc-700 dark:text-zinc-300"><ChemText text={row.acids} inline /></td>
                          <td className="p-3 text-zinc-700 dark:text-zinc-300"><ChemText text={row.esters} inline /></td>
                          <td className="p-3 text-zinc-700 dark:text-zinc-300"><ChemText text={row.alcohols} inline /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fatty acids table */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>Высшие жирные кислоты (Пальмитиновая + ряд C18)</span>
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold border-b border-zinc-200 dark:border-zinc-800">
                        <th className="p-3">Тривиальное</th>
                        <th className="p-3">Формула</th>
                        <th className="p-3">Связей C=C</th>
                        <th className="p-3">Конфигурация</th>
                        <th className="p-3">При 20°C</th>
                        <th className="p-3">Мнемоника / Источник</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                      {FATTY_ACIDS_TABLE.map((row, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                          <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">
                            {row.trivialName}
                          </td>
                          <td className="p-3 font-mono text-emerald-600 font-bold">
                            <ChemText text={row.formula} inline />
                          </td>
                          <td className="p-3 font-bold">{row.doubleBonds}</td>
                          <td className="p-3 text-zinc-600 dark:text-zinc-400">{row.cisTrans}</td>
                          <td className="p-3 font-semibold">{row.stateAt20}</td>
                          <td className="p-3 text-zinc-500"><ChemText text={row.mnemonic} inline /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            Закрыть и продолжить
          </button>
        </div>
      </div>
    </div>
  );
};
