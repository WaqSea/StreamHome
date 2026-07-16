import { useEffect, useMemo, useState } from "react";
import { useAppMotion } from "../../motion/motionSystem";
import type { Movie } from "../../types/api";

const ROTATION_INTERVAL = 12_000;

export function useRotatingFeature(items: Movie[]) {
  const { reduced, documentHidden } = useAppMotion();
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
    if (paused || documentHidden || reduced || items.length < 2) return;
    const rotate = () => {
      if (!document.hidden) {
        setDirection(1);
        setSource("automatic");
        setIndexState((current) => (current + 1) % items.length);
      }
    };
    const interval = window.setInterval(rotate, ROTATION_INTERVAL);
    return () => window.clearInterval(interval);
  }, [documentHidden, items.length, paused, reduced]);

  return {
    featured: items[index % Math.max(items.length, 1)] ?? null,
    index,
    setIndex,
    setPaused,
    direction,
    source,
  };
}

export { ROTATION_INTERVAL };
