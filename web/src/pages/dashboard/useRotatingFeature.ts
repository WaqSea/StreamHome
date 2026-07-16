import { useEffect, useMemo, useRef, useState } from "react";
import { useAppMotion } from "../../motion/motionSystem";
import type { Movie } from "../../types/api";

const ROTATION_INTERVAL = 10_000;

export function useRotatingFeature(items: Movie[]) {
  const { documentHidden } = useAppMotion();
  const [index, setIndexState] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<-1 | 1>(1);
  const [source, setSource] = useState<"automatic" | "manual">("automatic");
  const remainingMs = useRef(ROTATION_INTERVAL);
  const startedAt = useRef<number | null>(null);
  const signature = useMemo(() => items.map((item) => item.id).join("|"), [items]);
  const effectivelyPaused = paused || documentHidden;

  useEffect(() => {
    remainingMs.current = ROTATION_INTERVAL;
    startedAt.current = null;
    setIndexState(0);
    setDirection(1);
    setSource("automatic");
  }, [signature]);

  const setIndex = (next: number) => {
    setIndexState((current) => {
      if (next === current) return current;
      remainingMs.current = ROTATION_INTERVAL;
      startedAt.current = null;
      setDirection(next > current ? 1 : -1);
      setSource("manual");
      return next;
    });
  };

  useEffect(() => {
    if (effectivelyPaused || items.length < 2) return;
    startedAt.current = Date.now();
    const timeout = window.setTimeout(() => {
      remainingMs.current = ROTATION_INTERVAL;
      startedAt.current = null;
      setDirection(1);
      setSource("automatic");
      setIndexState((current) => (current + 1) % items.length);
    }, remainingMs.current);
    return () => {
      window.clearTimeout(timeout);
      if (startedAt.current !== null) {
        remainingMs.current = Math.max(1, remainingMs.current - (Date.now() - startedAt.current));
        startedAt.current = null;
      }
    };
  }, [effectivelyPaused, index, items.length, signature]);

  return {
    featured: items[index % Math.max(items.length, 1)] ?? null,
    index,
    setIndex,
    setPaused,
    paused: effectivelyPaused,
    direction,
    source,
  };
}

export { ROTATION_INTERVAL };
