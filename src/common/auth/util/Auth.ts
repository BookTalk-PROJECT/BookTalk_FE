// src/auth/auth.ts
import type { NavigateFunction } from "react-router-dom";
import { fetchLogout } from "../api/Auth";

export const ACCESS_TOKEN_KEY = "accessToken";

export function clearAuth(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  // TODO: zustand/recoil/redux 쓰면 여기서 reset 호출
}

export async function logoutWithServer(): Promise<void> {
  try {
    await fetchLogout(); // 서버 refresh 무효화(가능하면)
  } catch (e) {
    // 서버 호출 실패해도 클라는 반드시 정리
    console.warn("fetchLogout failed:", e);
  } finally {
    clearAuth();
  }
}

export async function logoutAndRedirect(
  navigate: NavigateFunction,
  path: string = "/"
): Promise<void> {
  await logoutWithServer();
  navigate(path, { replace: true });
}

/** 인터셉터 같이 navigate가 없는 곳에서 쓰는 버전 */
export function logoutHardRedirect(path: string = "/"): void {
  clearAuth();
  window.location.replace(path);
}
