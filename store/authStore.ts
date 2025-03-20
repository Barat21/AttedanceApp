import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  username: null,
  login: (username: string, password: string) => {
    if (username === 'test' && password === 'test') {
      set({ isAuthenticated: true, username });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false, username: null }),
}));