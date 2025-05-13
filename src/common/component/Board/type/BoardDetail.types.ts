import { CommuDetail } from "../../../../community/board/type/boardDetail";
import { GatheringDetail } from "../../../../gathering/type/GatheringBoardDetailPage.types";

export interface YoutubeVideo { // 유튜브 검색 api 타입
    id: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
}

export interface GetBoardDetailRequest { //조회할때 사용
    post: CommuDetail | GatheringDetail;   // 게시글 상세 정보
    replys?: Reply[];        // 댓글 목록
}

export interface PostDetail {
    board_code: string;           // 게시글 ID
    member_id: string;
    title: string;                // 게시글 제목
    content: string;              // 게시글 본문 (HTML 또는 markdown 가능)
    views: number;                // 조회수
    likes: number;                // 좋아요 수
    create_at: string;            // 등록일
    imageUrl: string;             // 대표 이미지 URL
    isLike: boolean;              // 해당 게시글을 좋아요했었는가
}

export interface Reply {
    reply_code: number;         // 댓글 ID (PK)
    member_id: string;          // 댓글 작성자 (회원 ID)
    code: string;               // 게시글 ID (매핑)
    content: string;            // 댓글 내용
    p_reply_code?: number | null | undefined;      // 부모 댓글 ID (대댓글일 경우)
    del_yn: boolean;            // 삭제 여부
    del_reason?: string;        // 삭제 사유
    reReply?: Reply[];        // 대댓글 리스트 (2차 댓글)
    date: string;               // 작성일
    likes: number;              // 좋아요
}