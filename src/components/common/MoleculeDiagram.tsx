import React from 'react';

interface MoleculeDiagramProps {
  src: string;
  alt: string;
  className?: string;
  maxHeight?: string;
  title?: string;
  showPaperBg?: boolean;
}

export const MoleculeDiagram: React.FC<MoleculeDiagramProps> = ({
  src,
  alt,
  className = '',
  maxHeight = 'max-h-56',
  title,
  showPaperBg = true,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
        showPaperBg
          ? 'bg-white shadow-sm border-zinc-200 dark:border-zinc-700/60 dark:bg-zinc-100'
          : 'bg-transparent border-transparent'
      } ${className}`}
      title={title || alt}
    >
      <img
        src={src}
        alt={alt}
        className={`w-auto h-auto object-contain select-none transition-transform duration-200 ${maxHeight}`}
        loading="eager"
        draggable={false}
      />
    </div>
  );
};
