import { useCallback, useEffect, useRef, useState } from "react";
import { MOTION_TIMINGS, useAppMotion } from "./motionSystem";

export const cinematicRailEase = (progress: number): number => 1 - Math.pow(1 - Math.min(1, Math.max(0, progress)), 3);

export function railTarget(element: Pick<HTMLElement, "scrollLeft" | "clientWidth" | "scrollWidth">, direction: -1 | 1): number {
  const distance = Math.min(element.clientWidth * .82, 920);
  return Math.max(0, Math.min(element.scrollWidth - element.clientWidth, element.scrollLeft + direction * distance));
}

export function useAnimatedRail() {
  const rail = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const target = useRef<number | null>(null);
  const { reduced } = useAppMotion();
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  const [edges, setEdges] = useState({ previous: false, next: true });

  const updateEdges = useCallback(() => {
    const element = rail.current;
    if (!element) return;
    setEdges({ previous: element.scrollLeft > 1, next: element.scrollLeft < element.scrollWidth - element.clientWidth - 1 });
  }, []);

  const stop = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    target.current = null;
    setDirection(0);
    updateEdges();
  }, [updateEdges]);

  const scroll = useCallback((nextDirection: -1 | 1) => {
    const element = rail.current;
    if (!element) return;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    const from = element.scrollLeft;
    const basis = target.current ?? from;
    element.scrollLeft = basis;
    const to = railTarget(element, nextDirection);
    element.scrollLeft = from;
    target.current = to;
    setDirection(nextDirection);
    if (reduced || Math.abs(to - from) < 1) {
      element.scrollLeft = to;
      stop();
      return;
    }
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / MOTION_TIMINGS.rail);
      element.scrollLeft = from + (to - from) * cinematicRailEase(progress);
      updateEdges();
      if (progress < 1) frame.current = requestAnimationFrame(tick);
      else stop();
    };
    frame.current = requestAnimationFrame(tick);
  }, [reduced, stop, updateEdges]);

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    element.addEventListener("scroll", updateEdges, { passive: true });
    element.addEventListener("wheel", stop, { passive: true });
    element.addEventListener("pointerdown", stop, { passive: true });
    element.addEventListener("touchstart", stop, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateEdges);
    observer?.observe(element);
    updateEdges();
    return () => {
      element.removeEventListener("scroll", updateEdges);
      element.removeEventListener("wheel", stop);
      element.removeEventListener("pointerdown", stop);
      element.removeEventListener("touchstart", stop);
      observer?.disconnect();
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [stop, updateEdges]);

  return { rail, scroll, direction, canScrollPrevious: edges.previous, canScrollNext: edges.next, stop };
}
