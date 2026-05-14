import { useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  duration: number;    // ms — 0 means persistent (no auto-dismiss)
  onExpire: () => void;
  pauseOnHover: boolean;
}

interface TimerHandlers {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function useTimer({ duration, onExpire, pauseOnHover }: UseTimerOptions): TimerHandlers {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingRef = useRef<number>(duration);
  // Keep onExpire stable so we don't restart the timer on every render
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (duration === 0) return; // Persistent toast — no auto-dismiss
    clear();
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => onExpireRef.current(), remainingRef.current);
  }, [duration, clear]);

  const pause = useCallback(() => {
    if (duration === 0 || timerRef.current === null) return;
    clear();
    remainingRef.current -= Date.now() - startTimeRef.current;
  }, [duration, clear]);

  const resume = useCallback(() => {
    if (duration === 0) return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => onExpireRef.current(), remainingRef.current);
  }, [duration]);

  // Start timer on mount, clear on unmount
  useEffect(() => {
    start();
    return clear;
  }, [start, clear]);

  if (!pauseOnHover) return {};

  return {
    onMouseEnter: pause,
    onMouseLeave: resume,
    onFocus: pause,    // Keyboard accessibility — pause when focused
    onBlur: resume,
  };
}