import axios from 'axios';
import { fetchReissueToken } from "../api/Auth";

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

    // 401 에러이고, 재시도한 요청이 아닐 경우
    if (error.response.status === 401 && !originalRequest._retry && error.response.data.errorCode == "ACCESS_TOKEN_EXPIRED") {
      originalRequest._retry = true; // 재시도 플래그 설정
      try {
        // 가상 토큰 재발급 엔드포인트
        fetchReissueToken().then((newAccessToken) =>{
          // 기본 헤더 및 원래 요청 헤더 업데이트
          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        })

      } catch (refreshError) {
        // 토큰 재발급 실패 시 (예: 리프레시 토큰 만료)
        console.error("Unable to refresh token:", refreshError);
        // 로그인 페이지로 리디렉션 또는 다른 오류 처리
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    // 401 에러가 아니거나 재시도 요청인 경우
    return Promise.reject(error);
  }
);
