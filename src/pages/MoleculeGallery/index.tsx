import React from 'react';
import { ACIDS, ANION_ACID_IDS } from '../../data/acids';
import { MoleculeDiagram } from '../../components/common/MoleculeDiagram';
import { ExternalLink, CheckCircle, ShieldCheck } from 'lucide-react';

export const MoleculeGallery: React.FC = () => {
  const anionAcids = ACIDS.filter(a => ANION_ACID_IDS.includes(a.id) && a.hasAnionQuiz && a.anion);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Верифицировано по PubChem NCBI</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
          Галерея всех химических структур
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Полная визуальная инспекция 12 карбоновых кислот и 6 анионов в едином учебном векторном стиле (SVG).
        </p>
      </div>

      {/* 12 Acids Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>12 Карбоновых кислот</span>
            <span className="text-xs font-normal text-zinc-400 font-mono">(12 веществ)</span>
          </h3>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Все структуры локальны (100% Offline)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACIDS.map(acid => (
            <div
              key={acid.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {acid.trivialName}
                    </h4>
                    <p className="text-xs text-zinc-400 font-medium">
                      {acid.systematicName}
                    </p>
                  </div>

                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {acid.molecularFormula}
                  </span>
                </div>

                {/* SVG Structure */}
                <div className="my-3">
                  <MoleculeDiagram
                    src={acid.structureAsset}
                    alt={acid.trivialName}
                    maxHeight="max-h-40"
                    className="w-full"
                  />
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  {acid.explanation}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span>{acid.category}</span>
                <a
                  href={`https://pubchem.ncbi.nlm.nih.gov/compound/${acid.pubchemCid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1"
                >
                  <span>PubChem CID {acid.pubchemCid}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Anions Section */}
      <div className="space-y-6 pt-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>6 Изучаемых анионов</span>
            <span className="text-xs font-normal text-amber-500 font-mono">(строго разрешённые)</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Анионы малоновой, янтарной, глутаровой, адипиновой, фталевой и терефталевой кислот не изучаются и исключены из квизов.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {anionAcids.map(acid => {
            const anion = acid.anion!;
            return (
              <div
                key={acid.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-zinc-400 font-medium">
                      От: {acid.trivialName}
                    </span>
                    <h4 className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {anion.name}
                    </h4>
                  </div>

                  <span className="font-mono text-sm font-extrabold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    {anion.formula}
                  </span>
                </div>

                <MoleculeDiagram
                  src={anion.structureAsset}
                  alt={anion.name}
                  maxHeight="max-h-32"
                  className="w-full"
                />

                {anion.description && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {anion.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
