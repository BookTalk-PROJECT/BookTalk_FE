import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * 모임 생성 API 요청
 * @param formData - 모임 정보를 포함한 FormData
 * @returns API 응답 데이터
 * @throws {Error} API 요청 실패 시 에러
 */
export const createGathering = async (formData: FormData) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/gathering/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.msg || "모임 생성에 실패했습니다.";
      throw new Error(errorMessage);
    }
    throw new Error("모임 생성 중 오류가 발생했습니다.");
  }
};
