import { create } from 'zustand';

interface AuthState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  setToken: (token: string, email: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  email: null,
  isAuthenticated: false,

  setToken: (token, email) => {
    localStorage.setItem("streamhome_token", token);
    set({ token, email, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("streamhome_token");
    set({ token: null, email: null, isAuthenticated: false });
    window.location.href = "/login";
  },

  loadFromStorage: () => {
    const token = localStorage.getItem("streamhome_token");
    if (token) {
      // We don't have the email stored currently based on instructions, 
      // but we set isAuthenticated to true if token exists.
      set({ token, isAuthenticated: true });
    }
  }
}));
