import React, { useState, useEffect } from 'react';
import { ACIDS, ANION_ACID_IDS } from '../../data/acids';
import { MoleculeDiagram } from '../../components/common/MoleculeDiagram';
import { playClickSound, playSuccessSound, playErrorSound } from '../../utils/audio';
import { GitCompare, RotateCcw, Trophy, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatchingProps {
  soundEnabled: boolean;
}

type MatchingMode = 'anions' | 'structures';

interface MatchItem {
  id: string; // matches partner id
  key: string; // unique card key
  text?: string;
  structureAsset?: string;
}

export const Matching: React.FC<MatchingProps> = ({ soundEnabled }) => {
  const [mode, setMode] = useState<MatchingMode>('anions');
  const [leftItems, setLeftItems] = useState<MatchItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [mismatchIds, setMismatchIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = (targetMode: MatchingMode) => {
    setMode(targetMode);
    setSelectedLeft(null);
    setSelectedRight(null);
    setSolvedIds(new Set());
    setMismatchIds([]);
    setMoves(0);

    if (targetMode === 'anions') {
      const pool = ACIDS.filter(a => ANION_ACID_IDS.includes(a.id) && a.hasAnionQuiz && a.anion);
      const left: MatchItem[] = pool.map(a => ({
        id: a.id,
        key: `l_${a.id}`,
        text: a.trivialName,
      }));
      const right: MatchItem[] = pool.map(a => ({
        id: a.id,
        key: `r_${a.id}`,
        text: a.anion!.name,
      }));

      setLeftItems([...left].sort(() => Math.random() - 0.5));
      setRightItems([...right].sort(() => Math.random() - 0.5));
    } else {
      // Pick 5 random acids for structure matching
      const pool = [...ACIDS].sort(() => Math.random() - 0.5).slice(0, 5);
      const left: MatchItem[] = pool.map(a => ({
        id: a.id,
        key: `l_${a.id}`,
        text: a.trivialName,
      }));
      const right: MatchItem[] = pool.map(a => ({
        id: a.id,
        key: `r_${a.id}`,
        structureAsset: a.structureAsset,
      }));

      setLeftItems([...left].sort(() => Math.random() - 0.5));
      setRightItems([...right].sort(() => Math.random() - 0.5));
    }
  };

  useEffect(() => {
    initGame('anions');
  }, []);

  const handleSelectLeft = (id: string) => {
    if (solvedIds.has(id) || mismatchIds.length > 0) return;
    playClickSound(soundEnabled);
    setSelectedLeft(id);

    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleSelectRight = (id: string) => {
    if (solvedIds.has(id) || mismatchIds.length > 0) return;
    playClickSound(soundEnabled);
    setSelectedRight(id);

    if (selectedLeft) {
      checkMatch(selectedLeft, id);
    }
  };

  const checkMatch = (leftId: string, rightId: string) => {
    setMoves(m => m + 1);

    if (leftId === rightId) {
      playSuccessSound(soundEnabled);
      setSolvedIds(prev => {
        const next = new Set(prev);
        next.add(leftId);
        if (next.size === leftItems.length) {
          try {
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
          } catch {}
        }
        return next;
      });
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      playErrorSound(soundEnabled);
      setMismatchIds([leftId, rightId]);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setMismatchIds([]);
      }, 700);
    }
  };

  const isComplete = leftItems.length > 0 && solvedIds.size === leftItems.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold border border-cyan-500/20">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Мини-игра на реакцию</span>
        </div>
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
          Сопоставление пар
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Соедини каждую кислоту с её правильной парой из правой колонки.
        </p>
      </div>

      {/* Mode Switcher & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => initGame('anions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'anions'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Кислота ↔ Анион
          </button>
          <button
            onClick={() => initGame('structures')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'structures'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Название ↔ Структура
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <span>Ходов: {moves}</span>
          <span>Найдено: {solvedIds.size} / {leftItems.length}</span>
          <button
            onClick={() => initGame(mode)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
            title="Заново"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Finished Banner */}
      {isComplete && (
        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3 animate-fade">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Все пары сопоставлены за {moves} ходов!
          </h3>
          <button
            onClick={() => initGame(mode)}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-sm"
          >
            Играть ещё раз
          </button>
        </div>
      )}

      {/* Two Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-wider font-bold text-zinc-400 block text-center mb-1">
            Карбоновая кислота
          </span>
          {leftItems.map(item => {
            const isSolved = solvedIds.has(item.id);
            const isSelected = selectedLeft === item.id;
            const isMismatch = isSelected && mismatchIds.includes(item.id);

            let style = 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-cyan-500';
            if (isSolved) {
              style = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 opacity-60 cursor-default';
            } else if (isMismatch) {
              style = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-300 animate-shake';
            } else if (isSelected) {
              style = 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-900 dark:text-cyan-100 ring-2 ring-cyan-500/30';
            }

            return (
              <button
                key={item.key}
                disabled={isSolved}
                onClick={() => handleSelectLeft(item.id)}
                className={`w-full p-4 rounded-xl border font-semibold text-sm sm:text-base text-left transition-all flex items-center justify-between shadow-sm active:scale-98 ${style}`}
              >
                <span>{item.text}</span>
                {isSolved && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-wider font-bold text-zinc-400 block text-center mb-1">
            {mode === 'anions' ? 'Название аниона' : 'Структурная формула'}
          </span>
          {rightItems.map(item => {
            const isSolved = solvedIds.has(item.id);
            const isSelected = selectedRight === item.id;
            const isMismatch = isSelected && mismatchIds.includes(item.id);

            let style = 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-cyan-500';
            if (isSolved) {
              style = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 opacity-60 cursor-default';
            } else if (isMismatch) {
              style = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-300 animate-shake';
            } else if (isSelected) {
              style = 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-900 dark:text-cyan-100 ring-2 ring-cyan-500/30';
            }

            return (
              <button
                key={item.key}
                disabled={isSolved}
                onClick={() => handleSelectRight(item.id)}
                className={`w-full p-4 rounded-xl border font-semibold text-sm sm:text-base transition-all flex items-center justify-between shadow-sm active:scale-98 ${style}`}
              >
                {item.structureAsset ? (
                  <MoleculeDiagram
                    src={item.structureAsset}
                    alt="Структурная формула"
                    maxHeight="max-h-20"
                    className="w-full"
                  />
                ) : (
                  <span>{item.text}</span>
                )}
                {isSolved && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
