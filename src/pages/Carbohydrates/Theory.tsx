import { useEffect, useRef, useState } from 'react';
import { CARB_LESSONS, CARB_SOURCE } from '../../data/carbohydrates/lessons';
import { ChemText } from '../../components/common/ChemText';
import { BondStructures, FischerStructures, RingStructures } from '../../components/carbohydrates/Structures';

interface Props {
  selected: string;
  read: string[];
  onSelect: (id: string) => void;
  onRead: (id: string) => void;
  onPractice: (id: string) => void;
}

export function CarbTheory({ selected, read, onSelect, onRead, onPractice }: Props) {
  const [query, setQuery] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const lesson = CARB_LESSONS.find(l => l.id === selected) ?? CARB_LESSONS[0];
  const index = CARB_LESSONS.indexOf(lesson);
  const filtered = CARB_LESSONS.filter(l => `${l.title} ${l.sections.map(s => `${s.title} ${s.text}`).join(' ')}`.toLocaleLowerCase('ru').includes(query.toLocaleLowerCase('ru').trim()));
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [selected]);

  return <div className="grid lg:grid-cols-[18rem_minmax(0,1fr)] gap-6 items-start">
    <aside className="space-y-3 min-w-0" aria-label="Содержание углеводов">
      <label className="block text-sm font-semibold" htmlFor="carb-search">Поиск по всем урокам</label>
      <input id="carb-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Например, гликозидный…" className="carb-input w-full" />
      <nav aria-label="Уроки по углеводам" className="carb-panel p-2 space-y-1 max-h-64 lg:max-h-none overflow-y-auto">
        {filtered.map(l => <button key={l.id} aria-current={lesson.id === l.id ? 'page' : undefined} onClick={() => onSelect(l.id)} className={`w-full text-left p-3 rounded-lg text-sm ${lesson.id === l.id ? 'carb-selected' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
          <span className="block text-xs opacity-75 mb-1">{read.includes(l.id) ? '✓ Изучено · ' : ''}{l.pages}</span>{l.title}
        </button>)}
        {filtered.length === 0 && <p className="p-3 text-sm" role="status">Ничего не найдено. Попробуй другое слово.</p>}
      </nav>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">{CARB_SOURCE} Материал изложен своими словами; пояснения к упрощениям учебника отмечены в тексте.</p>
    </aside>
    <article className="min-w-0 space-y-5">
      <header className="carb-panel p-5 sm:p-6 space-y-3">
        <p className="text-sm text-emerald-700 dark:text-emerald-300">Урок {index + 1} из {CARB_LESSONS.length} · {lesson.pages}</p>
        <h2 ref={heading} tabIndex={-1} className="text-xl sm:text-2xl font-bold outline-none">{lesson.title}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{lesson.summary}</p>
        <button onClick={() => onRead(lesson.id)} aria-pressed={read.includes(lesson.id)} className="carb-button">{read.includes(lesson.id) ? '✓ Изучено — снять отметку' : 'Отметить изученным'}</button>
      </header>
      {lesson.sections.map(section => <section key={section.title} className="carb-panel p-5 sm:p-6 space-y-3">
        <h3 className="font-bold text-lg">{section.title}</h3>
        {section.diagram === 'fischer' && <FischerStructures />}
        {section.diagram === 'ring' && <RingStructures />}
        {section.diagram === 'bonds' && <BondStructures />}
        <ChemText text={section.text} className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed break-words" />
      </section>)}
      <section className="carb-panel p-5 space-y-3">
        <h3 className="font-bold text-lg">Ответь вслух, затем проверь</h3>
        {lesson.oral.map(item => <details key={item.question} className="border-t border-zinc-200 dark:border-zinc-700 pt-3">
          <summary className="cursor-pointer font-semibold text-sm leading-relaxed">{item.question}</summary>
          <ChemText text={item.answer} className="text-sm mt-3 text-zinc-700 dark:text-zinc-300" />
        </details>)}
      </section>
      <div className="flex flex-wrap gap-3">
        <button className="carb-button carb-selected" onClick={() => onPractice(lesson.id)}>Практика по этому уроку</button>
        {index > 0 && <button className="carb-button" onClick={() => onSelect(CARB_LESSONS[index - 1].id)}>← Предыдущий урок</button>}
        {index < CARB_LESSONS.length - 1 && <button className="carb-button" onClick={() => onSelect(CARB_LESSONS[index + 1].id)}>Следующий урок →</button>}
      </div>
    </article>
  </div>;
}
