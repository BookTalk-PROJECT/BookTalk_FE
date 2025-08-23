import axios from "axios";
import { GetBoardDetailRequest } from "../../common/component/Board/type/BoardDetail.types";

// API 키 및 기본 URL 설정
const baseURL = import.meta.env.VITE_API_URL;

//모임 게시글 상세 조회
export const fetchGatheringBoardDetail = async (postId: string): Promise<GetBoardDetailRequest> => {
  console.log(" 게시글 번호 : " + postId + " 이거 조회한데이?");
  const response = await axios.get<GetBoardDetailRequest>(
    `${baseURL}/gatheringlist/gatheringboard/${postId}/getBoardDetail`
  );
  return response.data;
};

// 댓글 등록 (부모 댓글 & 대댓글)
export const createReply = async (postId: string, content: string, parentReplyCode?: number | null) => {
  console.log(" 모임 게시글 번호 : " + postId + " 내용 : " + content + " 대댓글이니? : " + parentReplyCode);

  const response = await axios.post(`${baseURL}/gatheringboard/${postId}/createreply`, {
    content,
    p_reply_code: parentReplyCode ?? null, // 부모 댓글일 경우 null, 대댓글일 경우 부모 댓글 ID
  });
  return response.data;
};

// 좋아요 토글 (게시글)
export const toggleLikePost = async (postId: string) => {
  // <-- 아이디도 추가해줘야함 나중에 로그인 구현 시 추가할 예정
  console.log(" 모임 번호: " + postId + " 이거 좋아요 변경한다이?");

  // 실제 API 요청으로 변경할 경우
  const response = await axios.post(`${baseURL}/gatheringboard/${postId}/togglelike`, {});
  return response.data;
};
