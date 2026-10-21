import { useEffect, useState } from 'react';
import { CARB_LESSONS, CARB_SOURCE } from '../../data/carbohydrates/lessons';
import { CARB_QUESTIONS } from '../../data/carbohydrates/questions';
import { CARB_STORAGE_KEY, loadCarbProgress, recordCarbAnswer } from '../../utils/carbProgress';
import { CarbTheory } from './Theory';
import { CarbPractice } from './Practice';
import { CarbCards } from './Cards';

type Tab = 'overview' | 'theory' | 'practice' | 'cards' | 'exam' | 'mistakes';
export function Carbohydrates() {
  const [tab, setTab] = useState<Tab>('overview');
  const [topic, setTopic] = useState('classification');
  const [practiceTopic, setPracticeTopic] = useState('all');
  const [progress, setProgress] = useState(loadCarbProgress);
  const [storageError, setStorageError] = useState(false);
  const mistakes = CARB_QUESTIONS.filter(q => progress.answers[q.id]?.lastCorrect === false).length;
  const lastCorrect = CARB_QUESTIONS.filter(q => progress.answers[q.id]?.lastCorrect).length;
  const read = CARB_LESSONS.filter(l => progress.read.includes(l.id)).length;
  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'План подготовки' }, { id: 'theory', label: 'Полная теория' },
    { id: 'practice', label: 'Практика' }, { id: 'cards', label: 'Карточки' },
    { id: 'exam', label: 'Пробный зачёт' }, { id: 'mistakes', label: `Ошибки (${mistakes})` },
  ];
  useEffect(() => {
    // This effect synchronizes external browser storage and reports save failures.
    // oxlint-disable-next-line react/set-state-in-effect
    try { localStorage.setItem(CARB_STORAGE_KEY, JSON.stringify(progress)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [progress]);
  function theory(id: string) { setTopic(id); setTab('theory'); }
  function practice(id: string) { setPracticeTopic(id); setTab('practice'); }

  return <div className="carbohydrates max-w-6xl mx-auto px-4 py-6 space-y-6">
    <header className="space-y-2">
      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Профильная химия · 10 класс · §§ 50–53</p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Углеводы</h1>
      <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 max-w-3xl leading-relaxed">Полный разбор чек-листа учителя по Карцовой и Лёвкину: от строения сахаров до качественных реакций, гидролиза и брожения.</p>
    </header>
    <nav aria-label="Режимы подготовки по углеводам" className="flex flex-wrap gap-2">
      {tabs.map(t => <button key={t.id} aria-current={tab === t.id ? 'page' : undefined} className={`carb-button ${tab === t.id ? 'carb-selected' : ''}`} onClick={() => { if (t.id === 'practice') setPracticeTopic('all'); setTab(t.id); }}>{t.label}</button>)}
    </nav>
    {storageError && <p role="alert" className="carb-panel p-4 text-sm">Браузер не разрешает сохранить прогресс. Можно продолжать, но после закрытия страницы новые результаты могут потеряться.</p>}
    {tab === 'overview' && <div className="space-y-5">
      <section className="carb-panel p-5 sm:p-6 space-y-4">
        <h2 className="text-xl font-bold">Твой план до зачёта</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">Прочитай урок, ответь на вопросы вслух, реши практику и вернись к ошибкам. Затем пройди смешанный зачёт. Отметки «Изучено» — твоя самооценка, а результаты заданий считаются отдельно.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[['Изучено уроков', `${read} / ${CARB_LESSONS.length}`], ['Последний ответ верный', `${lastCorrect} / ${CARB_QUESTIONS.length}`], ['Нужно разобрать', String(mistakes)], ['Зачётов в истории', String(progress.exams.length)]].map(([label, value]) => <div key={label} className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-3"><p className="text-xs text-zinc-600 dark:text-zinc-400">{label}</p><p className="text-xl font-bold mt-1">{value}</p></div>)}
        </div>
        <progress value={read} max={CARB_LESSONS.length} aria-label="Изучено уроков" className="w-full h-2 accent-emerald-600" />
        <div className="flex flex-wrap gap-3"><button className="carb-button carb-selected" onClick={() => theory(CARB_LESSONS.find(l => !progress.read.includes(l.id))?.id ?? CARB_LESSONS[0].id)}>Продолжить теорию</button><button className="carb-button" onClick={() => setTab('exam')}>Проверить себя на зачёте</button></div>
      </section>
      <section className="carb-panel p-5 sm:p-6 space-y-2">
        <h2 className="text-xl font-bold mb-4">Все пункты чек-листа</h2>
        {CARB_LESSONS.map((lesson, i) => {
          const questions = CARB_QUESTIONS.filter(q => q.topic === lesson.id);
          const correct = questions.filter(q => progress.answers[q.id]?.lastCorrect).length;
          return <div key={lesson.id} className="py-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="min-w-0"><button className="text-left font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 underline-offset-4 hover:underline" onClick={() => theory(lesson.id)}>{i + 1}. {lesson.title}</button>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{progress.read.includes(lesson.id) ? '✓ Теория отмечена изученной' : 'Теория ещё не отмечена'} · {correct}/{questions.length} последних ответов верны · {lesson.pages}</p></div>
            <button className="carb-button shrink-0 self-start sm:self-auto" onClick={() => practice(lesson.id)}>Тренировать</button>
          </div>;
        })}
      </section>
      <section className="carb-panel p-5 space-y-3">
        <h2 className="text-lg font-bold">Источник и границы подготовки</h2>
        <p className="text-sm leading-relaxed">{CARB_SOURCE} {CARB_LESSONS.length} подробных уроков, {CARB_QUESTIONS.length} заданий с объяснениями и {CARB_LESSONS.reduce((n, l) => n + l.oral.length, 0)} вопросов для устного ответа. Дополнения и исправления упрощений учебника обозначены в уроках. Теория доступна полностью, без необходимости отвечать на задания или открывать сокращённые версии.</p>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">Прогресс хранится только в этом браузере. Карточки и просмотр теории не подменяют результаты практики. Пробный зачёт покрывает весь чек-лист, но реальные вопросы и оценку определяет учитель.</p>
      </section>
      {progress.exams.length > 0 && <section className="carb-panel p-5 space-y-3"><h2 className="text-lg font-bold">Последние зачёты</h2>{progress.exams.slice(0, 5).map((e, i) => <p key={`${e.date}-${i}`} className="text-sm">{new Date(e.date).toLocaleString('ru-RU')} · {e.correct}/{e.total} · {Math.round(e.correct / e.total * 100)} %</p>)}</section>}
    </div>}
    {tab === 'theory' && <CarbTheory selected={topic} read={progress.read} onSelect={setTopic} onRead={id => setProgress(p => ({ ...p, read: p.read.includes(id) ? p.read.filter(x => x !== id) : [...p.read, id] }))} onPractice={practice} />}
    {(tab === 'practice' || tab === 'exam' || tab === 'mistakes') && <CarbPractice key={`${tab}-${practiceTopic}`} mode={tab} initialTopic={tab === 'practice' ? practiceTopic : 'all'} progress={progress} onAnswer={(id, correct) => setProgress(p => recordCarbAnswer(p, id, correct))} onExam={(correct, total) => setProgress(p => ({ ...p, exams: [{ date: new Date().toISOString(), correct, total }, ...p.exams].slice(0, 20) }))} onTheory={theory} />}
    {tab === 'cards' && <CarbCards />}
  </div>;
}

export default Carbohydrates;
