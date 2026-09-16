import React, { useState } from 'react';
import { ACIDS, getAcidById } from '../../data/acids';
import { AcidMastery, QuestionType } from '../../types/chemistry';
import { MoleculeDiagram } from '../../components/common/MoleculeDiagram';
import { generateQuestion } from '../../utils/questionGenerator';
import { AnswerButton, ButtonStatus } from '../../components/common/AnswerButton';
import { playClickSound, playSuccessSound, playErrorSound } from '../../utils/audio';
import { AlertTriangle, Sparkles, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';

interface MistakesProps {
  perAcidProgress: Record<string, AcidMastery>;
  onRecordAnswer: (acidId: string, isCorrect: boolean, questionType: QuestionType) => void;
  soundEnabled: boolean;
}

export const Mistakes: React.FC<MistakesProps> = ({
  perAcidProgress,
  onRecordAnswer,
  soundEnabled,
}) => {
  // Find acids that have wrong answers or accuracy < 70%
  const weakAcids = ACIDS.map(acid => {
    const progress = perAcidProgress[acid.id] || {
      correctAnswers: 0,
      wrongAnswers: 0,
      streak: 0,
      mastery: 0,
      difficultyWeight: 1.0,
    };
    const total = progress.correctAnswers + progress.wrongAnswers;
    const accuracy = total > 0 ? Math.round((progress.correctAnswers / total) * 100) : 100;
    return {
      acid,
      progress,
      total,
      accuracy,
    };
  })
    .filter(item => item.progress.wrongAnswers > 0 || (item.total > 0 && item.accuracy < 70))
    .sort((a, b) => a.accuracy - b.accuracy);

  // Practice mode state
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(() => generateQuestion());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const startMistakesPractice = () => {
    if (weakAcids.length === 0) return;
    playClickSound(soundEnabled);
    const target = weakAcids[Math.floor(Math.random() * weakAcids.length)].acid;
    setCurrentQuestion(generateQuestion(undefined, target.id, perAcidProgress));
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsPracticing(true);
  };

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const isCorrect = optionId === currentQuestion.correctOptionId;
    if (isCorrect) {
      playSuccessSound(soundEnabled);
    } else {
      playErrorSound(soundEnabled);
    }

    onRecordAnswer(currentQuestion.acidId, isCorrect, currentQuestion.type);
  };

  const nextMistakeQuestion = () => {
    playClickSound(soundEnabled);
    const target = weakAcids[Math.floor(Math.random() * weakAcids.length)].acid;
    setCurrentQuestion(generateQuestion(undefined, target.id, perAcidProgress));
    setSelectedOptionId(null);
    setIsAnswered(false);
  };

  if (isPracticing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fade">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              Режим отработки ошибок
            </span>
          </div>
          <button
            onClick={() => setIsPracticing(false)}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Выйти к списку
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {currentQuestion.prompt}
          </h3>

          {currentQuestion.promptFormula && (
            <div className="flex justify-center py-2">
              <span className="font-mono text-2xl font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-4 py-1 rounded-xl border border-rose-500/30">
                {currentQuestion.promptFormula}
              </span>
            </div>
          )}

          {currentQuestion.promptStructureAsset && (
            <div className="flex justify-center py-2">
              <MoleculeDiagram
                src={currentQuestion.promptStructureAsset}
                alt="Структура"
                maxHeight="max-h-44"
                className="w-full max-w-md"
              />
            </div>
          )}

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

        {isAnswered && (
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 animate-fade space-y-3">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {currentQuestion.explanation}
            </p>
            <div className="flex justify-end">
              <button
                onClick={nextMistakeQuestion}
                className="py-2.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm inline-flex items-center gap-2 shadow-sm"
              >
                <span>Следующий проблемный вопрос</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Анализ ошибок</span>
        </div>
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
          Слабые вещества
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Здесь отображаются реальные кислоты, в которых были допущены ошибки во время квизов и экзаменов.
        </p>
      </div>

      {/* Main List */}
      {weakAcids.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Ошибок пока нет!
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Вы отлично справляетесь или ещё не проходили квизы. Ошибочные вещества автоматически появятся здесь.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Найдено проблемных веществ: {weakAcids.length}
            </span>
            <button
              onClick={startMistakesPractice}
              className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm flex items-center gap-2 shadow-sm shadow-rose-600/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Тренировать ошибки</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weakAcids.map(({ acid, progress, total, accuracy }) => (
              <div
                key={acid.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                      {acid.trivialName}
                    </h4>
                    <span className="text-xs text-zinc-400">{acid.systematicName}</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                      accuracy < 50
                        ? 'bg-red-50 dark:bg-red-950/60 text-red-600 border-red-500/30'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 border-amber-500/30'
                    }`}
                  >
                    {accuracy}%
                  </span>
                </div>

                <MoleculeDiagram
                  src={acid.structureAsset}
                  alt={acid.trivialName}
                  maxHeight="max-h-24"
                  className="w-full"
                />

                <div className="flex justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span>Ошибок: {progress.wrongAnswers}</span>
                  <span>Всего ответов: {total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
