import { Login } from "../type/type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const fetchLogin = async (loginData: Login) => {
  const response = await axios.post(`${baseURL}/login`, loginData);

  const IsExistToken = response.data?.data?.accessToken !== undefined;
  if (!IsExistToken) {
    throw new Error("No access token in response");
  }

  const { accessToken } = response.data.data;
  // 토큰 저장까지 여기서 할지, 위로 올릴지는 팀 스타일에 따라
  localStorage.setItem("accessToken", accessToken);

  return response.data; // 필요한 데이터 리턴
};

export const fetchLogout = async () => {
  try {
    const response = await axios.post(`${baseURL}/logout`);

    const isDeletedRT = response.data.data.isDeleted;

    if (response.status === 200 && isDeletedRT) {
      console.log("리프레시 토큰 삭제");
      // 예: 토큰 저장 or 리다이렉트
      // const data = await response.json();
      // localStorage.setItem("accessToken", data.token);
      // 1. accessToken파싱
      const { accessToken } = response.data.data;
    } else {
      console.error("리프레시 토큰 삭제 실패", response.status);
    }
  } catch (error) {
    console.error("서버 오류:", error);
  }
};

export const fetchReissueToken = async (): Promise<string> => {
  try {
    const response = await axios.post(`${baseURL}/refresh`, null, {
      withCredentials: true,
      headers: { "X-Skip-Auth-Refresh": "true" }, // refresh 요청은 인터셉터 refresh 로직 스킵(안전)
    });

    const accessToken = response.data?.data?.accessToken as string | undefined;

    if (response.status === 200 && accessToken) {
      console.log("엑세스 토큰 재발급");
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    }

    // “정상 응답인데 토큰이 없음”도 실패로 처리
    throw new Error("Refresh succeeded but accessToken missing");
  } catch (error) {
    // 중요: 바깥(인터셉터)에서 잡을 수 있게 다시 throw
    throw error;
  }
};

export const fetchKakaoLogin = async (code: string) => {
  try {
    const response = await axios.post(`${baseURL}/auth/kakao?code=${code}`);

    if (response.status === 200) {
      console.log("로그인 성공");
    }
  } catch (error) {
    console.error("서버 오류:", error);
  }
};
