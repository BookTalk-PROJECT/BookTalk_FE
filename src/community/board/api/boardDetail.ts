import axios from "axios";
import { GetBoardDetailRequest } from "../../../common/component/Board/type/BoardDetail.types";
import { CommuPostRequest } from "../type/boardList";
import { ReplyRequest } from "../type/reply";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getBoardDetail = async (postId: string): Promise<GetBoardDetailRequest> => {
  const response = await axios.get<GetBoardDetailRequest>(`${BASE_URL}/community/board/detail/${postId}`);
  return response.data;
};

export const postBoard = async (req:CommuPostRequest, categoryId:number) => {
  const response = await axios.post(`${BASE_URL}/community/board/create`, {...req, categoryId: categoryId});
  return response.data;
};

export const deleteBoard = async (postId: string): Promise<void> => {
  const response = await axios.delete(`${BASE_URL}/community/board/delete/${postId}`);
  return response.data;
};

// 댓글 등록 (부모 댓글 & 대댓글)
export const postReply = async (req: ReplyRequest) => {
  const response = await axios.post(`${BASE_URL}/reply/create`, req);
  return response.data;
};

// 좋아요 토글 (게시글)
export const toggleLikePost = async (postId: string) => {
  // <-- 아이디도 추가해줘야함 나중에 로그인 구현 시 추가할 예정

  // 실제 API 요청으로 변경할 경우
  const response = await axios.post(`${BASE_URL}/board/togglelike/${postId}`, {});
  return response.data;
};
