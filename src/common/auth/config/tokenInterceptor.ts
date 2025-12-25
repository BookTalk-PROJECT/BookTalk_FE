import axios from "axios";
import { fetchReissueToken } from "../api/Auth";
import { useAuthStore } from "../../../store";

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
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거합니다.
    // 응답 데이터가 있는 작업 수행
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.headers?.["X-Skip-Auth-Refresh"] === "true") {
      return Promise.reject(error);
    }

    // 401 에러이고, 재시도한 요청이 아닐 경우
    const status = error?.response?.status;
    const errorCode = error?.response?.data?.errorCode;

    if (
      status === 401 &&
      !originalRequest._retry &&
      errorCode === "ACCESS_TOKEN_EXPIRED"
    ) {
      originalRequest._retry = true;

      try {
        //  refresh 호출 결과를 await로 받아야 "재시도"가 정상 동작
        const newAccessToken = await fetchReissueToken();

        // 원래 요청에 토큰 다시 붙여서 재시도
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axios(originalRequest);
      } catch (refreshError) {
        if (axios.isAxiosError(refreshError)) {
          const refreshStatus = refreshError?.response?.status;
          const refreshErrorCode = refreshError?.response?.data?.errorCode;

          // refresh 토큰 만료/무효면 로그아웃
          if (
            refreshStatus === 401 &&
            (refreshErrorCode === "REFRESH_TOKEN_EXPIRED" ||
              refreshErrorCode === "INVALID_TOKEN" ||
              refreshErrorCode === "REFRESH_TOKEN_MISSING")
          ) {
            await useAuthStore.getState().logout();
            alert("로그인 상태가 만료되었습니다. 재로그인을 하세요.")
            //window.location.replace("/");
          }

          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);
