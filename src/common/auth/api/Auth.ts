
import { Login } from "../type/type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const fetchLogin = async (loginData: Login) => {
    try{
      const response = await axios.post(`${baseURL}/login`,loginData);

      const IsExistToken = response.data.data.accessToken !== undefined;

      if (response.status === 200 && IsExistToken) {
        console.log("로그인 성공");
        // 예: 토큰 저장 or 리다이렉트
        // const data = await response.json();
        // localStorage.setItem("accessToken", data.token);
        // 1. accessToken파싱
        const { accessToken } = response.data.data;

        // 2. 로컬스토리지에 저장
        localStorage.setItem("accessToken", accessToken);

        // 3. 기본 Authorization 헤더 설정 (axios 공통 헤더)
        //axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      } else {
        console.error("로그인 실패", response.status);
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("서버 오류:", error);
    }
}

export const fetchLogout = async () => {
  try{
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
}

export const fetchReissueToken = async () => {
  try{
    const response = await axios.post(`${baseURL}/refresh`);

    const IsExistToken = response.data.data.accessToken !== undefined;

    if (response.status === 200 && IsExistToken) {
      console.log("엑세스 토큰 재발급");
      const { accessToken } = response.data.data;
      //  로컬스토리지에 저장
      localStorage.setItem("accessToken", accessToken);

      return accessToken;
    } else {
      console.error("엑세스 토큰 재발급 실패", response.status);
    }
  } catch (error) {
    console.error("서버 오류:", error);
  }
}


export const fetchKakaoLogin = async (code: string) => {
  try{
    const response = await axios.post(`${baseURL}/auth/kakao?code=${code}`);

    if (response.status === 200 ) {
      console.log("로그인 성공");

    }
  } catch (error) {
    console.error("서버 오류:", error);
  }
}