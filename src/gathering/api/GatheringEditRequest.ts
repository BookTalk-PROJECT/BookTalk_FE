import axios, { AxiosError } from "axios";
import { GatheringDetailResponse } from "../type/GatheringEditPage.types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * 모임 상세 정보 조회 API 요청
 * @param code - 모임 코드
 * @returns 모임 상세 정보
 * @throws {Error} API 요청 실패 시 에러
 */
export const getGatheringDetail = async (code: string): Promise<GatheringDetailResponse> => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/gathering/${code}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.msg || "모임 정보를 불러오는데 실패했습니다.";
      throw new Error(errorMessage);
    }
    throw new Error("모임 정보 조회 중 오류가 발생했습니다.");
  }
};

/**
 * 모임 정보 수정 API 요청
 * @param code - 모임 코드
 * @param formData - 수정할 모임 정보를 포함한 FormData
 * @returns API 응답 데이터
 * @throws {Error} API 요청 실패 시 에러
 */
export const updateGathering = async (code: string, formData: FormData) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const res = await axios.put(`${API_BASE_URL}/gathering/modify/${code}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.msg || "모임 정보 수정에 실패했습니다.";
      throw new Error(errorMessage);
    }
    throw new Error("모임 정보 수정 중 오류가 발생했습니다.");
  }
};
