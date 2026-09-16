import { useEffect } from 'react';

interface HotkeyHandlers {
  onOption1?: () => void;
  onOption2?: () => void;
  onOption3?: () => void;
  onOption4?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

export function useHotkeys({
  onOption1,
  onOption2,
  onOption3,
  onOption4,
  onEnter,
  onSpace,
  onEscape,
  enabled = true,
}: HotkeyHandlers) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key) {
        case '1':
          if (onOption1) {
            e.preventDefault();
            onOption1();
          }
          break;
        case '2':
          if (onOption2) {
            e.preventDefault();
            onOption2();
          }
          break;
        case '3':
          if (onOption3) {
            e.preventDefault();
            onOption3();
          }
          break;
        case '4':
          if (onOption4) {
            e.preventDefault();
            onOption4();
          }
          break;
        case 'Enter':
          if (onEnter) {
            e.preventDefault();
            onEnter();
          }
          break;
        case ' ':
          if (onSpace) {
            e.preventDefault();
            onSpace();
          }
          break;
        case 'Escape':
          if (onEscape) {
            e.preventDefault();
            onEscape();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onOption1, onOption2, onOption3, onOption4, onEnter, onSpace, onEscape]);
}
