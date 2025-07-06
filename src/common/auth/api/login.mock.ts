import { Login } from "../type/type";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export const fetchLogin = async (loginData: Login) => {
    try{
      const response = await axios.post(`${baseURL}/login`,loginData);
      if (response.status === 200) {
        console.log("로그인 성공");
        // 예: 토큰 저장 or 리다이렉트
        // const data = await response.json();
        // localStorage.setItem("accessToken", data.token);
        // 1. accessToken, refreshToken 파싱
        const { accessToken, refreshToken } = response.data;

        // 2. 로컬스토리지에 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // 3. 기본 Authorization 헤더 설정 (axios 공통 헤더)
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        window.location.href = "/dashboard";
      } else {
        console.error("로그인 실패", response.status);
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("서버 오류:", error);
    }
}