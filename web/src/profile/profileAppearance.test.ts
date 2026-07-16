import { describe, expect, it } from "vitest";
import { PROFILE_AVATAR_PRESETS, avatarPresetBackground, isAvatarPresetBackground } from "./profileAppearance";

describe("profile avatar presets", () => {
  it("renders recognized preset values unchanged", () => {
    const preset = PROFILE_AVATAR_PRESETS[2].background;
    expect(avatarPresetBackground({ id: "2", avatarColor: preset })).toBe(preset);
    expect(isAvatarPresetBackground(preset)).toBe(true);
  });

  it("never renders arbitrary or legacy CSS values", () => {
    const unsafe = "url(https://example.com/tracking.png)";
    const result = avatarPresetBackground({ id: "viewer", avatarColor: unsafe });
    expect(result).not.toBe(unsafe);
    expect(isAvatarPresetBackground(result)).toBe(true);
  });

  it("uses a stable deterministic fallback for unknown values", () => {
    const first = avatarPresetBackground({ id: "legacy-profile", avatarColor: "#ff5f1f" });
    const second = avatarPresetBackground({ id: "legacy-profile", avatarColor: "not-a-preset" });
    expect(first).toBe(second);
  });
});
