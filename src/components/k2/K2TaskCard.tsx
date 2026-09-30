import React, { useState, useEffect } from 'react';
import { K2Question } from '../../types/k2';
import {
  checkTextAnswer,
  checkNumericAnswer,
  checkMultiChoice,
  checkMatching,
  checkSorting,
} from '../../utils/answerChecker';
import { playSuccessSound, playErrorSound } from '../../utils/audio';
import { ChemText, formatChemicalText } from '../common/ChemText';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Bookmark,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface K2TaskCardProps {
  question: K2Question;
  userAnswer?: any;
  onAnswer: (answer: any, isCorrect: boolean) => void;
  showFeedbackImmediately?: boolean;
  isSubmitted?: boolean;
  isFlagged?: boolean;
  onToggleFlag?: () => void;
  soundEnabled?: boolean;
  numberInSet?: number;
  totalInSet?: number;
  onNext?: () => void;
}

export const K2TaskCard: React.FC<K2TaskCardProps> = ({
  question,
  userAnswer,
  onAnswer,
  showFeedbackImmediately = true,
  isSubmitted = false,
  isFlagged = false,
  onToggleFlag,
  soundEnabled = true,
  numberInSet,
  totalInSet,
  onNext,
}) => {
  // Local state for interactive inputs
  const [currentAnswer, setCurrentAnswer] = useState<any>(userAnswer ?? null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(userAnswer !== undefined && userAnswer !== null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [textFeedback, setTextFeedback] = useState<string | null>(null);

  // Sorting state
  const [sortingList, setSortingList] = useState<{ id: string; label: string; order: number }[]>([]);
  // Matching state (leftId -> rightId)
  const [matchingState, setMatchingState] = useState<Record<string, string>>({});
  // Shuffled right options for matching
  const [shuffledRights, setShuffledRights] = useState<{ id: string; text: string }[]>([]);

  // Multi-choice state
  const [selectedMulti, setSelectedMulti] = useState<number[]>([]);

  // Text input state
  const [inputText, setInputText] = useState<string>('');

  // Number input state
  const [inputNum, setInputNum] = useState<string>('');

  // Reset or initialize when question changes
  useEffect(() => {
    setCurrentAnswer(userAnswer ?? null);
    setHasAnswered(userAnswer !== undefined && userAnswer !== null);
    setTextFeedback(null);

    if (question.sortingItems) {
      // Shuffle or preset
      const items = [...question.sortingItems];
      if (!userAnswer) {
        // shuffle slightly for user
        items.sort(() => Math.random() - 0.5);
      }
      setSortingList(items);
    }

    if (question.matchingPairs) {
      const rights = question.matchingPairs.map(p => ({ id: p.id, text: p.right }));
      rights.sort(() => Math.random() - 0.5);
      setShuffledRights(rights);
      setMatchingState(userAnswer || {});
    }

    if (question.type === 'multi_choice') {
      setSelectedMulti(Array.isArray(userAnswer) ? userAnswer : []);
    }

    if (question.type === 'text_input' || question.acceptedTextAnswers) {
      setInputText(typeof userAnswer === 'string' ? userAnswer : '');
    }

    if (question.type === 'number_input' || question.numericAnswer) {
      setInputNum(userAnswer !== undefined && userAnswer !== null ? String(userAnswer) : '');
    }

    if (userAnswer !== undefined && userAnswer !== null) {
      evaluateAnswer(userAnswer, false);
    } else {
      setIsAnswerCorrect(false);
    }
  }, [question.id, userAnswer]);

  // Evaluate correctness
  const evaluateAnswer = (ans: any, triggerSound = true): boolean => {
    let correct = false;
    let feedback: string | undefined = undefined;

    if (question.options && question.correctAnswerSingle !== undefined && (question.type === 'single_choice' || !question.type || question.type === 'structure_identify' || question.type === 'name_to_structure' || question.type === 'find_error' || question.type === 'reaction_conditions' || question.type === 'reaction_products')) {
      correct = ans === question.correctAnswerSingle;
    } else if (question.type === 'multi_choice' || question.correctAnswerMulti !== undefined) {
      const target = question.correctAnswerMulti || [];
      correct = checkMultiChoice(Array.isArray(ans) ? ans : [], target);
    } else if (question.type === 'text_input' || question.acceptedTextAnswers) {
      const result = checkTextAnswer(
        String(ans || ''),
        question.acceptedTextAnswers || [],
        question.requiresStrictIupac
      );
      correct = result.isCorrect;
      feedback = result.feedback;
    } else if (question.type === 'number_input' || question.numericAnswer) {
      const result = checkNumericAnswer(
        ans,
        question.numericAnswer?.value ?? 0,
        question.numericAnswer?.tolerance ?? 0.05
      );
      correct = result.isCorrect;
    } else if (question.type === 'matching' && question.matchingPairs) {
      correct = checkMatching(ans || {}, question.matchingPairs);
    } else if (question.type === 'acidity_sorting' && question.sortingItems) {
      correct = checkSorting(ans || []);
    } else {
      // Default fallback
      correct = ans === question.correctAnswerSingle;
    }

    setIsAnswerCorrect(correct);
    if (feedback) setTextFeedback(feedback);

    if (triggerSound && soundEnabled) {
      if (correct) {
        playSuccessSound();
      } else {
        playErrorSound();
      }
    }

    return correct;
  };

  // Submit handler
  const handleAnswerSubmit = (ans: any) => {
    setCurrentAnswer(ans);
    setHasAnswered(true);
    const correct = evaluateAnswer(ans, showFeedbackImmediately);
    onAnswer(ans, correct);
  };

  // Move sorting item
  const moveSortingItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sortingList.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sortingList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setSortingList(updated);

    if (!showFeedbackImmediately) {
      handleAnswerSubmit(updated);
    }
  };

  const isExamMode = !showFeedbackImmediately && !isSubmitted;
  const showReview = showFeedbackImmediately ? hasAnswered : isSubmitted;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5 transition-all">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-3 text-xs border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          {numberInSet !== undefined && totalInSet !== undefined && (
            <span className="font-mono font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
              #{numberInSet} из {totalInSet}
            </span>
          )}
          <span
            className={`font-semibold px-2 py-0.5 rounded-md ${
              question.difficulty === 'easy'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : question.difficulty === 'medium'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}
          >
            {question.difficulty === 'easy' ? 'Базовый' : question.difficulty === 'medium' ? 'Средний' : 'Профильный'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onToggleFlag && (
            <button
              onClick={onToggleFlag}
              className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                isFlagged
                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 border-transparent hover:border-zinc-200'
              }`}
              title="Пометить вопрос для проверки"
            >
              <Bookmark className={`w-4 h-4 ${isFlagged ? 'fill-amber-500' : ''}`} />
              <span className="text-[11px] hidden sm:inline">
                {isFlagged ? 'В закладках' : 'Отметить'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Prompt and Formula */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
          <ChemText text={question.prompt} inline />
        </h3>
        {question.subPrompt && (
          <div className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            <ChemText text={question.subPrompt} inline />
          </div>
        )}
        {question.formulaDisplay && (
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800 rounded-xl font-mono text-center font-bold text-base text-zinc-800 dark:text-zinc-200 my-2">
            <ChemText text={question.formulaDisplay} inline />
          </div>
        )}
      </div>

      {/* QUESTION INTERACTIVE INPUT BODIES */}
      <div className="space-y-3">
        {/* 1. SINGLE CHOICE & GENERAL OPTIONS */}
        {question.options &&
          (question.type === 'single_choice' ||
            question.type === 'structure_identify' ||
            question.type === 'name_to_structure' ||
            question.type === 'find_error' ||
            question.type === 'reaction_conditions' ||
            question.type === 'reaction_products' ||
            (!question.type && question.correctAnswerSingle !== undefined)) && (
            <div className="grid grid-cols-1 gap-2.5">
              {question.options.map((opt, idx) => {
                const isSelected = currentAnswer === idx;
                const isCorrect = idx === question.correctAnswerSingle;

                let btnStyle =
                  'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200';

                if (showReview) {
                  if (isCorrect) {
                    btnStyle =
                      'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle =
                      'border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-200 line-through';
                  } else {
                    btnStyle =
                      'border-zinc-200 dark:border-zinc-800 opacity-60 bg-zinc-50 dark:bg-zinc-900/50';
                  }
                } else if (isSelected) {
                  btnStyle =
                    'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    disabled={showReview && !isExamMode}
                    onClick={() => {
                      if (showReview && !isExamMode) return;
                      handleAnswerSubmit(idx);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center font-mono text-xs font-bold shrink-0 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug"><ChemText text={opt} inline /></span>
                    </div>

                    {showReview && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />
                    )}
                    {showReview && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

        {/* 2. MULTI CHOICE */}
        {question.type === 'multi_choice' && question.options && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2.5">
              {question.options.map((opt, idx) => {
                const isChecked = selectedMulti.includes(idx);
                const isTarget = (question.correctAnswerMulti || []).includes(idx);

                let boxStyle =
                  'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200';

                if (showReview) {
                  if (isTarget) {
                    boxStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 font-bold';
                  } else if (isChecked && !isTarget) {
                    boxStyle = 'border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-200';
                  }
                } else if (isChecked) {
                  boxStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={showReview && !isExamMode}
                    onClick={() => {
                      if (showReview && !isExamMode) return;
                      const next = isChecked
                        ? selectedMulti.filter(x => x !== idx)
                        : [...selectedMulti, idx];
                      setSelectedMulti(next);
                      if (isExamMode) {
                        handleAnswerSubmit(next);
                      }
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${boxStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span><ChemText text={opt} inline /></span>
                    </div>

                    {showReview && isTarget && (
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        Верный
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {!showReview && !isExamMode && (
              <button
                onClick={() => handleAnswerSubmit(selectedMulti)}
                disabled={selectedMulti.length === 0}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-sm shadow-emerald-500/20"
              >
                Проверить выбранные ({selectedMulti.length})
              </button>
            )}
          </div>
        )}

        {/* 3. TEXT INPUT */}
        {(question.type === 'text_input' || (question.acceptedTextAnswers && !question.options)) && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                disabled={showReview && !isExamMode}
                onChange={e => {
                  setInputText(e.target.value);
                  if (isExamMode) {
                    handleAnswerSubmit(e.target.value);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !showReview && !isExamMode && inputText.trim()) {
                    handleAnswerSubmit(inputText);
                  }
                }}
                placeholder={
                  question.requiresStrictIupac
                    ? 'Введите строго систематическое название по ИЮПАК...'
                    : 'Введите ответ или химическую формулу...'
                }
                className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {!showReview && !isExamMode && (
                <button
                  onClick={() => handleAnswerSubmit(inputText)}
                  disabled={!inputText.trim()}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all"
                >
                  Ответить
                </button>
              )}
            </div>

            {textFeedback && (
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                {textFeedback}
              </div>
            )}

            {showReview && question.acceptedTextAnswers && (
              <div className="text-xs text-zinc-500 space-y-1 bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Допустимые правильные варианты:
                </span>{' '}
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {question.acceptedTextAnswers.join(' / ')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* 4. NUMBER INPUT */}
        {(question.type === 'number_input' || (question.numericAnswer && !question.options)) && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputNum}
                  disabled={showReview && !isExamMode}
                  onChange={e => {
                    setInputNum(e.target.value);
                    if (isExamMode) {
                      handleAnswerSubmit(e.target.value);
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !showReview && !isExamMode && inputNum.trim()) {
                      handleAnswerSubmit(inputNum);
                    }
                  }}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {question.numericAnswer?.unit && (
                  <span className="absolute right-3 top-3 text-xs text-zinc-400 font-sans pointer-events-none">
                    {question.numericAnswer.unit}
                  </span>
                )}
              </div>

              {!showReview && !isExamMode && (
                <button
                  onClick={() => handleAnswerSubmit(inputNum)}
                  disabled={!inputNum.trim()}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all"
                >
                  Проверить
                </button>
              )}
            </div>

            {showReview && question.numericAnswer && (
              <div className="text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Точный ответ:</span>{' '}
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {question.numericAnswer.value} {question.numericAnswer.unit}
                </span>
                {question.numericAnswer.tolerance > 0 && (
                  <span className="text-zinc-400 ml-1">
                    (допустима погрешность ±{question.numericAnswer.tolerance})
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* 5. MATCHING PAIRS */}
        {question.type === 'matching' && question.matchingPairs && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2.5">
              {question.matchingPairs.map(pair => {
                const userSelectedRightId = matchingState[pair.id] || '';
                const isPairCorrect = userSelectedRightId === pair.id;

                return (
                  <div
                    key={pair.id}
                    className="p-3 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs sm:text-sm"
                  >
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex-1">
                      <ChemText text={pair.left} inline />
                    </span>

                    <div className="flex items-center gap-2">
                      <select
                        disabled={showReview && !isExamMode}
                        value={userSelectedRightId}
                        onChange={e => {
                          const updated = { ...matchingState, [pair.id]: e.target.value };
                          setMatchingState(updated);
                          if (isExamMode) {
                            handleAnswerSubmit(updated);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-xs bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          showReview
                            ? isPairCorrect
                              ? 'border-emerald-500 text-emerald-700 font-semibold'
                              : 'border-rose-500 text-rose-700'
                            : 'border-zinc-300 dark:border-zinc-700'
                        }`}
                      >
                        <option value="">-- Выберите соответствие --</option>
                        {shuffledRights.map(r => (
                          <option key={r.id} value={r.id}>
                            {formatChemicalText(r.text)}
                          </option>
                        ))}
                      </select>

                      {showReview && (
                        <span>
                          {isPairCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {!showReview && !isExamMode && (
              <button
                onClick={() => handleAnswerSubmit(matchingState)}
                disabled={Object.keys(matchingState).length < question.matchingPairs.length}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all"
              >
                Подтвердить сопоставление
              </button>
            )}
          </div>
        )}

        {/* 6. SORTING / RANKING */}
        {question.type === 'acidity_sorting' && sortingList.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500">
              Используйте стрелки, чтобы расположить вещества в нужном порядке:
            </p>

            <div className="space-y-2">
              {sortingList.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between text-xs sm:text-sm font-medium"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span><ChemText text={item.label} inline /></span>
                  </div>

                  {(!showReview || isExamMode) && (
                    <div className="flex items-center gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveSortingItem(idx, 'up')}
                        className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        disabled={idx === sortingList.length - 1}
                        onClick={() => moveSortingItem(idx, 'down')}
                        className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!showReview && !isExamMode && (
              <button
                onClick={() => handleAnswerSubmit(sortingList)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-all"
              >
                Проверить порядок
              </button>
            )}
          </div>
        )}
      </div>

      {/* FEEDBACK & EXPLANATION PANEL */}
      {showReview && (
        <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 animate-fade">
          {/* Result Banner */}
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs sm:text-sm font-semibold ${
              isAnswerCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
            }`}
          >
            {isAnswerCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Отлично! Ответ абсолютно верный.</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <span>Ответ неверный или неполный. Обратите внимание на разбор:</span>
              </>
            )}
          </div>

          {/* Explanation Text */}
          <div className="bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-4 text-xs text-zinc-700 dark:text-zinc-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>Химическое обоснование:</span>
            </div>
            <div className="leading-relaxed">
              <ChemText text={question.explanation} />
            </div>
          </div>

          {/* Typical Mistake Warning */}
          {question.typicalMistake && !isAnswerCorrect && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Типичная ловушка школьного зачёта:</span>
                <ChemText text={question.typicalMistake} inline />
              </div>
            </div>
          )}

          {/* Next Button in practice mode */}
          {onNext && showFeedbackImmediately && (
            <div className="flex justify-end pt-2">
              <button
                onClick={onNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl text-xs hover:opacity-90 transition-opacity"
              >
                <span>Следующий вопрос</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
