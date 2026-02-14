import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { fetchReissueToken } from "../api/Auth";
import { useAuthStore } from "../../../store";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (accessToken: string) => {
  refreshSubscribers.forEach((callback) => callback(accessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};



axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  // 내 서버 주소일 때만 헤더 붙임
  const BASE_URL = import.meta.env.VITE_API_URL;
  const isInternal = config.url?.startsWith(BASE_URL) || config.baseURL?.includes(BASE_URL);

  // 토큰이 존재하면서, 요청 url이 서버와 일치할때 헤더에 엑세스 토큰 붙임
  if (token && isInternal) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError | any) => { // any를 허용하거나, 커스텀 에러 타입을 정의해도 됨
    // 💡 _retry 속성은 axios 기본 타입에 없으므로 강제 형변환 필요
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 요청 자체가 실패했거나 config가 없으면 그대로 reject
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // 1. 요청 취소 예외 처리 (헤더 체크)
    if (originalRequest.headers && originalRequest.headers["X-Skip-Auth-Refresh"] === "true") {
      return Promise.reject(error);
    }

    // 2. 무한 루프 방지: 갱신 요청(reissue) 자체가 에러나면 즉시 종료
    if (originalRequest.url?.includes("/refresh")) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    // 백엔드 에러 응답 타입에 맞춰서 any 또는 제네릭 사용
    const errorCode = (error.response?.data as any)?.errorCode;

    // 3. 401 에러 처리 (토큰 만료)
    if (status === 401 && !originalRequest._retry && errorCode === "ACCESS_TOKEN_EXPIRED") {

      // (A) 이미 갱신 중이라면? -> 대기열에 넣고 기다림
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(axios(originalRequest));
          });
        });
      }

      // (B) 아무도 갱신 안 하고 있다면? -> 갱신 시작
      originalRequest._retry = true;
      isRefreshing = true;
12
      try {
        const newAccessToken = await fetchReissueToken();

        // 갱신 성공! 대기하던 요청들에게 알림
        onRefreshed(newAccessToken);

        // 내 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return axios(originalRequest);

      } catch (refreshError) {
        if (axios.isAxiosError(refreshError)) {
          const refreshStatus = refreshError.response?.status;
          const refreshErrorCode = (refreshError.response?.data as any)?.errorCode;

          // 리프레시 토큰도 만료/유효하지 않음 -> 강제 로그아웃
          if (
            refreshStatus === 401 &&
            (refreshErrorCode === "REFRESH_TOKEN_EXPIRED" ||
              refreshErrorCode === "INVALID_TOKEN" ||
              refreshErrorCode === "REFRESH_TOKEN_MISSING")
          ) {
            await useAuthStore.getState().logout();
            alert("로그인 상태가 만료되었습니다. 재로그인을 하세요.");
            // window.location.href = "/login"; // 필요 시 주석 해제
          }
        }
        return Promise.reject(refreshError);
      } finally {
        // 성공하든 실패하든 갱신 상태 해제
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
