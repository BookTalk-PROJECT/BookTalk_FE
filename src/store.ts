import axios from "axios";
import { create } from "zustand";

type UserInfo = {
  id?: number;
  name?: string;
  email?: string;
  authority?: string;
};

type AuthStore = {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  initialize: () => Promise<void>;
  login: () => void;
  logout: () => Promise<void>;
};

const BASE_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!localStorage.getItem("accessToken"),
  userInfo: JSON.parse(localStorage.getItem("userInfo") || "null"),

  // 앱 들어올 때 토큰 유효성 검사
  initialize: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await axios.get(`${BASE_URL}/member/authentication`);
      const userInfo = res.data?.data || null;
      if (userInfo) {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
      set({ isAuthenticated: true, userInfo });
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      set({ isAuthenticated: false, userInfo: null });
    }
  },
  login: () => set({ isAuthenticated: true }),
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
      localStorage.removeItem("userInfo");
      set({ isAuthenticated: false, userInfo: null });
    }
  },
}));
