import React from 'react';
import { AcidData, AcidMastery } from '../../types/chemistry';
import { MoleculeDiagram } from '../common/MoleculeDiagram';
import { ExternalLink, Star } from 'lucide-react';

interface AcidCardProps {
  acid: AcidData;
  mastery?: AcidMastery;
  hideDetails?: {
    name?: boolean;
    formula?: boolean;
    explanation?: boolean;
  };
  showAnionDetails?: boolean;
  className?: string;
}

export const AcidCard: React.FC<AcidCardProps> = ({
  acid,
  mastery,
  hideDetails = {},
  showAnionDetails = true,
  className = '',
}) => {
  const masteryScore = mastery?.mastery ?? 0;

  return (
    <div
      className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-all duration-200 ${className}`}
    >
      {/* Header with Title and Mastery */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          {hideDetails.name ? (
            <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          ) : (
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {acid.trivialName}
            </h3>
          )}

          {!hideDetails.name && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
              {acid.systematicName}
            </p>
          )}
        </div>

        {/* Mastery stars */}
        {mastery && (
          <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= masteryScore
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-zinc-300 dark:text-zinc-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Structural Formula in Paper Card */}
      <div className="my-4">
        <MoleculeDiagram
          src={acid.structureAsset}
          alt={`Структурная формула ${acid.trivialName}`}
          maxHeight="max-h-48 sm:max-h-56"
          className="w-full"
        />
      </div>

      {/* Formula & PubChem Meta */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
            Формула:
          </span>
          {hideDetails.formula ? (
            <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          ) : (
            <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">
              {acid.molecularFormula}
            </span>
          )}
        </div>

        <a
          href={`https://pubchem.ncbi.nlm.nih.gov/compound/${acid.pubchemCid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 flex items-center gap-1 transition-colors"
          title="Проверить в PubChem NCBI"
        >
          <span>CID {acid.pubchemCid}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Explanation / Notes */}
      {!hideDetails.explanation && acid.explanation && (
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
          {acid.explanation}
        </p>
      )}

      {/* Anion Section (Only if applicable) */}
      {showAnionDetails && acid.hasAnionQuiz && acid.anion && (
        <div className="mt-4 pt-4 border-t border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400">
              Изучаемый анион: {acid.anion.name}
            </span>
            <span className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
              {acid.anion.formula}
            </span>
          </div>

          <MoleculeDiagram
            src={acid.anion.structureAsset}
            alt={`Анион ${acid.anion.name}`}
            maxHeight="max-h-28"
            className="w-full bg-white dark:bg-zinc-100"
          />
        </div>
      )}
    </div>
  );
};
