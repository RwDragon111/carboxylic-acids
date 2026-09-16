import React, { useState } from 'react';
import { generateExamSession } from '../../utils/questionGenerator';
import { getAcidById } from '../../data/acids';
import { QuestionType, QuizQuestion } from '../../types/chemistry';
import { MoleculeDiagram } from '../../components/common/MoleculeDiagram';
import { ProgressBar } from '../../components/common/ProgressBar';
import { playClickSound, playSuccessSound } from '../../utils/audio';
import { GraduationCap, ArrowRight, RotateCcw, CheckCircle2, XCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExamProps {
  onRecordAnswer: (acidId: string, isCorrect: boolean, questionType: QuestionType) => void;
  soundEnabled: boolean;
}

interface ExamUserAnswer {
  question: QuizQuestion;
  selectedOptionId: string;
  isCorrect: boolean;
}

export const Exam: React.FC<ExamProps> = ({ onRecordAnswer, soundEnabled }) => {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<ExamUserAnswer[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const startExam = () => {
    playClickSound(soundEnabled);
    const generated = generateExamSession(); // 20 questions
    setQuestions(generated);
    setCurrentIndex(0);
    setUserAnswers([]);
    setSelectedOptionId(null);
    setIsFinished(false);
  };

  const handleSelectOption = (optionId: string) => {
    playClickSound(soundEnabled);
    setSelectedOptionId(optionId);
  };

  const handleNextQuestion = () => {
    if (!questions || selectedOptionId === null) return;

    const currentQ = questions[currentIndex];
    const isCorrect = selectedOptionId === currentQ.correctOptionId;

    const answerRecord: ExamUserAnswer = {
      question: currentQ,
      selectedOptionId,
      isCorrect,
    };

    const newAnswers = [...userAnswers, answerRecord];
    setUserAnswers(newAnswers);

    // Record into global progress & statistics silently
    onRecordAnswer(currentQ.acidId, isCorrect, currentQ.type);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
    } else {
      setIsFinished(true);
      playSuccessSound(soundEnabled);
      const finalScore = newAnswers.filter(a => a.isCorrect).length;
      if (finalScore >= 16) {
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch {}
      }
    }
  };

  // Start Screen
  if (!questions) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-6 animate-fade">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-500/20 text-indigo-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
          <GraduationCap className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Контрольный экзамен
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
            20 вопросов по всем 12 кислотам, формулам, структурам, ряду «Шмяга» и анионам. Подсказок нет. Результаты и подробный разбор ошибок будут показаны в самом конце.
          </p>
        </div>

        <button
          onClick={startExam}
          className="w-full sm:w-auto py-4 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          Начать экзамен (20 вопросов)
        </button>
      </div>
    );
  }

  // Final Results & Review Screen
  if (isFinished) {
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const mistakes = userAnswers.filter(a => !a.isCorrect);

    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-fade">
        {/* Score Banner */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto border border-indigo-500/20">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Результаты экзамена
          </h2>

          <div className="flex items-center justify-center gap-8 py-2">
            <div>
              <span className="text-xs font-semibold uppercase text-zinc-400">Верно ответов</span>
              <div className="text-4xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
                {correctCount} <span className="text-xl text-zinc-400">/ 20</span>
              </div>
            </div>
            <div className="w-px h-12 bg-zinc-200 dark:bg-zinc-800" />
            <div>
              <span className="text-xs font-semibold uppercase text-zinc-400">Результат</span>
              <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {accuracy}%
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={startExam}
              className="py-3 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm inline-flex items-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Пересдать экзамен</span>
            </button>
          </div>
        </div>

        {/* Detailed Breakdown of Mistakes */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {mistakes.length === 0
              ? '🎉 Идеально! Ни одной ошибки!'
              : `Разбор допущенных ошибок (${mistakes.length}):`}
          </h3>

          <div className="space-y-4">
            {mistakes.map((ans, idx) => {
              const q = ans.question;
              const acid = getAcidById(q.acidId);
              const userOpt = q.options.find(o => o.id === ans.selectedOptionId);
              const correctOpt = q.options.find(o => o.id === q.correctOptionId);

              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                      Вопрос #{idx + 1}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {acid?.trivialName}
                    </span>
                  </div>

                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                    {q.prompt}
                  </h4>

                  {q.promptFormula && (
                    <div className="font-mono text-base font-bold text-zinc-800 dark:text-zinc-200">
                      {q.promptFormula}
                    </div>
                  )}

                  {/* Answers Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-500/30 text-xs">
                      <span className="font-semibold text-red-600 dark:text-red-400 block mb-1">
                        ❌ Твой ответ:
                      </span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {userOpt?.text || userOpt?.formula || 'Выбранная структура'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-xs">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                        ✅ Правильный ответ:
                      </span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {correctOpt?.text || correctOpt?.formula || 'Правильная структура'}
                      </span>
                    </div>
                  </div>

                  {/* Structural Formula */}
                  {acid && (
                    <div className="pt-2">
                      <MoleculeDiagram
                        src={acid.structureAsset}
                        alt={acid.trivialName}
                        maxHeight="max-h-24"
                        className="w-full max-w-sm"
                      />
                    </div>
                  )}

                  {/* Explanation */}
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Question Screen (No hints, no immediate feedback)
  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fade">
      <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
          <GraduationCap className="w-4 h-4" />
          Экзамен
        </span>
        <span>Вопрос {currentIndex + 1} из 20</span>
      </div>

      <ProgressBar current={currentIndex + 1} total={20} />

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
          {currentQ.prompt}
        </h3>

        {currentQ.promptFormula && (
          <div className="flex justify-center py-2">
            <span className="font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-4 py-1.5 rounded-xl border border-indigo-500/20">
              {currentQ.promptFormula}
            </span>
          </div>
        )}

        {currentQ.promptStructureAsset && (
          <div className="flex justify-center py-2">
            <MoleculeDiagram
              src={currentQ.promptStructureAsset}
              alt="Структура"
              maxHeight="max-h-44 sm:max-h-52"
              className="w-full max-w-md"
            />
          </div>
        )}

        {/* Options list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group active:scale-98 ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/30'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  {option.structureAsset ? (
                    <MoleculeDiagram
                      src={option.structureAsset}
                      alt="Вариант"
                      maxHeight="max-h-24"
                      className="w-full"
                    />
                  ) : (
                    <span className="font-semibold text-sm sm:text-base">
                      {option.text || option.formula}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          disabled={selectedOptionId === null}
          onClick={handleNextQuestion}
          className="py-3 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all"
        >
          <span>{currentIndex < 19 ? 'Следующий вопрос' : 'Завершить экзамен'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
