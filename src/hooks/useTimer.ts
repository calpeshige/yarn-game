import { useState, useRef, useCallback, useEffect } from 'react';

interface UseTimerReturn {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newSeconds?: number) => void;
  formattedTime: string;
}

export function useTimer(initialSeconds: number = 180): UseTimerReturn {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (seconds <= 0) return;
    setIsRunning(true);
  }, [seconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(
    (newSeconds?: number) => {
      clearTimer();
      setIsRunning(false);
      setSeconds(newSeconds ?? initialSeconds);
    },
    [clearTimer, initialSeconds]
  );

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [isRunning, clearTimer]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${minutes}:${secs.toString().padStart(2, '0')}`;

  return { seconds, isRunning, start, pause, reset, formattedTime };
}
