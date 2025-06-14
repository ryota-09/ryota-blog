import { useState, useCallback } from 'react';
import { TIMING } from '../constants';

type UseTooltipReturn = {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  showTemporary: (duration?: number) => void;
};

export const useTooltip = (): UseTooltipReturn => {
  const [isVisible, setIsVisible] = useState(false);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const showTemporary = useCallback((duration?: number) => {
    const delay = duration ?? TIMING.tooltipDelay;
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), delay);
  }, []);

  return {
    isVisible,
    show,
    hide,
    showTemporary,
  };
};