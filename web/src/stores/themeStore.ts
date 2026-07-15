import { create } from "zustand";
import type { Profile } from "../types/api";
import type { ThemeId } from "../types/theme";
import { normalizeTheme } from "../utils/media";

interface ThemeState {
  activeTheme: ThemeId;
  setTheme: (themeId: string | null | undefined) => void;
  syncFromProfile: (profile: Profile | null) => void;
}

function applyTheme(theme: string | null | undefined): ThemeId {
  return normalizeTheme(theme);
}

export const useThemeStore = create<ThemeState>((set) => ({
  activeTheme: "ember",
  setTheme: (theme) => set({ activeTheme: applyTheme(theme) }),
  syncFromProfile: (profile) => set({ activeTheme: applyTheme(profile?.theme) }),
}));
