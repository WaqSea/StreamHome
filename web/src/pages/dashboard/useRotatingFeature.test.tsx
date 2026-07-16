import React from "react";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MotionProvider } from "../../motion/motionSystem";
import type { Movie } from "../../types/api";
import { ROTATION_INTERVAL, useRotatingFeature } from "./useRotatingFeature";

const movie = (id: string): Movie => ({ id, title: id, description: "", thumbnailUrl: "", bannerUrl: null, videoUrl: "", genres: [], duration: "", releaseYear: 0, rating: null, cast: [], director: null, type: "movie", quality: "", languages: [], subtitles: [], voteAverage: 0, voteCount: 0, skipMarkers: {} });
const matchMedia = (matches: boolean) => ({ matches, media: "(prefers-reduced-motion: reduce)", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => true });
const wrapper = ({ children }: { children: React.ReactNode }) => <MotionProvider>{children}</MotionProvider>;

describe("billboard rotation motion state", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, "matchMedia", { configurable: true, value: () => matchMedia(false) });
  });
  afterEach(() => vi.useRealTimers());

  it("rotates automatically, reports direction, and pauses deterministically", () => {
    const { result } = renderHook(() => useRotatingFeature([movie("one"), movie("two"), movie("three")]), { wrapper });
    expect(result.current.featured?.id).toBe("one");
    act(() => vi.advanceTimersByTime(ROTATION_INTERVAL));
    expect(result.current.featured?.id).toBe("two");
    expect(result.current.source).toBe("automatic");
    expect(result.current.direction).toBe(1);
    act(() => result.current.setIndex(0));
    expect(result.current.featured?.id).toBe("one");
    expect(result.current.source).toBe("manual");
    expect(result.current.direction).toBe(-1);
    act(() => result.current.setPaused(true));
    act(() => vi.advanceTimersByTime(ROTATION_INTERVAL * 2));
    expect(result.current.featured?.id).toBe("one");
  });

  it("resets the full countdown after a manual selection", () => {
    const { result } = renderHook(() => useRotatingFeature([movie("one"), movie("two"), movie("three")]), { wrapper });
    act(() => vi.advanceTimersByTime(ROTATION_INTERVAL / 2));
    act(() => result.current.setIndex(2));
    act(() => vi.advanceTimersByTime(ROTATION_INTERVAL - 1));
    expect(result.current.featured?.id).toBe("three");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.featured?.id).toBe("one");
  });

  it("keeps functional rotation enabled when reduced motion is preferred", () => {
    Object.defineProperty(window, "matchMedia", { configurable: true, value: () => matchMedia(true) });
    const { result } = renderHook(() => useRotatingFeature([movie("one"), movie("two")]), { wrapper });
    act(() => vi.advanceTimersByTime(ROTATION_INTERVAL));
    expect(result.current.featured?.id).toBe("two");
    expect(result.current.source).toBe("automatic");
  });
});
