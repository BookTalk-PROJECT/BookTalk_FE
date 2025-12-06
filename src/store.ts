import { create } from "zustand";

type AuthStore = {
    isAuthenticated: boolean;
    initialize: () => Promise<void>;
    login: () => void;
    logout: () => void;
}

const BASE_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: !!localStorage.getItem("accessToken"),

    // 앱 들어올 때 토큰 유효성 검사
    initialize: async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const res = await fetch(`${BASE_URL}/member/authentication`);

        if (!res.ok) throw new Error("Invalid token");
        set({ isAuthenticated: true });
      } catch {
        localStorage.removeItem("accessToken");
        set({ isAuthenticated: false });
      }
    },
    login: () => set({isAuthenticated: true}),
    logout: () => set({isAuthenticated: false})
}));
