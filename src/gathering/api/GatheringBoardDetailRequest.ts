import axios from "axios";
import { ApiResponse } from "../../common/type/ApiResponse";
import { PostDetail } from "../../common/component/Board/type/BoardDetailTypes";

const BASE = import.meta.env.VITE_API_URL;

export const fetchGatheringBoardDetail = async (postCode: string): Promise<ApiResponse<PostDetail>> => {
  const res = await axios.get(`${BASE}/gathering/board/detail/${postCode}`);
  return res.data;
};

export const deleteGatheringBoard = (postCode: string): void => {
  axios.delete(`${BASE}/gathering/board/delete/${postCode}`).catch((e) => {
    console.error("모임 게시글 삭제 실패:", e);
    alert("삭제 중 오류가 발생했습니다.");
  });
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
