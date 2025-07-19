import { CommuDetail } from "../../../../community/board/type/boardDetail";
import { GatheringDetail } from "../../../../gathering/type/GatheringBoardDetailPage.types";

export interface YoutubeVideo {
  // 유튜브 검색 api 타입
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

export interface GetBoardDetailRequest {
  //게시글 조회 type
  post: CommuDetail | GatheringDetail; // 게시글 상세 정보
  replies?: Reply[]; // 댓글 목록
}

export interface PostInfo {
  board_code: string;
  categoryId: number;
  title: string;
  author: string;
  date: string;
  views: number;
}

export interface PostDetail {
  //게시글 조회 common type
  board_code: string; // 게시글 ID
  member_id: number; // 게시자 아이디
  title: string; // 게시글 제목
  content: string; // 게시글 본문 (HTML 또는 markdown 가능)
  author: string;
  views: number; // 조회수
  likes_cnt: number; // 좋아요 수
  reg_date: string; // 등록일 
  update_date: string;
  imageUrl: string; // 대표 이미지 URL
  is_liked: boolean; // 해당 게시글을 좋아요했었는가
  notification_yn: boolean; // 공지 여부
  del_reason: string | null; // 삭제 사유
}

export interface Reply {
  //댓글조회 type
  reply_code: string; // 댓글 ID (PK)
  member_id: number; // 댓글 작성자 (회원 ID)
  code: string; // 게시글 ID (매핑)
  content: string; // 댓글 내용
  p_reply_code?: number | null | undefined; // 부모 댓글 ID (대댓글일 경우)
  del_yn: boolean; // 삭제 여부
  del_reason?: string; // 삭제 사유
  reRepies?: Reply[]; // 대댓글 리스트 (2차 댓글)
  create_at: string; // 작성일
  likes: number; // 좋아요
}

export interface createReply {
  postId: string;
  gatheringId?: string;
  replyContent: string;
  replyTarget?: number;
}
