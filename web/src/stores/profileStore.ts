import { create } from 'zustand';
import type { Profile } from '../types/api';

interface ProfileState {
  profiles: Profile[];
  activeProfile: Profile | null;
  isAdmin: boolean;
  setProfiles: (profiles: Profile[]) => void;
  selectProfile: (profile: Profile) => void;
  clearProfile: () => void;
  loadFromStorage: (profiles: Profile[]) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profiles: [],
  activeProfile: null,
  isAdmin: false,

  setProfiles: (profiles) => {
    set({ profiles });
  },

  selectProfile: (profile) => {
    localStorage.setItem("streamhome_profile", profile.id);
    set({ 
      activeProfile: profile, 
      isAdmin: profile.id === "1" 
    });
  },

  clearProfile: () => {
    localStorage.removeItem("streamhome_profile");
    set({ activeProfile: null, isAdmin: false });
  },

  loadFromStorage: (profiles) => {
    const savedId = localStorage.getItem("streamhome_profile");
    if (savedId) {
      const match = profiles.find(p => p.id === savedId);
      if (match) {
        set({ 
          profiles,
          activeProfile: match,
          isAdmin: match.id === "1"
        });
        return;
      }
    }
    set({ profiles });
  }
}));
