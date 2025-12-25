import axios from "axios";
import { create } from "zustand";

type AuthStore = {
    isAuthenticated: boolean;
    initialize: () => Promise<void>;
    login: () => void;
    logout: () => Promise<void>;
}

const BASE_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: !!localStorage.getItem("accessToken"),

    // 앱 들어올 때 토큰 유효성 검사
    initialize: async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const res = await axios.get(`${BASE_URL}/member/authentication`);
        set({ isAuthenticated: true });
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ isAuthenticated: false });
      }
    },
    login: () => set({isAuthenticated: true}),
    logout: async () => {
      try {
        console.log("뭐뜨나");
        await axios.post(`${BASE_URL}/logout`, null, {
          withCredentials: true,
          // 로그아웃 요청임을 표시(인터셉터에서 예외 처리할 때 사용)
          headers: { "X-Skip-Auth-Refresh": "true" },
        });
      } catch (e) {
        console.warn("Server logout failed");
      } finally {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ isAuthenticated: false });
      }
    },
}));
