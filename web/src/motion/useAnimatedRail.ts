import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { MOTION_TIMINGS, useAppMotion } from "./motionSystem";

export const cinematicRailEase = (progress: number): number => 1 - Math.pow(1 - Math.min(1, Math.max(0, progress)), 3);

type RailTargetMetrics = Pick<HTMLElement, "scrollLeft" | "clientWidth" | "scrollWidth"> & {
  itemOffsets?: readonly number[];
  leadingInset?: number;
  trailingInset?: number;
};

export function railTarget(element: RailTargetMetrics, direction: -1 | 1): number {
  const maximum = Math.max(0, element.scrollWidth - element.clientWidth);
  const leadingInset = Math.max(0, element.leadingInset ?? 0);
  const trailingInset = Math.max(0, element.trailingInset ?? leadingInset);
  const usableWidth = Math.max(1, element.clientWidth - leadingInset - trailingInset);
  const current = Math.max(0, Math.min(maximum, element.scrollLeft));
  const positions = (element.itemOffsets ?? [])
    .map((offset) => Math.max(0, Math.min(maximum, offset - leadingInset)))
    .filter((offset, index, values) => index === 0 || Math.abs(offset - values[index - 1]) > 1);

  if (!positions.length) {
    return Math.max(0, Math.min(maximum, current + direction * usableWidth));
  }

  if (direction === 1) {
    const pageBoundary = current + usableWidth - 1;
    return positions.find((offset) => offset > pageBoundary) ?? maximum;
  }

  const pageBoundary = current - usableWidth + 1;
  const previousPages = positions.filter((offset) => offset < current - 1 && offset <= pageBoundary);
  const pageStart = previousPages[previousPages.length - 1];
  return pageStart ?? 0;
}

export function useAnimatedRail() {
  const rail = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const target = useRef<number | null>(null);
  const { reduced } = useAppMotion();
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  const [edges, setEdges] = useState({ previous: false, next: true });
  const [proximity, setProximity] = useState<"previous" | "next" | "none">("none");

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
    const style = getComputedStyle(element);
    const leadingInset = Number.parseFloat(style.paddingLeft) || 0;
    const trailingInset = Number.parseFloat(style.paddingRight) || 0;
    const to = railTarget({
      scrollLeft: basis,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      itemOffsets: Array.from(element.children, (child) => (child as HTMLElement).offsetLeft),
      leadingInset,
      trailingInset,
    }, nextDirection);
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

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const edgeZone = Math.min(112, bounds.width * .14);
    const distanceFromStart = event.clientX - bounds.left;
    const distanceFromEnd = bounds.right - event.clientX;
    const next = distanceFromStart <= edgeZone ? "previous" : distanceFromEnd <= edgeZone ? "next" : "none";
    setProximity((current) => current === next ? current : next);
  }, []);

  const onPointerLeave = useCallback(() => setProximity("none"), []);

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

  return {
    rail,
    scroll,
    direction,
    proximity,
    canScrollPrevious: edges.previous,
    canScrollNext: edges.next,
    stop,
    proximityHandlers: { onPointerMove, onPointerLeave },
  };
}
