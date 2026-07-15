import { beforeEach, describe, expect, it } from "vitest";
import type { Profile } from "../types/api";
import { useAuthStore } from "./authStore";
import { useProfileStore } from "./profileStore";
import { useThemeStore } from "./themeStore";

const profile: Profile = { id: "1", name: "Admin", avatarColor: "", theme: "netflix", pinEnabled: false, pin: null };

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ token: null, email: null, isAuthenticated: false, isHydrated: false });
  useProfileStore.setState({ profiles: [], activeProfile: null, isAdmin: false });
  useThemeStore.setState({ activeTheme: "ember" });
  document.documentElement.removeAttribute("data-theme");
});

describe("persisted client state", () => {
  it("hydrates token and email before protected routing", () => {
    localStorage.setItem("streamhome_token", "token");
    localStorage.setItem("streamhome_email", "admin@example.test");
    useAuthStore.getState().hydrate();
    expect(useAuthStore.getState()).toMatchObject({ token: "token", email: "admin@example.test", isAuthenticated: true, isHydrated: true });
  });

  it("restores the selected profile and maps legacy values to Ember without changing the document root", () => {
    localStorage.setItem("streamhome_profile", "1");
    expect(useProfileStore.getState().restoreProfile([profile])).toEqual(profile);
    useThemeStore.getState().syncFromProfile(profile);
    expect(useProfileStore.getState().isAdmin).toBe(true);
    expect(useThemeStore.getState().activeTheme).toBe("ember");
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  it("updates and safely removes profiles from client state", () => {
    const child = { ...profile, id: "2", name: "Viewer", theme: "aurora" };
    useProfileStore.setState({ profiles: [profile, child], activeProfile: child, isAdmin: false });
    localStorage.setItem("streamhome_profile", "2");
    const updated = { ...child, name: "Renamed", theme: "gemini" };
    useProfileStore.getState().updateProfile(updated);
    expect(useProfileStore.getState().profiles[1]).toEqual(updated);
    expect(useProfileStore.getState().activeProfile).toEqual(updated);
    useProfileStore.getState().removeProfile("2");
    expect(useProfileStore.getState()).toMatchObject({ profiles: [profile], activeProfile: null, isAdmin: false });
    expect(localStorage.getItem("streamhome_profile")).toBeNull();
  });
});
