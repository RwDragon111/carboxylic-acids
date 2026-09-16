import React from 'react';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, className = '' }) => {
  if (streak < 2) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 animate-pulse ${className}`}
    >
      <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
      <span>🔥 {streak} подряд</span>
    </div>
  );
};
