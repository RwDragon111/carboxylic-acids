import React, { useState } from 'react';
import { ACIDS, ANION_ACID_IDS } from '../../data/acids';
import { MoleculeDiagram } from '../../components/common/MoleculeDiagram';
import { AnionMechanism } from '../../components/chemistry/AnionMechanism';
import { QuestionType } from '../../types/chemistry';
import { generateQuestion } from '../../utils/questionGenerator';
import { AnswerButton, ButtonStatus } from '../../components/common/AnswerButton';
import { playClickSound, playSuccessSound, playErrorSound } from '../../utils/audio';
import { Zap, ArrowRight, BookOpen, HelpCircle } from 'lucide-react';

interface AnionsProps {
  onRecordAnswer: (acidId: string, isCorrect: boolean, questionType: QuestionType) => void;
  soundEnabled: boolean;
}

export const Anions: React.FC<AnionsProps> = ({ onRecordAnswer, soundEnabled }) => {
  const [activeTab, setActiveTab] = useState<'study' | 'quiz'>('study');

  // Quiz state
  const anionQuestionTypes: QuestionType[] = [
    'acid_to_anion',
    'anion_to_acid',
    'anion_formula_to_name',
    'anion_name_to_formula',
    'anion_structure_to_name',
  ];

  const [currentQuestion, setCurrentQuestion] = useState(() =>
    generateQuestion(anionQuestionTypes[Math.floor(Math.random() * anionQuestionTypes.length)])
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const anionAcids = ACIDS.filter(a => ANION_ACID_IDS.includes(a.id) && a.hasAnionQuiz && a.anion);

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

  const nextQuestion = () => {
    playClickSound(soundEnabled);
    const nextType = anionQuestionTypes[Math.floor(Math.random() * anionQuestionTypes.length)];
    setCurrentQuestion(generateQuestion(nextType));
    setSelectedOptionId(null);
    setIsAnswered(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-500/20">
          <Zap className="w-3.5 h-3.5" />
          <span>Специальный раздел</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
          Анионы карбоновых кислот
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          В курсе изучаются названия, формулы и структуры строго 6 анионов: формиат, ацетат, лактат, бензоат, салицилат, оксалат.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => {
            playClickSound(soundEnabled);
            setActiveTab('study');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'study'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Справочник и теория</span>
        </button>

        <button
          onClick={() => {
            playClickSound(soundEnabled);
            setActiveTab('quiz');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'quiz'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Тренировка анионов</span>
        </button>
      </div>

      {/* Tab 1: Theory & Catalog */}
      {activeTab === 'study' && (
        <div className="space-y-8 animate-fade">
          {/* Visual Dissociation Mechanism */}
          <AnionMechanism />

          {/* Catalog of 6 Permitted Anions */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              6 изучаемых анионов
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anionAcids.map(acid => {
                const anion = acid.anion!;
                return (
                  <div
                    key={acid.id}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-semibold text-zinc-400">
                          Кислота: {acid.trivialName}
                        </span>
                        <h4 className="text-lg font-bold text-amber-600 dark:text-amber-400">
                          {anion.name}
                        </h4>
                      </div>

                      <span className="font-mono text-sm font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        {anion.formula}
                      </span>
                    </div>

                    <MoleculeDiagram
                      src={anion.structureAsset}
                      alt={`Анион ${anion.name}`}
                      maxHeight="max-h-28"
                      className="w-full bg-white dark:bg-zinc-100"
                    />

                    {anion.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {anion.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dedicated Anions Quiz */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <span>Тренировка анионов</span>
              <span>6 веществ</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
              {currentQuestion.prompt}
            </h3>

            {currentQuestion.promptFormula && (
              <div className="flex justify-center py-2">
                <span className="font-mono text-3xl font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-5 py-2 rounded-xl border border-amber-500/30">
                  {currentQuestion.promptFormula}
                </span>
              </div>
            )}

            {currentQuestion.promptStructureAsset && (
              <div className="flex justify-center py-2">
                <MoleculeDiagram
                  src={currentQuestion.promptStructureAsset}
                  alt="Структура аниона"
                  maxHeight="max-h-36 sm:max-h-44"
                  className="w-full max-w-sm"
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
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {currentQuestion.explanation}
              </p>

              <div className="flex justify-end">
                <button
                  onClick={nextQuestion}
                  className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm inline-flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Следующий вопрос</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
