import axios, { AxiosError } from "axios";
import { ApiResponse } from "../../common/type/ApiResponse";
import { PostDetail } from "../../common/component/Board/type/BoardDetailTypes";

const BASE = import.meta.env.VITE_API_URL;

/**
 * 모임 게시글 상세 조회
 * @param postCode - 게시글 코드
 * @returns 게시글 상세 정보
 */
export const fetchGatheringBoardDetail = async (postCode: string): Promise<ApiResponse<PostDetail>> => {
  const res = await axios.get(`${BASE}/gathering/board/detail/${postCode}`);
  return res.data;
};

/**
 * 모임 게시글 삭제
 * @param postCode - 게시글 코드
 * @throws {Error} 삭제 실패 시 에러
 */
export const deleteGatheringBoard = async (postCode: string): Promise<void> => {
  try {
    await axios.delete(`${BASE}/gathering/board/delete/${postCode}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.msg || "게시글 삭제에 실패했습니다.";
      throw new Error(errorMessage);
    }
    throw new Error("게시글 삭제 중 오류가 발생했습니다.");
  }
};

// 좋아요 등록 (게시글)
export const setLikePost = async (postId: string) => {
  const response = await axios.post(`${BASE}/likes/set/${postId}`);
  return response.data;
};

// 좋아요 해제 (게시글)
export const resetLikePost = async (postId: string) => {
  const response = await axios.post(`${BASE}/likes/reset/${postId}`);
  return response.data;
};
