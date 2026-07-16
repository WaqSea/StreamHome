import { describe, expect, it } from "vitest";
import { cinematicRailEase, railTarget } from "./useAnimatedRail";

describe("controlled category rail motion", () => {
  it("uses a smooth monotonic cinematic easing curve", () => {
    expect(cinematicRailEase(0)).toBe(0);
    expect(cinematicRailEase(.25)).toBeGreaterThan(.25);
    expect(cinematicRailEase(.75)).toBeGreaterThan(cinematicRailEase(.25));
    expect(cinematicRailEase(1)).toBe(1);
  });

  it("moves by an aligned card group and clamps both edges", () => {
    expect(railTarget({ scrollLeft: 0, clientWidth: 1000, scrollWidth: 2600 }, 1)).toBe(820);
    expect(railTarget({ scrollLeft: 1500, clientWidth: 1000, scrollWidth: 2600 }, 1)).toBe(1600);
    expect(railTarget({ scrollLeft: 120, clientWidth: 1000, scrollWidth: 2600 }, -1)).toBe(0);
  });
});
