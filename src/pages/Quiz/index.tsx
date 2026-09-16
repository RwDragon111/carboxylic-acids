import React, { useState } from 'react';
import { generateQuizSession } from '../../utils/questionGenerator';
import { AcidMastery, QuestionType, QuizQuestion } from '../../types/chemistry';
import { getAcidById } from '../../data/acids';
import { AnswerButton, ButtonStatus } from '../../components/common/AnswerButton';
import { ProgressBar } from '../../components/common/ProgressBar';
import { MoleculeDiagram } from '../../components/common/MoleculeDiagram';
import { playSuccessSound, playErrorSound, playClickSound } from '../../utils/audio';
import { useHotkeys } from '../../hooks/useHotkeys';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface QuizProps {
  perAcidProgress: Record<string, AcidMastery>;
  onRecordAnswer: (acidId: string, isCorrect: boolean, questionType: QuestionType) => void;
  soundEnabled: boolean;
  onNavigateMistakes: () => void;
}

export const Quiz: React.FC<QuizProps> = ({
  perAcidProgress,
  onRecordAnswer,
  soundEnabled,
  onNavigateMistakes,
}) => {
  const [sessionLength, setSessionLength] = useState<number>(10);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const startQuiz = (length: number) => {
    playClickSound(soundEnabled);
    setSessionLength(length);
    const generated = generateQuizSession(length, perAcidProgress);
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const currentQuestion = questions ? questions[currentIndex] : null;

  const handleSelectOption = (optionId: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const isCorrect = optionId === currentQuestion.correctOptionId;
    if (isCorrect) {
      setScore(s => s + 1);
      playSuccessSound(soundEnabled);
    } else {
      playErrorSound(soundEnabled);
    }

    onRecordAnswer(currentQuestion.acidId, isCorrect, currentQuestion.type);
  };

  const handleNext = () => {
    if (!questions) return;
    playClickSound(soundEnabled);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  // Setup hotkeys: 1-4 for options, Enter for next
  useHotkeys({
    onOption1: () => {
      if (!isAnswered && currentQuestion?.options[0]) {
        handleSelectOption(currentQuestion.options[0].id);
      }
    },
    onOption2: () => {
      if (!isAnswered && currentQuestion?.options[1]) {
        handleSelectOption(currentQuestion.options[1].id);
      }
    },
    onOption3: () => {
      if (!isAnswered && currentQuestion?.options[2]) {
        handleSelectOption(currentQuestion.options[2].id);
      }
    },
    onOption4: () => {
      if (!isAnswered && currentQuestion?.options[3]) {
        handleSelectOption(currentQuestion.options[3].id);
      }
    },
    onEnter: () => {
      if (isAnswered && !isFinished) {
        handleNext();
      }
    },
    enabled: !!questions && !isFinished,
  });

  // Length selection screen
  if (!questions) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-6 animate-fade">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Квиз по карбоновым кислотам
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Выберите количество вопросов для тренировки. Типы вопросов и правдоподобные дистракторы подбираются адаптивно.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4">
          {[10, 15, 20].map(len => (
            <button
              key={len}
              onClick={() => startQuiz(len)}
              className="py-6 px-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all text-center group shadow-sm active:scale-95"
            >
              <span className="block text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {len}
              </span>
              <span className="text-xs font-semibold text-zinc-400 mt-1 block">
                вопросов
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Quiz Finished Screen
  if (isFinished) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center space-y-6 animate-fade">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <Trophy className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Квиз завершён!
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Отличная тренировка! Результаты сохранены в статистику.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center justify-around">
          <div>
            <span className="text-xs font-semibold uppercase text-zinc-400">Счёт</span>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-0.5">
              {score} / {questions.length}
            </div>
          </div>
          <div className="w-px h-12 bg-zinc-200 dark:bg-zinc-800" />
          <div>
            <span className="text-xs font-semibold uppercase text-zinc-400">Точность</span>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {accuracy}%
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => startQuiz(sessionLength)}
            className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Пройти ещё раз</span>
          </button>

          {accuracy < 100 && (
            <button
              onClick={onNavigateMistakes}
              className="flex-1 py-3.5 px-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold transition-all active:scale-95"
            >
              Тренировать ошибки
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const targetAcid = getAcidById(currentQuestion.acidId);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-fade">
      {/* Progress header */}
      <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        <span>Вопрос {currentIndex + 1} из {questions.length}</span>
        <span>Счёт: {score}</span>
      </div>

      <ProgressBar current={currentIndex + 1} total={questions.length} />

      {/* Question Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
          {currentQuestion.prompt}
        </h3>

        {/* Optional Prompt Formula */}
        {currentQuestion.promptFormula && (
          <div className="flex justify-center py-2">
            <span className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-1.5 rounded-xl border border-emerald-500/20">
              {currentQuestion.promptFormula}
            </span>
          </div>
        )}

        {/* Optional Prompt Structure */}
        {currentQuestion.promptStructureAsset && (
          <div className="flex justify-center py-2">
            <MoleculeDiagram
              src={currentQuestion.promptStructureAsset}
              alt="Структура вещества"
              maxHeight="max-h-44 sm:max-h-52"
              className="w-full max-w-md"
            />
          </div>
        )}

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentQuestion.options.map((option, idx) => {
            let status: ButtonStatus = 'default';
            if (isAnswered) {
              if (option.id === currentQuestion.correctOptionId) {
                status = 'correct';
              } else if (option.id === selectedOptionId) {
                status = 'wrong';
              }
            } else if (option.id === selectedOptionId) {
              status = 'selected';
            }

            return (
              <AnswerButton
                key={option.id}
                option={option}
                index={idx}
                status={status}
                disabled={isAnswered}
                onClick={() => handleSelectOption(option.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Feedback & Explanation Card */}
      {isAnswered && (
        <div
          className={`p-5 rounded-2xl border transition-all animate-fade ${
            selectedOptionId === currentQuestion.correctOptionId
              ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-900 dark:text-emerald-100'
              : 'bg-red-50/80 dark:bg-red-950/30 border-red-500/30 text-red-900 dark:text-red-100'
          }`}
        >
          <div className="flex items-center gap-2 mb-2 font-bold text-base">
            {selectedOptionId === currentQuestion.correctOptionId ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Верно!</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span>Неверно!</span>
              </>
            )}
          </div>

          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {currentQuestion.explanation}
          </p>

          {/* Show full correct structure for review */}
          {targetAcid && !currentQuestion.promptStructureAsset && (
            <div className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-2">
                Структурная формула {targetAcid.trivialName}:
              </span>
              <MoleculeDiagram
                src={targetAcid.structureAsset}
                alt={targetAcid.trivialName}
                maxHeight="max-h-28"
                className="w-full max-w-sm mx-auto"
              />
            </div>
          )}

          {/* Next Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleNext}
              className="py-2.5 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 font-semibold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <span>{currentIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить квиз'}</span>
              <ArrowRight className="w-4 h-4" />
              <span className="text-[10px] opacity-60 font-mono">[Enter]</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
