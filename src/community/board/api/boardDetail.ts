import axios from "axios";
import { GetBoardDetailRequest } from "../../../common/component/Board/type/BoardDetail.types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getBoardDetail = async (postId: string): Promise<GetBoardDetailRequest> => {
  const response = await axios.get<GetBoardDetailRequest>(`${BASE_URL}/board/getDetail/${postId}`);
  return response.data;
};

// 댓글 등록 (부모 댓글 & 대댓글)
export const postReply = async (postId: string, content: string, parentReplyCode?: number | null) => {
  const response = await axios.post(`${BASE_URL}/board/createreply/${postId}`, {
    content,
    p_reply_code: parentReplyCode ?? null, // 부모 댓글일 경우 null, 대댓글일 경우 부모 댓글 ID
  });
  return response.data;
};

// 좋아요 토글 (게시글)
export const toggleLikePost = async (postId: string) => {
  // <-- 아이디도 추가해줘야함 나중에 로그인 구현 시 추가할 예정

  // 실제 API 요청으로 변경할 경우
  const response = await axios.post(`${BASE_URL}/board/togglelike/${postId}`, {});
  return response.data;
};
