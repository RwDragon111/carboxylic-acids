import React from 'react';
import {
  Home,
  BookOpen,
  HelpCircle,
  Layers,
  Sparkles,
  Zap,
  GitCompare,
  AlertTriangle,
  GraduationCap,
  Eye,
} from 'lucide-react';

export type PageTab =
  | 'home'
  | 'learn'
  | 'quiz'
  | 'flashcards'
  | 'shmyaga'
  | 'anions'
  | 'matching'
  | 'mistakes'
  | 'exam'
  | 'gallery';

interface NavigationProps {
  activeTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  mistakesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  mistakesCount,
}) => {
  const tabs: { id: PageTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Главная', icon: <Home className="w-4 h-4" /> },
    { id: 'learn', label: 'Обучение', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'quiz', label: 'Квиз', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'flashcards', label: 'Карточки', icon: <Layers className="w-4 h-4" /> },
    { id: 'shmyaga', label: 'Шмяга', icon: <Sparkles className="w-4 h-4 text-emerald-500" /> },
    { id: 'anions', label: 'Анионы', icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { id: 'matching', label: 'Сопоставление', icon: <GitCompare className="w-4 h-4" /> },
    {
      id: 'mistakes',
      label: 'Ошибки',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: mistakesCount > 0 ? mistakesCount : undefined,
    },
    { id: 'exam', label: 'Экзамен', icon: <GraduationCap className="w-4 h-4 text-indigo-500" /> },
    { id: 'gallery', label: 'Галерея', icon: <Eye className="w-4 h-4" /> },
  ];

  return (
    <nav className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800/80 sticky top-16 z-30 overflow-x-auto scrollbar-none py-1 px-4">
      <div className="max-w-6xl mx-auto flex items-center gap-1.5 min-w-max">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive
                      ? 'bg-white text-emerald-600'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
