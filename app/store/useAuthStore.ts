import { create } from "zustand";

interface AuthState {
  authUser: any;
  setAuthUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  setAuthUser: (user) => set({ authUser: user }),
}));