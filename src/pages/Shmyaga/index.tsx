import React, { useState, useEffect } from 'react';
import { SHMYAGA_MNEMONIC, MNEMONIC_PHRASE, ShmyagaItem } from '../../data/mnemonic';
import { ACIDS, getAcidById } from '../../data/acids';
import { MoleculeDiagram } from '../../components/common/MoleculeDiagram';
import { playClickSound, playSuccessSound, playErrorSound } from '../../utils/audio';
import { QuestionType } from '../../types/chemistry';
import {
  Sparkles,
  HelpCircle,
  Eye,
  Check,
  RotateCcw,
  ArrowRight,
  MoveUp,
  MoveDown,
  Plus,
  Minus,
  Timer,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface ShmyagaProps {
  onRecordAnswer: (acidId: string, isCorrect: boolean, questionType: QuestionType) => void;
  soundEnabled: boolean;
}

type MiniGameMode = 'overview' | 'game1' | 'game2' | 'game3' | 'game4' | 'game5';

export const Shmyaga: React.FC<ShmyagaProps> = ({ onRecordAnswer, soundEnabled }) => {
  const [activeGame, setActiveGame] = useState<MiniGameMode>('overview');
  const [showMnemonic, setShowMnemonic] = useState(true);

  // --- Game 1: Name -> CH2 count ---
  const [g1Target, setG1Target] = useState<ShmyagaItem>(SHMYAGA_MNEMONIC[0]);
  const [g1Selected, setG1Selected] = useState<number | null>(null);

  const initGame1 = () => {
    const random = SHMYAGA_MNEMONIC[Math.floor(Math.random() * SHMYAGA_MNEMONIC.length)];
    setG1Target(random);
    setG1Selected(null);
  };

  const handleG1Answer = (count: number) => {
    if (g1Selected !== null) return;
    setG1Selected(count);
    const isCorrect = count === g1Target.ch2Count;
    if (isCorrect) {
      playSuccessSound(soundEnabled);
    } else {
      playErrorSound(soundEnabled);
    }
    onRecordAnswer(g1Target.id, isCorrect, 'ch2_count_to_acid');
  };

  // --- Game 2: Structure -> Acid name ---
  const [g2Target, setG2Target] = useState<ShmyagaItem>(SHMYAGA_MNEMONIC[2]);
  const [g2Selected, setG2Selected] = useState<string | null>(null);

  const initGame2 = () => {
    const random = SHMYAGA_MNEMONIC[Math.floor(Math.random() * SHMYAGA_MNEMONIC.length)];
    setG2Target(random);
    setG2Selected(null);
  };

  const handleG2Answer = (acidId: string) => {
    if (g2Selected !== null) return;
    setG2Selected(acidId);
    const isCorrect = acidId === g2Target.id;
    if (isCorrect) {
      playSuccessSound(soundEnabled);
    } else {
      playErrorSound(soundEnabled);
    }
    onRecordAnswer(g2Target.id, isCorrect, 'structure_to_trivial');
  };

  // --- Game 3: Sort Order (0 to 4 CH2) ---
  const [g3Items, setG3Items] = useState<ShmyagaItem[]>([]);
  const [g3Checked, setG3Checked] = useState(false);
  const [g3IsCorrect, setG3IsCorrect] = useState(false);

  const initGame3 = () => {
    // Shuffle items
    const shuffled = [...SHMYAGA_MNEMONIC].sort(() => Math.random() - 0.5);
    setG3Items(shuffled);
    setG3Checked(false);
    setG3IsCorrect(false);
  };

  const moveG3Item = (index: number, direction: 'up' | 'down') => {
    playClickSound(soundEnabled);
    const newItems = [...g3Items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    [newItems[index], newItems[targetIdx]] = [newItems[targetIdx], newItems[index]];
    setG3Items(newItems);
    setG3Checked(false);
  };

  const checkG3Order = () => {
    const isCorrect = g3Items.every((item, idx) => item.ch2Count === idx);
    setG3Checked(true);
    setG3IsCorrect(isCorrect);
    if (isCorrect) {
      playSuccessSound(soundEnabled);
      onRecordAnswer('oxalic', true, 'ch2_count_to_acid');
    } else {
      playErrorSound(soundEnabled);
      onRecordAnswer('oxalic', false, 'ch2_count_to_acid');
    }
  };

  // --- Game 4: Assemble Acid (Builder) ---
  const [g4Target, setG4Target] = useState<ShmyagaItem>(SHMYAGA_MNEMONIC[2]);
  const [g4Ch2Count, setG4Ch2Count] = useState(0);
  const [g4Checked, setG4Checked] = useState(false);

  const initGame4 = () => {
    const random = SHMYAGA_MNEMONIC[Math.floor(Math.random() * SHMYAGA_MNEMONIC.length)];
    setG4Target(random);
    setG4Ch2Count(0);
    setG4Checked(false);
  };

  const handleG4Submit = () => {
    setG4Checked(true);
    const isCorrect = g4Ch2Count === g4Target.ch2Count;
    if (isCorrect) {
      playSuccessSound(soundEnabled);
    } else {
      playErrorSound(soundEnabled);
    }
    onRecordAnswer(g4Target.id, isCorrect, 'ch2_count_to_acid');
  };

  // --- Game 5: Speed Blitz ---
  const [g5Target, setG5Target] = useState<ShmyagaItem>(SHMYAGA_MNEMONIC[3]);
  const [g5Selected, setG5Selected] = useState<string | null>(null);
  const [g5Score, setG5Score] = useState(0);

  const initGame5 = () => {
    const random = SHMYAGA_MNEMONIC[Math.floor(Math.random() * SHMYAGA_MNEMONIC.length)];
    setG5Target(random);
    setG5Selected(null);
  };

  const handleG5Answer = (id: string) => {
    if (g5Selected !== null) return;
    setG5Selected(id);
    const isCorrect = id === g5Target.id;
    if (isCorrect) {
      setG5Score(s => s + 1);
      playSuccessSound(soundEnabled);
    } else {
      playErrorSound(soundEnabled);
    }
    onRecordAnswer(g5Target.id, isCorrect, 'ch2_count_to_acid');
    setTimeout(() => {
      initGame5();
    }, 700);
  };

  useEffect(() => {
    initGame1();
    initGame2();
    initGame3();
    initGame4();
    initGame5();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Специальный тренажёр</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
          Ряд «Шмяга»
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Пять важнейших предельных дикарбоновых кислот: Щавелевая, Малоновая, Янтарная, Глутаровая, Адипиновая.
        </p>
      </div>

      {/* Mnemonic Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
            Мнемоническое правило
          </span>
          <button
            onClick={() => setShowMnemonic(v => !v)}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1 font-medium"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showMnemonic ? 'Скрыть подсказку' : 'Показать подсказку'}</span>
          </button>
        </div>

        {showMnemonic && (
          <div className="space-y-4 animate-fade">
            <div className="text-center">
              <span className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">
                {MNEMONIC_PHRASE}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center">
              {SHMYAGA_MNEMONIC.map(item => (
                <div
                  key={item.id}
                  className="bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800"
                >
                  <span className="block text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {item.letter}
                  </span>
                  <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1 truncate">
                    {item.name}
                  </span>
                  <span className="inline-block mt-2 font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {item.ch2Count} CH₂
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mini-Games Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: 'overview' as MiniGameMode, label: 'Обзор ряда' },
          { id: 'game1' as MiniGameMode, label: '1. Кислота → Сколько CH₂?' },
          { id: 'game2' as MiniGameMode, label: '2. Структура → Кислота' },
          { id: 'game3' as MiniGameMode, label: '3. Расставь по порядку' },
          { id: 'game4' as MiniGameMode, label: '4. Собери кислоту' },
          { id: 'game5' as MiniGameMode, label: '5. Скоростной блиц' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              playClickSound(soundEnabled);
              setActiveGame(tab.id);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeGame === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- Active Mini-Game Container --- */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Mode: Overview */}
        {activeGame === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Сравнительная таблица ряда дикарбоновых кислот
            </h3>
            <div className="space-y-4">
              {SHMYAGA_MNEMONIC.map(item => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="sm:w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold flex items-center justify-center text-sm">
                        {item.letter}
                      </span>
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                          {item.name} кислота
                        </h4>
                        <span className="text-xs text-zinc-400 font-mono">
                          {item.ch2Count} групп(ы) CH₂
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:w-2/3 w-full">
                    <MoleculeDiagram
                      src={item.structureAsset}
                      alt={item.name}
                      maxHeight="max-h-24"
                      className="w-full bg-white dark:bg-zinc-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game 1: Acid Name -> CH2 count */}
        {activeGame === 'game1' && (
          <div className="text-center space-y-6">
            <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
              Игра 1: Сколько метиленовых групп?
            </span>

            <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {g1Target.name} кислота
            </h3>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Сколько групп CH₂ находится между двумя карбоксильными группами –COOH?
            </p>

            <div className="grid grid-cols-5 gap-3 max-w-md mx-auto pt-2">
              {[0, 1, 2, 3, 4].map(num => {
                let btnStyle = 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 hover:border-emerald-500';
                if (g1Selected !== null) {
                  if (num === g1Target.ch2Count) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-500/30';
                  } else if (num === g1Selected) {
                    btnStyle = 'bg-red-500 text-white border-red-600 ring-2 ring-red-500/30';
                  }
                }

                return (
                  <button
                    key={num}
                    disabled={g1Selected !== null}
                    onClick={() => handleG1Answer(num)}
                    className={`py-5 text-2xl font-mono font-bold rounded-2xl border transition-all active:scale-95 ${btnStyle}`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {g1Selected !== null && (
              <div className="pt-4 animate-fade">
                <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                  {g1Selected === g1Target.ch2Count ? '✅ Абсолютно верно!' : `❌ Правильно: ${g1Target.ch2Count} (${g1Target.name} кислота)`}
                </p>
                <button
                  onClick={initGame1}
                  className="mt-3 py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>Следующий вопрос</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Game 2: Structure -> Acid name */}
        {activeGame === 'game2' && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                Игра 2: Узнай дикарбоновую кислоту по структуре
              </span>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                Какая кислота из ряда Шмяга изображена?
              </h3>
            </div>

            <MoleculeDiagram
              src={g2Target.structureAsset}
              alt="Структура кислоты"
              maxHeight="max-h-40"
              className="max-w-lg mx-auto"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
              {SHMYAGA_MNEMONIC.map(item => {
                let style = 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 hover:border-emerald-500';
                if (g2Selected !== null) {
                  if (item.id === g2Target.id) {
                    style = 'bg-emerald-500 text-white border-emerald-600';
                  } else if (item.id === g2Selected) {
                    style = 'bg-red-500 text-white border-red-600';
                  }
                }

                return (
                  <button
                    key={item.id}
                    disabled={g2Selected !== null}
                    onClick={() => handleG2Answer(item.id)}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all active:scale-95 ${style}`}
                  >
                    {item.name} кислота
                  </button>
                );
              })}
            </div>

            {g2Selected !== null && (
              <div className="text-center pt-2 animate-fade">
                <button
                  onClick={initGame2}
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>Дальше</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Game 3: Sort in Order */}
        {activeGame === 'game3' && (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                Игра 3: Расставь в правильном порядке
              </span>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                Упорядочи кислоты по возрастанию числа CH₂ (0 → 4)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Используй стрелки «Вверх» и «Вниз» для перемещения
              </p>
            </div>

            <div className="space-y-2">
              {g3Items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    g3Checked
                      ? item.ch2Count === idx
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500'
                        : 'bg-red-50 dark:bg-red-950/40 border-red-500'
                      : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 font-mono text-xs font-bold flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      {item.name} кислота
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveG3Item(idx, 'up')}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30"
                      aria-label="Вверх"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={idx === g3Items.length - 1}
                      onClick={() => moveG3Item(idx, 'down')}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30"
                      aria-label="Вниз"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={checkG3Order}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-sm transition-all"
              >
                Проверить порядок
              </button>
              <button
                onClick={initGame3}
                className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                title="Перемешать заново"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {g3Checked && (
              <div className="text-center font-bold text-sm">
                {g3IsCorrect ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    🎉 Идеально! Порядок Щ-М-Я-Г-А абсолютно верный.
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">
                    ❌ Есть ошибки. Вспомни мнемонику «Ща Мама Ягоды Готовит Ане»!
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Game 4: Assemble Acid */}
        {activeGame === 'game4' && (
          <div className="space-y-6 max-w-lg mx-auto text-center">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                Игра 4: Конструктор молекулы
              </span>
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
                Собери: {g4Target.name} кислоту
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Добавь нужное количество блоков CH₂ между концевыми группами COOH
              </p>
            </div>

            {/* Molecule Chain Visualization */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 min-h-[110px]">
              {/* Left COOH */}
              <div className="font-mono text-sm font-bold bg-emerald-500 text-white px-3 py-2 rounded-xl shadow-sm">
                HOOC
              </div>

              {/* Dynamic CH2 blocks */}
              {Array.from({ length: g4Ch2Count }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 animate-fade"
                >
                  <span className="text-zinc-400 font-bold">—</span>
                  <div className="font-mono text-xs font-bold bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-600 shadow-sm">
                    CH₂
                  </div>
                </div>
              ))}

              <span className="text-zinc-400 font-bold">—</span>

              {/* Right COOH */}
              <div className="font-mono text-sm font-bold bg-emerald-500 text-white px-3 py-2 rounded-xl shadow-sm">
                COOH
              </div>
            </div>

            {/* Counter Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                disabled={g4Ch2Count === 0 || g4Checked}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setG4Ch2Count(c => Math.max(0, c - 1));
                }}
                className="w-12 h-12 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-30"
                aria-label="Удалить блок"
              >
                <Minus className="w-5 h-5" />
              </button>

              <span className="font-mono text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 w-16">
                {g4Ch2Count}
              </span>

              <button
                disabled={g4Ch2Count >= 6 || g4Checked}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setG4Ch2Count(c => Math.min(6, c + 1));
                }}
                className="w-12 h-12 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-30"
                aria-label="Добавить блок"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {!g4Checked ? (
              <button
                onClick={handleG4Submit}
                className="py-3 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-sm"
              >
                Проверить сборку
              </button>
            ) : (
              <div className="space-y-4 animate-fade">
                <div className="flex items-center justify-center gap-2 font-bold text-base">
                  {g4Ch2Count === g4Target.ch2Count ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-5 h-5" />
                      Отлично собрано!
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <XCircle className="w-5 h-5" />
                      Неверно: для {g4Target.name.toLowerCase()} нужно {g4Target.ch2Count} блоков CH₂.
                    </span>
                  )}
                </div>

                {/* Show full verified textbook structure */}
                <div className="max-w-md mx-auto">
                  <MoleculeDiagram
                    src={g4Target.structureAsset}
                    alt={g4Target.name}
                    maxHeight="max-h-28"
                  />
                </div>

                <button
                  onClick={initGame4}
                  className="py-2.5 px-6 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-sm inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>Следующая кислота</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Game 5: Speed Blitz */}
        {activeGame === 'game5' && (
          <div className="space-y-6 max-w-md mx-auto text-center">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
              <span className="flex items-center gap-1">
                <Timer className="w-4 h-4 text-emerald-500" />
                Скоростной режим
              </span>
              <span>Верно подряд: {g5Score}</span>
            </div>

            <div className="py-6 bg-zinc-50 dark:bg-zinc-800/60 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                Задано число групп:
              </span>
              <div className="text-5xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                {g5Target.ch2Count} CH₂
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SHMYAGA_MNEMONIC.map(item => {
                let style = 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 hover:border-emerald-500';
                if (g5Selected !== null) {
                  if (item.id === g5Target.id) {
                    style = 'bg-emerald-500 text-white border-emerald-600';
                  } else if (item.id === g5Selected) {
                    style = 'bg-red-500 text-white border-red-600';
                  }
                }

                return (
                  <button
                    key={item.id}
                    disabled={g5Selected !== null}
                    onClick={() => handleG5Answer(item.id)}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all active:scale-95 ${style}`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
