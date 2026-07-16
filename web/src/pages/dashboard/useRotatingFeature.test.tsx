import React from "react";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MotionProvider } from "../../motion/motionSystem";
import type { Movie } from "../../types/api";
import { ROTATION_INTERVAL, useRotatingFeature } from "./useRotatingFeature";

const movie = (id: string): Movie => ({ id, title: id, description: "", thumbnailUrl: "", bannerUrl: null, videoUrl: "", genres: [], duration: "", releaseYear: 0, rating: null, cast: [], director: null, type: "movie", quality: "", languages: [], subtitles: [], voteAverage: 0, voteCount: 0, skipMarkers: {} });

describe("billboard rotation motion state", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: false, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => true }) });
  });
  afterEach(() => vi.useRealTimers());

  it("rotates automatically, reports direction, and pauses deterministically", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <MotionProvider>{children}</MotionProvider>;
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
});
