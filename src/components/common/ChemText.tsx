import React from 'react';

const toSub: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  'n': 'ₙ', 'm': 'ₘ', 'k': 'ₖ',
};

const toSup: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  'n': 'ⁿ', 'i': 'ⁱ',
};

/**
 * Transforms LaTeX notation, charges, reaction arrows, and chemical formulas into clean,
 * typographic chemical unicode strings that preserve clipboard copyability and baseline alignment.
 */
export function formatChemicalText(text: string): string {
  if (!text) return '';

  let s = text;

  // 1. Process LaTeX \xrightarrow{...} with potential nested braces (e.g. \xrightarrow{P_{красн},\ t})
  s = s.replace(/\\xrightarrow\{((?:[^{}]|\{[^{}]*\})*)\}/g, (_, cond) => {
    const cleanCond = cond.replace(/[{}]/g, '').replace(/\\,/g, ', ').replace(/\\ /g, ' ').trim();
    return ` ⎯⎯(${cleanCond})→ `;
  });

  // 2. Process LaTeX superscripts: ^{...} or ^x
  s = s.replace(/\^\{([^}]+)\}/g, (_, p1) => {
    if (p1.includes('circ') || p1 === '°') return '°';
    return p1.split('').map((c: string) => toSup[c] || c).join('');
  });
  s = s.replace(/\^([0-9\+\-n])/g, (_, c: string) => toSup[c] || c);
  s = s.replace(/\^°/g, '°');
  s = s.replace(/\\circ/g, '°');

  // 3. Process LaTeX subscripts: _{...} or _x
  s = s.replace(/_\{([^}]+)\}/g, (_, p1) => {
    return p1.split('').map((c: string) => toSub[c] || c).join('');
  });
  s = s.replace(/_([0-9\+\-nmk])/g, (_, c: string) => toSub[c] || c);

  // 4. Equilibrium and reaction arrows
  s = s.replace(/\\rightleftharpoons/g, '⇄');
  s = s.replace(/⇌\(\)⇌/g, '⇄');
  s = s.replace(/⇌/g, '⇄');
  s = s.replace(/\\to/g, '→');
  s = s.replace(/->/g, '→');
  s = s.replace(/<=>/g, '⇄');

  // 5. Hybridization and isotopes
  s = s.replace(/\bsp\^?2\b/gi, 'sp²');
  s = s.replace(/\bsp\^?3\b/gi, 'sp³');
  s = s.replace(/\b18O\b/g, '¹⁸O');
  s = s.replace(/\b14C\b/g, '¹⁴C');

  // 6. Common ions & charges (Ca2+, Mg2+, Ba2+, Fe2+, Fe3+, Al3+, Cu2+, Zn2+, H+, Na+, K+, Ag+, OH-, Cl-, Br-, I-, F-, SO4^2-, CO3^2-, NO3-, HCOO-, CH3COO-, RCOO-)
  s = s.replace(/\b(Ca|Mg|Ba|Fe|Cu|Zn)\s*(?:2\+|\^\{?2\+\}?)/g, '$1²⁺');
  s = s.replace(/\b(Fe|Al)\s*(?:3\+|\^\{?3\+\}?)/g, '$1³⁺');
  s = s.replace(/\b(Na|K|Ag|Li|H)\s*(?:\+|\^\{?\+\}?)/g, '$1⁺');
  s = s.replace(/\b(OH|Cl|Br|I|F|NO3|HCOO|CH3COO|RCOO)\s*(?:-|\^\{?-?\}|⁻)/g, '$1⁻');
  s = s.replace(/\b(SO4|CO3)\s*(?:2-|\^\{?2-?\}|²⁻)/g, '$1²⁻');

  // 7. Strip raw LaTeX math delimiters ($)
  s = s.replace(/\$/g, '');

  // 8. Variable homologous formulas
  s = s.replace(/\bC\s*n\s*H\s*2\s*n\s*O\s*2\b/g, 'CₙH₂ₙO₂');
  s = s.replace(/\bC\s*m\s*H\s*2\s*m\s*\+\s*1\s*COOH\b/g, 'CₘH₂ₘ₊₁COOH');
  s = s.replace(/\bC\s*n\s*H\s*2\s*n\s*-\s*2\s*O\s*4\b/g, 'CₙH₂ₙ₋₂O₄');

  // 9. Chemical formulas: digits immediately following element symbols or closing parenthesis
  s = s.replace(/([A-Z][a-z]?|\))(\d+)/g, (match, prefix, digits, offset, full) => {
    const beforeWord = full.slice(Math.max(0, offset - 8), offset);
    if (/§|№|pH|класс|тема|урок|рис|табл|вар|от|до|\d\s*–/i.test(beforeWord)) {
      return match;
    }
    const subDigits = digits.split('').map((d: string) => toSub[d] || d).join('');
    return prefix + subDigits;
  });

  return s;
}

/**
 * Formats inline segments with bold, italics, code, and chemical typography.
 */
export function renderInlineFormatted(rawText: string): React.ReactNode {
  if (!rawText) return null;

  // Process chemical typography first
  const text = formatChemicalText(rawText);

  // Parse markdown bold (**...**), italics (*...*), code (`...`)
  // Regex to match **bold** or `code` or *italic*
  const tokens: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.substring(lastIndex, match.index));
    }

    const chunk = match[0];
    if (chunk.startsWith('**') && chunk.endsWith('**')) {
      tokens.push(
        <strong key={match.index} className="font-bold text-zinc-900 dark:text-zinc-100">
          {chunk.slice(2, -2)}
        </strong>
      );
    } else if (chunk.startsWith('`') && chunk.endsWith('`')) {
      tokens.push(
        <code
          key={match.index}
          className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold"
        >
          {chunk.slice(1, -1)}
        </code>
      );
    } else if (chunk.startsWith('*') && chunk.endsWith('*')) {
      tokens.push(
        <em key={match.index} className="italic text-zinc-800 dark:text-zinc-200">
          {chunk.slice(1, -1)}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.substring(lastIndex));
  }

  return <>{tokens}</>;
}

interface ChemTextProps {
  text: string;
  inline?: boolean;
  className?: string;
}

/**
 * Reusable component for rendering chemistry text, questions, explanations,
 * theory lessons, and markdown tables with responsive styling.
 */
export const ChemText: React.FC<ChemTextProps> = ({ text, inline, className = '' }) => {
  if (!text) return null;

  // If explicit inline mode, render single span
  if (inline) {
    return <span className={className}>{renderInlineFormatted(text)}</span>;
  }

  // Check if text has markdown tables or multiple lines
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];

  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check for Markdown table: starts and ends with |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2 && tableLines[1].includes('---')) {
        const headerCells = tableLines[0]
          .slice(1, -1)
          .split('|')
          .map(c => c.trim());
        const dataRows = tableLines.slice(2).map(r =>
          r
            .slice(1, -1)
            .split('|')
            .map(c => c.trim())
        );

        blocks.push(
          <div
            key={blockKey++}
            className="my-3 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-100/90 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 font-bold border-b border-zinc-200 dark:border-zinc-800">
                  {headerCells.map((h, hIdx) => (
                    <th key={hIdx} className="p-2.5 sm:p-3">
                      {renderInlineFormatted(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                {dataRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`p-2.5 sm:p-3 text-zinc-700 dark:text-zinc-300 ${
                          cIdx === 0 ? 'font-medium' : ''
                        }`}
                      >
                        {renderInlineFormatted(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Unordered list item (- or *)
    if (/^\s*[-*]\s+/.test(rawLine)) {
      const listContent = rawLine.replace(/^\s*[-*]\s+/, '');
      blocks.push(
        <div key={blockKey++} className="flex items-start gap-2 my-1 pl-2">
          <span className="text-indigo-500 font-bold leading-none mt-1.5">•</span>
          <div className="flex-1 leading-relaxed">{renderInlineFormatted(listContent)}</div>
        </div>
      );
      i++;
      continue;
    }

    // Numbered list item (1. or 2.)
    const numMatch = rawLine.match(/^(\s*)(\d+)\.\s+(.*)$/);
    if (numMatch) {
      const num = numMatch[2];
      const listContent = numMatch[3];
      blocks.push(
        <div key={blockKey++} className="flex items-start gap-2 my-1 pl-2">
          <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-xs mt-0.5">
            {num}.
          </span>
          <div className="flex-1 leading-relaxed">{renderInlineFormatted(listContent)}</div>
        </div>
      );
      i++;
      continue;
    }

    // Empty line (paragraph break)
    if (!trimmed) {
      blocks.push(<div key={blockKey++} className="h-2" />);
      i++;
      continue;
    }

    // Regular text line
    blocks.push(
      <p key={blockKey++} className="leading-relaxed">
        {renderInlineFormatted(rawLine)}
      </p>
    );
    i++;
  }

  return <div className={`space-y-1 ${className}`}>{blocks}</div>;
};
