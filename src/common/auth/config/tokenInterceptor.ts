import axios from 'axios';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  console.log("엑세스 토큰 인터셉트!!");
  // 내 서버 주소일 때만 헤더 붙임
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const isInternal = config.url?.startsWith(BASE_URL) || config.baseURL?.includes(BASE_URL);

  // 토큰이 존재하면서, 요청 url이 서버와 일치할때 헤더에 엑세스 토큰 붙임
  if (token && isInternal) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
