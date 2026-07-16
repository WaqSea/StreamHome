import { useCallback, useEffect, useRef, useState } from "react";

export function useHoverIntent<T>(initialValue: T, delay: number) {
  const [value, setValue] = useState(initialValue);
  const timer = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const schedule = useCallback((nextValue: T) => {
    clearTimer();
    timer.current = window.setTimeout(() => {
      setValue(nextValue);
      timer.current = null;
    }, delay);
  }, [clearTimer, delay]);

  const cancel = useCallback((fallback?: T) => {
    clearTimer();
    if (fallback !== undefined) setValue(fallback);
  }, [clearTimer]);

  const setImmediate = useCallback((nextValue: T) => {
    clearTimer();
    setValue(nextValue);
  }, [clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);
  return { value, schedule, cancel, setImmediate };
}
