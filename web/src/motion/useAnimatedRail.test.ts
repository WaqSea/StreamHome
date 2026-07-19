import { describe, expect, it } from "vitest";
import { cinematicRailEase, railTarget } from "./useAnimatedRail";

describe("controlled category rail motion", () => {
  it("uses a smooth monotonic cinematic easing curve", () => {
    expect(cinematicRailEase(0)).toBe(0);
    expect(cinematicRailEase(.25)).toBeGreaterThan(.25);
    expect(cinematicRailEase(.75)).toBeGreaterThan(cinematicRailEase(.25));
    expect(cinematicRailEase(1)).toBe(1);
  });

  it("moves to complete card-page boundaries without retaining the previous group", () => {
    const itemOffsets = [64, 268, 472, 676, 880, 1084, 1288, 1492, 1696, 1900, 2104, 2308];
    expect(railTarget({ scrollLeft: 0, clientWidth: 1000, scrollWidth: 2600, itemOffsets, leadingInset: 64, trailingInset: 64 }, 1)).toBe(1020);
    expect(railTarget({ scrollLeft: 1020, clientWidth: 1000, scrollWidth: 2600, itemOffsets, leadingInset: 64, trailingInset: 64 }, -1)).toBe(0);
  });

  it("clamps an incomplete final page and supports a measured-width fallback", () => {
    expect(railTarget({ scrollLeft: 1020, clientWidth: 1000, scrollWidth: 2600, itemOffsets: [64, 1084], leadingInset: 64, trailingInset: 64 }, 1)).toBe(1600);
    expect(railTarget({ scrollLeft: 0, clientWidth: 1000, scrollWidth: 2600 }, 1)).toBe(1000);
    expect(railTarget({ scrollLeft: 120, clientWidth: 1000, scrollWidth: 2600 }, -1)).toBe(0);
  });
});
