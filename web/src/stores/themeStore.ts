import { create } from 'zustand';
import type { ThemeId } from '../types/theme';
import type { Profile } from '../types/api';

interface ThemeState {
  activeTheme: ThemeId;
  setTheme: (themeId: ThemeId) => void;
  syncFromProfile: (profile: Profile | null) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  activeTheme: "ember",

  setTheme: (themeId) => {
    document.documentElement.setAttribute("data-theme", themeId);
    set({ activeTheme: themeId });
  },

  syncFromProfile: (profile) => {
    const fallbackTheme: ThemeId = "ember";
    const newTheme = (profile?.theme as ThemeId) || fallbackTheme;
    
    document.documentElement.setAttribute("data-theme", newTheme);
    set({ activeTheme: newTheme });
  }
}));
