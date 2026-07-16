import { useEffect, useMemo, useState } from "react";
import { useAppMotion } from "../../motion/motionSystem";
import type { Movie } from "../../types/api";

const ROTATION_INTERVAL = 10_000;

export function useRotatingFeature(items: Movie[]) {
  const { documentHidden } = useAppMotion();
  const [index, setIndexState] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<-1 | 1>(1);
  const [source, setSource] = useState<"automatic" | "manual">("automatic");
  const signature = useMemo(() => items.map((item) => item.id).join("|"), [items]);

  useEffect(() => { setIndexState(0); setDirection(1); setSource("automatic"); }, [signature]);

  const setIndex = (next: number) => {
    setIndexState((current) => {
      if (next === current) return current;
      setDirection(next > current ? 1 : -1);
      setSource("manual");
      return next;
    });
  };

  useEffect(() => {
    if (paused || documentHidden || items.length < 2) return;
    const timeout = window.setTimeout(() => {
      setDirection(1);
      setSource("automatic");
      setIndexState((current) => (current + 1) % items.length);
    }, ROTATION_INTERVAL);
    return () => window.clearTimeout(timeout);
  }, [documentHidden, index, items.length, paused, signature]);

  return {
    featured: items[index % Math.max(items.length, 1)] ?? null,
    index,
    setIndex,
    setPaused,
    paused,
    direction,
    source,
  };
}

export { ROTATION_INTERVAL };
