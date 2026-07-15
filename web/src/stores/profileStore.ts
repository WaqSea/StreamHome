import { create } from "zustand";
import type { Profile } from "../types/api";

interface ProfileState {
  profiles: Profile[];
  activeProfile: Profile | null;
  isAdmin: boolean;
  setProfiles: (profiles: Profile[]) => void;
  updateProfile: (profile: Profile) => void;
  removeProfile: (profileId: string) => void;
  selectProfile: (profile: Profile) => void;
  clearProfile: () => void;
  restoreProfile: (profiles: Profile[]) => Profile | null;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profiles: [],
  activeProfile: null,
  isAdmin: false,

  setProfiles: (profiles) => set({ profiles }),

  updateProfile: (profile) => set((state) => ({
    profiles: state.profiles.map((item) => item.id === profile.id ? profile : item),
    activeProfile: state.activeProfile?.id === profile.id ? profile : state.activeProfile,
  })),

  removeProfile: (profileId) => set((state) => {
    const removingActive = state.activeProfile?.id === profileId;
    if (localStorage.getItem("streamhome_profile") === profileId) localStorage.removeItem("streamhome_profile");
    return {
      profiles: state.profiles.filter((profile) => profile.id !== profileId),
      activeProfile: removingActive ? null : state.activeProfile,
      isAdmin: removingActive ? false : state.isAdmin,
    };
  }),

  selectProfile: (profile) => {
    localStorage.setItem("streamhome_profile", profile.id);
    set({ activeProfile: profile, isAdmin: profile.id === "1" });
  },

  clearProfile: () => {
    localStorage.removeItem("streamhome_profile");
    set({ activeProfile: null, isAdmin: false });
  },

  restoreProfile: (profiles) => {
    const savedId = localStorage.getItem("streamhome_profile");
    const profile = profiles.find((item) => item.id === savedId) ?? null;
    set({ profiles, activeProfile: profile, isAdmin: profile?.id === "1" });
    return profile;
  },
}));
