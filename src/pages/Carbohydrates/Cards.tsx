import { useState } from 'react';
import { CARB_LESSONS } from '../../data/carbohydrates/lessons';
import { CARB_QUESTIONS } from '../../data/carbohydrates/questions';
import { ChemText } from '../../components/common/ChemText';

export function CarbCards() {
  const [topic, setTopic] = useState('all');
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);
  const cards = CARB_QUESTIONS.filter(q => topic === 'all' || q.topic === topic);
  const current = cards[index];
  function move(step: number) { setIndex(i => (i + step + cards.length) % cards.length); setShown(false); }
  return <section className="carb-panel p-5 sm:p-8 max-w-3xl mx-auto space-y-5">
    <h2 className="text-xl font-bold">Карточки для активного повторения</h2>
    <label className="text-sm block">Тема карточек
      <select value={topic} onChange={e => { setTopic(e.target.value); setIndex(0); setShown(false); }} className="carb-input block w-full mt-2">
        <option value="all">Весь раздел</option>{CARB_LESSONS.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
      </select>
    </label>
    <p className="text-sm text-zinc-500">Карточка {index + 1} из {cards.length}. Сначала сформулируй ответ вслух.</p>
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 space-y-4">
      <p className="text-lg font-semibold"><ChemText inline text={current.prompt} /></p>
      <button className="carb-button" aria-expanded={shown} aria-controls="carb-card-answer" onClick={() => setShown(s => !s)}>{shown ? 'Скрыть ответ' : 'Показать ответ'}</button>
      {shown && <div id="carb-card-answer" className="space-y-3" role="status">
        <p className="font-semibold"><ChemText inline text={current.answer} /></p>
        <ChemText text={current.explanation} className="text-sm text-zinc-600 dark:text-zinc-300" />
      </div>}
    </div>
    <div className="flex flex-wrap gap-3"><button className="carb-button" onClick={() => move(-1)}>← Назад</button><button className="carb-button carb-selected" onClick={() => move(1)}>Дальше →</button></div>
    <p className="text-xs text-zinc-500">Карточки предназначены для самопроверки. Просмотр ответа не засчитывается как правильный ответ в статистике.</p>
  </section>;
}
