import React, { useState } from 'react';
import { K2StorageState } from '../../types/k2';
import { exportK2ProgressAsJson, importK2ProgressFromJson, resetK2Progress } from '../../utils/k2Storage';
import { K2_TOPICS } from '../../data/k2/topics';
import { K2_QUESTIONS } from '../../data/k2/questions';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Database,
  FileText,
} from 'lucide-react';

interface ContentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: K2StorageState;
  onStateUpdate: (newState: K2StorageState) => void;
}

export const ContentManagerModal: React.FC<ContentManagerModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onStateUpdate,
}) => {
  const [importJsonText, setImportJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    const jsonStr = exportK2ProgressAsJson(currentState);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `k2_chemistry_progress_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage({ text: 'Прогресс успешно экспортирован в файл!' });
  };

  const handleImport = () => {
    if (!importJsonText.trim()) {
      setStatusMessage({ text: 'Пожалуйста, вставьте JSON данные', isError: true });
      return;
    }
    const imported = importK2ProgressFromJson(importJsonText);
    if (imported) {
      onStateUpdate(imported);
      setStatusMessage({ text: 'Данные успешно загружены и применены!' });
      setImportJsonText('');
    } else {
      setStatusMessage({ text: 'Ошибка: неверный формат JSON', isError: true });
    }
  };

  const handleReset = () => {
    const fresh = resetK2Progress();
    onStateUpdate(fresh);
    setShowConfirmReset(false);
    setStatusMessage({ text: 'Все результаты и прогресс К2 сброшены на начальные.' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Управление данными и резервные копии
              </h2>
              <p className="text-xs text-zinc-500">
                Экспорт / импорт прогресса К2, статистика банка заданий
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-zinc-700 dark:text-zinc-300">
          {/* Status Alert */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
                statusMessage.isError
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {statusMessage.isError ? (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Stats overview */}
          <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 space-y-2">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm block">
              Статистика учебного банка заданий К2
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
              <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Всего тем</span>
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">{K2_TOPICS.length}</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Банк вопросов</span>
                <span className="text-base font-bold text-emerald-600">{K2_QUESTIONS.length}</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Попыток зачёта</span>
                <span className="text-base font-bold text-indigo-600">{currentState.examAttempts.length}</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">В банке ошибок</span>
                <span className="text-base font-bold text-rose-500">
                  {Object.values(currentState.mistakes).filter(m => !m.resolved).length}
                </span>
              </div>
            </div>
          </div>

          {/* Export section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm block">
                  Экспорт результатов в JSON
                </span>
                <p className="text-zinc-500 text-[11px] mt-0.5">
                  Сохраните файл с пройденными темами, ответами и историей зачётов
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Скачать JSON</span>
              </button>
            </div>
          </div>

          {/* Import section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm block">
              Импорт прогресса из JSON
            </span>
            <p className="text-zinc-500 text-[11px]">
              Вставьте скопированный текст резервной копии или перенесите данные с другого устройства:
            </p>
            <textarea
              rows={3}
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              placeholder='{"version": 1, "topicProgress": ...}'
              className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleImport}
                disabled={!importJsonText.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 dark:bg-zinc-200 hover:bg-zinc-700 text-white dark:text-zinc-900 disabled:opacity-50 font-semibold rounded-xl text-xs transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Восстановить прогресс</span>
              </button>
            </div>
          </div>

          {/* Reset section */}
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-700 dark:text-rose-400 text-sm block">
                  Сбросить прогресс модуля К2
                </span>
                <p className="text-zinc-500 text-[11px] mt-0.5">
                  Очищает только данные модуля подготовки к зачёту К2 (основной тренажёр кислот не затрагивается)
                </p>
              </div>

              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-semibold text-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Сбросить</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-xl font-semibold text-xs hover:bg-rose-700"
                  >
                    Да, точно стереть
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl font-semibold text-xs"
                  >
                    Отмена
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl text-xs transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
