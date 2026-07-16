import { describe, expect, it } from "vitest";
import { profileEditReturnTarget, profileEditUrl } from "./profileEditing";

describe("profile editing navigation", () => {
  it("encodes profile identifiers in editor URLs", () => {
    expect(profileEditUrl("family/profile 2")).toBe("/profiles/family%2Fprofile%202/edit");
  });

  it("preserves internal return locations", () => {
    expect(profileEditReturnTarget({ returnTo: "/?profile=2&view=movies#featured" })).toBe("/?profile=2&view=movies#featured");
  });

  it("rejects missing and protocol-relative return locations", () => {
    expect(profileEditReturnTarget(undefined)).toBe("/profiles");
    expect(profileEditReturnTarget({ returnTo: "https://example.com" })).toBe("/profiles");
    expect(profileEditReturnTarget({ returnTo: "//example.com" })).toBe("/profiles");
  });
});
