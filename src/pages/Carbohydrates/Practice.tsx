import { useEffect, useRef, useState } from 'react';
import { CARB_LESSONS } from '../../data/carbohydrates/lessons';
import { CARB_QUESTIONS } from '../../data/carbohydrates/questions';
import type { CarbQuestion } from '../../data/carbohydrates/questions';
import type { CarbProgress } from '../../utils/carbProgress';
import { createCarbExam, shuffled } from '../../utils/carbProgress';
import { ChemText } from '../../components/common/ChemText';

type Mode = 'practice' | 'exam' | 'mistakes';
interface Props {
  mode: Mode;
  initialTopic: string;
  progress: CarbProgress;
  onAnswer: (id: string, correct: boolean) => void;
  onExam: (correct: number, total: number) => void;
  onTheory: (topic: string) => void;
}
type Result = { question: CarbQuestion; selected: string };

export function CarbPractice({ mode, initialTopic, progress, onAnswer, onExam, onTheory }: Props) {
  const [topic, setTopic] = useState(initialTopic);
  const [count, setCount] = useState(10);
  const [session, setSession] = useState<CarbQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const exam = mode === 'exam';
  const pool = CARB_QUESTIONS.filter(q => (topic === 'all' || q.topic === topic) && (mode !== 'mistakes' || progress.answers[q.id]?.lastCorrect === false));
  const current = session[index];
  useEffect(() => { if (session.length) heading.current?.focus({ preventScroll: true }); }, [index, finished, session]);

  function start() {
    const questions = exam ? createCarbExam(CARB_QUESTIONS, CARB_LESSONS.map(l => l.id)) : shuffled(pool).slice(0, count);
    setSession(questions.map(q => ({ ...q, options: shuffled(q.options) })));
    setIndex(0); setSelected(null); setResults([]); setFinished(false);
  }
  function choose(answer: string) {
    if (selected !== null && !exam) return;
    setSelected(answer);
    if (!exam) onAnswer(current.id, answer === current.answer);
  }
  function next() {
    if (selected === null) return;
    if (exam) onAnswer(current.id, selected === current.answer);
    const updated = [...results, { question: current, selected }];
    setResults(updated);
    if (index + 1 === session.length) {
      setFinished(true);
      if (exam) onExam(updated.filter(r => r.selected === r.question.answer).length, updated.length);
    } else { setIndex(i => i + 1); setSelected(null); }
  }

  if (!session.length) return <section className="carb-panel p-5 sm:p-8 max-w-3xl mx-auto space-y-5">
    <h2 className="text-xl font-bold">{exam ? 'Пробный зачёт по всему разделу' : mode === 'mistakes' ? 'Работа над ошибками' : 'Практика с объяснениями'}</h2>
    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{exam
      ? '30 вопросов без подсказок, минимум один по каждому из 10 уроков. До перехода к следующему вопросу ответ можно менять. Результат и разбор — после последнего ответа. Время не ограничено; это тренировка, а не гарантия оценки учителя.'
      : mode === 'mistakes' ? 'Здесь вопросы, на которые последний ответ был неверным. После правильного ответа вопрос исчезнет из банка ошибок; текущую сессию можно закончить целиком.' : 'Выбери тему и длину сессии. После каждого ответа появится объяснение и ссылка на соответствующий урок. Варианты ответов перемешиваются.'}</p>
    {!exam && <div className="grid sm:grid-cols-2 gap-4">
      <label className="text-sm space-y-2">Тема
        <select value={topic} onChange={e => setTopic(e.target.value)} className="carb-input block w-full mt-2">
          <option value="all">Все темы</option>{CARB_LESSONS.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
        </select>
      </label>
      <label className="text-sm space-y-2">Длина сессии
        <select value={count} onChange={e => setCount(Number(e.target.value))} className="carb-input block w-full mt-2">
          {[10, 20, 30, 100].map(n => <option key={n} value={n}>{n === 100 ? 'Все доступные' : `${n} вопросов`}</option>)}
        </select>
      </label>
    </div>}
    {!exam && <p className="text-sm" role="status">Доступно: {pool.length} вопросов. В сессии: {Math.min(count, pool.length)}.</p>}
    {(exam || pool.length > 0) ? <button className="carb-button carb-selected" onClick={start}>{exam ? 'Начать зачёт' : 'Начать тренировку'}</button>
      : <div role="status" className="text-sm space-y-3"><p>По выбранным условиям вопросов нет. Если ошибок пока нет, начни с практики или зачёта.</p><button className="carb-button" onClick={() => onTheory(topic === 'all' ? CARB_LESSONS[0].id : topic)}>Открыть теорию</button></div>}
  </section>;

  if (finished) {
    const correct = results.filter(r => r.selected === r.question.answer).length;
    return <section className="space-y-5 max-w-3xl mx-auto">
      <div className="carb-panel p-6 space-y-3">
        <h2 ref={heading} tabIndex={-1} className="text-xl font-bold outline-none">{exam ? 'Результат пробного зачёта' : 'Тренировка завершена'}</h2>
        <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{correct} / {results.length} · {Math.round(correct / results.length * 100)} %</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Разбери объяснения. Прочитанные уроки и правильные ответы учитываются отдельно; один удачный результат не заменяет понимания темы.</p>
        <button className="carb-button" onClick={() => { setSession([]); setFinished(false); }}>Новая сессия</button>
      </div>
      {results.map(({ question, selected: answer }, i) => <div key={question.id} className="carb-panel p-5 space-y-3">
        <h3 className="font-semibold"><ChemText inline text={`${i + 1}. ${question.prompt}`} /></h3>
        <p className="text-sm">{answer === question.answer ? '✓ Верно' : '✗ Ошибка'} · Твой ответ: <ChemText inline text={answer} /></p>
        {answer !== question.answer && <p className="text-sm font-semibold">Верный ответ: <ChemText inline text={question.answer} /></p>}
        <ChemText text={question.explanation} className="text-sm text-zinc-600 dark:text-zinc-300" />
        <button className="carb-button" onClick={() => onTheory(question.topic)}>Разобрать тему в учебнике</button>
      </div>)}
    </section>;
  }

  return <section className="carb-panel p-5 sm:p-8 max-w-3xl mx-auto space-y-5">
    <p className="text-sm text-zinc-600 dark:text-zinc-400">{exam ? 'Пробный зачёт' : 'Тренировка'} · Вопрос {index + 1} из {session.length}</p>
    <progress value={index} max={session.length} aria-label="Пройдено вопросов" className="w-full h-2 accent-emerald-600" />
    <h2 ref={heading} tabIndex={-1} className="text-lg sm:text-xl font-bold leading-relaxed outline-none"><ChemText inline text={current.prompt} /></h2>
    <div className="space-y-3" role="group" aria-label="Варианты ответа">
      {current.options.map(option => <button key={option} onClick={() => choose(option)} disabled={!exam && selected !== null} aria-pressed={selected === option}
        className={`carb-answer ${selected === option ? 'carb-selected' : ''}`}><ChemText inline text={option} /></button>)}
    </div>
    {!exam && selected !== null && <div role="status" className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl space-y-2">
      <p className="font-bold">{selected === current.answer ? '✓ Верно' : '✗ Неверно'}</p>
      {selected !== current.answer && <p className="text-sm">Верный ответ: <ChemText inline text={current.answer} /></p>}
      <ChemText text={current.explanation} className="text-sm" />
    </div>}
    {exam && <p className="text-xs text-zinc-500">Правильность ответа будет показана после завершения зачёта.</p>}
    <button className="carb-button carb-selected" disabled={selected === null} onClick={next}>{index + 1 === session.length ? 'Завершить и посмотреть результат' : 'Следующий вопрос →'}</button>
  </section>;
}
