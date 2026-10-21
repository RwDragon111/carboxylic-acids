import { useState } from 'react';

const sugars = [
  { name: 'D-глюкоза', top: 'CHO', rows: ['right', 'left', 'right', 'right'], bottom: 'CH₂OH', note: 'Альдогексоза: –CHO и 5 групп –OH' },
  { name: 'D-фруктоза', top: 'CH₂OH', rows: ['keto', 'left', 'right', 'right'], bottom: 'CH₂OH', note: 'Кетогексоза: C=O при C₂ и 5 групп –OH' },
  { name: 'D-рибоза', top: 'CHO', rows: ['right', 'right', 'right'], bottom: 'CH₂OH', note: 'Альдопентоза: –CHO и 4 группы –OH' },
  { name: '2-дезокси-D-рибоза', top: 'CHO', rows: ['deoxy', 'right', 'right'], bottom: 'CH₂OH', note: 'Альдопентоза: при C₂ два атома H' },
];

export function FischerStructures() {
  return <div className="grid sm:grid-cols-2 gap-4 my-4">
    {sugars.map(s => <figure key={s.name} className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 bg-zinc-50 dark:bg-zinc-950">
      <figcaption className="font-semibold text-center text-sm">{s.name}</figcaption>
      <svg viewBox="0 0 260 330" role="img" aria-label={`Проекция Фишера: ${s.name}. ${s.note}`} className="w-full h-64 text-zinc-800 dark:text-zinc-100">
        <g fill="currentColor" textAnchor="middle" fontSize="19" fontFamily="system-ui">
          <text x="130" y="30">{s.top}</text>
          {s.rows.map((row, i) => {
            const y = 77 + i * 53;
            return <g key={i}>
              <line x1="130" y1={y - 34} x2="130" y2={y - 13} stroke="currentColor" />
              <text x="130" y={y + 6}>C</text>
              {row === 'keto' ? <>
                <line x1="143" y1={y - 4} x2="177" y2={y - 4} stroke="currentColor" />
                <line x1="143" y1={y + 3} x2="177" y2={y + 3} stroke="currentColor" />
                <text x="195" y={y + 6}>O</text>
              </> : <>
                <line x1="80" y1={y} x2="116" y2={y} stroke="currentColor" />
                <line x1="144" y1={y} x2="180" y2={y} stroke="currentColor" />
                <text x="58" y={y + 6}>{row === 'left' ? 'HO' : 'H'}</text>
                <text x="207" y={y + 6}>{row === 'right' ? 'OH' : 'H'}</text>
              </>}
              <text x="245" y={y + 5} fontSize="12" fill="currentColor" opacity="0.6">{i + 2}</text>
            </g>;
          })}
          <line x1="130" y1={77 + (s.rows.length - 1) * 53 + 15} x2="130" y2={77 + (s.rows.length - 1) * 53 + 34} stroke="currentColor" />
          <text x="130" y={77 + s.rows.length * 53 + 2}>{s.bottom}</text>
        </g>
      </svg>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center">{s.note}</p>
    </figure>)}
  </div>;
}

function Ring({ beta, fructose }: { beta: boolean; fructose?: boolean }) {
  const vertices = fructose
    ? [[292, 136], [241, 210], [127, 210], [76, 136]]
    : [[302, 140], [245, 210], [130, 210], [72, 140], [130, 70]];
  const labels = fructose
    ? [[292, beta ? 89 : 185, 'OH'], [292, beta ? 185 : 89, 'CH₂OH'], [241, 166, 'OH'], [127, 260, 'OH'], [76, 89, 'CH₂OH']]
    : [[302, beta ? 92 : 187, 'OH'], [245, 260, 'OH'], [130, 166, 'OH'], [72, 187, 'OH'], [130, 25, 'CH₂OH']];
  const oxygen = fructose ? [230, 70] : [245, 70];
  const points = [...vertices, oxygen].map(p => p.join(',')).join(' ');
  const name = `${beta ? 'β' : 'α'}-D-${fructose ? 'фруктофураноза' : 'глюкопираноза'}`;
  return <figure className="min-w-0 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2">
    <figcaption className="text-sm text-center font-semibold">{name}</figcaption>
    <svg viewBox="0 0 380 285" role="img" aria-label={`${name}. Показаны кислород кольца, гидроксилы и группы CH₂OH; атомы H при углеродах опущены.`} className="w-full text-zinc-800 dark:text-zinc-100">
      <polyline points={`${points} ${vertices[0].join(',')}`} fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x={oxygen[0] - 12} y={oxygen[1] - 14} width="24" height="25" className="fill-white dark:fill-zinc-900" />
      <text x={oxygen[0]} y={oxygen[1] + 6} fill="currentColor" textAnchor="middle" fontSize="20">O</text>
      {labels.map((label, i) => {
        const [x, y, text] = label as [number, number, string];
        const v = vertices[fructose && i === 1 ? 0 : fructose && i > 1 ? i - 1 : i];
        return <g key={i} fill="currentColor" textAnchor="middle" fontSize="17">
          <line x1={v[0]} y1={v[1]} x2={x} y2={y > v[1] ? y - 18 : y + 8} stroke="currentColor" />
          <text x={x} y={y}>{text}</text>
        </g>;
      })}
      {vertices.map(([x, y], i) => <text key={i} x={x + 9} y={y + 17} fill="currentColor" opacity="0.6" fontSize="11">{i + (fructose ? 2 : 1)}</text>)}
    </svg>
  </figure>;
}

export function RingStructures() {
  const [beta, setBeta] = useState(false);
  return <div className="my-4 space-y-3">
    <div className="flex gap-2" aria-label="Аномер циклической формы">
      {[false, true].map(b => <button key={String(b)} aria-pressed={b === beta} onClick={() => setBeta(b)} className={`carb-button ${b === beta ? 'carb-selected' : ''}`}>{b ? 'β-форма' : 'α-форма'}</button>)}
    </div>
    <div className="grid sm:grid-cols-2 gap-3"><Ring beta={beta} /><Ring beta={beta} fructose /></div>
    <p className="text-xs text-zinc-600 dark:text-zinc-400">Формулы Хеуорса: вершины без букв — атомы C, атомы H при них для ясности опущены. Переключатель меняет положение аномерного –OH. У фруктозы одновременно меняется положение CH₂OH при C₂.</p>
  </div>;
}

export function BondStructures() {
  return <div className="my-4 space-y-3">
    {[
      ['Сахароза', 'Глюкоза C₁', 'Фруктоза C₂', 'α,β-1↔2', 'Оба аномерных центра заняты'],
      ['Мальтоза', 'Глюкоза C₁', 'Глюкоза C₄', 'α-1→4', 'C₁ второго остатка свободен'],
      ['Лактоза', 'Галактоза C₁', 'Глюкоза C₄', 'β-1→4', 'C₁ глюкозы свободен'],
      ['Целлобиоза', 'Глюкоза C₁', 'Глюкоза C₄', 'β-1→4', 'C₁ второго остатка свободен'],
    ].map(([name, left, right, bond, note]) => <figure key={name} className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-3">
      <figcaption className="font-semibold text-sm mb-2">{name} · {bond}</figcaption>
      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-center">
        <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 p-2 rounded-lg">{left}</span>
        <span className="font-semibold">— O —</span>
        <span className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">{right}</span>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 text-center">{note}</p>
    </figure>)}
    <p className="text-xs text-zinc-500">Схемы показывают состав и соединённые атомы, а не полные структурные формулы молекул.</p>
  </div>;
}
