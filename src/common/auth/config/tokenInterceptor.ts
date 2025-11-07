import axios from 'axios';

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
  response => {
    // 정상 응답일 경우 그대로 반환
    return response;
  },
  error => {
    // 에러 응답 처리
    if (error.response) {
      const status = error.response.status;
      // 401 Unauthorized(토큰 만료 또는 인증 실패) 체크
      if (status === 401) {
        // 로그인 페이지로 이동 (SPA 환경 기준)
        alert("인증 정보가 만료되었습니다.\n로그인페이지로 돌아갑니다.")
        localStorage.clear();
        window.location.href = "/login";
        // 또는 React Router를 쓴다면 useNavigate()를 사용 가능
      }
    }
    // 다른 에러는 그대로 reject
    return Promise.reject(error);
  }
)