import React from "react";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MOTION_TIMINGS, MotionProvider, THEME_MOTION, useAppMotion } from "./motionSystem";

function matchMedia(matches: boolean) {
  return {
    matches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => true,
  } as MediaQueryList;
}

describe("cinematic motion system", () => {
  beforeEach(() => Object.defineProperty(window, "matchMedia", { configurable: true, value: () => matchMedia(false) }));

  it("keeps the extended cinematic timing scale", () => {
    expect(MOTION_TIMINGS.hover).toBe(.8);
    expect(MOTION_TIMINGS.menu).toBe(1.2);
    expect(MOTION_TIMINGS.menuItem).toBe(.72);
    expect(MOTION_TIMINGS.dialog).toBe(1.35);
    expect(MOTION_TIMINGS.viewExit).toBe(.8);
    expect(MOTION_TIMINGS.viewEnter).toBe(1.2);
    expect(MOTION_TIMINGS.view).toBe(2);
    expect(MOTION_TIMINGS.viewExit + MOTION_TIMINGS.viewEnter).toBe(MOTION_TIMINGS.view);
    expect(MOTION_TIMINGS.rail).toBe(1500);
    expect(MOTION_TIMINGS.billboard).toBe(2.3);
    expect(MOTION_TIMINGS.profileMorph).toBe(2.2);
    expect(MOTION_TIMINGS.profileEntry).toBe(1.3);
    expect(MOTION_TIMINGS.reduced).toBeGreaterThanOrEqual(.16);
  });

  it("defines distinct view and billboard choreography for every theme", () => {
    const definitions = Object.values(THEME_MOTION);
    expect(definitions).toHaveLength(4);
    expect(new Set(definitions.map((definition) => JSON.stringify(definition.view.initial))).size).toBe(4);
    expect(definitions.every((definition) => definition.billboard.initial && definition.cardHover.scale > 1)).toBe(true);
  });

  it("exposes normal and reduced preferences through one provider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <MotionProvider>{children}</MotionProvider>;
    const { result } = renderHook(() => useAppMotion(), { wrapper });
    expect(result.current.reduced).toBe(false);
    Object.defineProperty(window, "matchMedia", { configurable: true, value: () => matchMedia(true) });
    const reducedWrapper = ({ children }: { children: React.ReactNode }) => <MotionProvider>{children}</MotionProvider>;
    const reduced = renderHook(() => useAppMotion(), { wrapper: reducedWrapper });
    expect(reduced.result.current.reduced).toBe(true);
  });
});
