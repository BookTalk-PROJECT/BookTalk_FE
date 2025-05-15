import axios from "axios";
import { GetBoardDetailRequest } from "../type/BoardDetail.types";

// API 키 및 기본 URL 설정
const baseURL = import.meta.env.BASE_URL;

export const exampleData: GetBoardDetailRequest = {
    post: {
        board_code: "1",
        member_id: 1,
        title: "독서모임 후기 1",
        gatheringId: "모임 게시글일때만 사용",
        views: 33,
        likes_cnt: 15,
        create_at: "2025-05-13",
        imageUrl: "https://readdy.ai/api/search-image?query=modern%20book%20club%20meeting%20with%20people%20discussing%20literature%20in%20a%20contemporary%20minimalist%20setting%20with%20warm%20lighting%20and%20comfortable%20seating%20arrangement&width=1200&height=675&seq=1&orientation=landscape",
        content: `오늘 진행된 독서모임에서는 '책이름1'을 가지고 깊이 있는 토론을 진행했습니다...
                다음 모임에서는 '책이름2'를 읽고 토론할 예정입니다.`,
        isLike: false,
        notification_yn: false,
        del_reason: null,       // 삭제 안되었을 시 null이셈
    },
    replies: [
        {
            reply_code: 1,
            member_id: 1,
            code: "POST_1",
            content: "좋은 후기 감사합니다. 다음 모임이 기대되네요!",
            p_reply_code: null,
            del_yn: false,
            create_at: "2023-02-24",
            likes: 5,
            reReply: [
                {
                    reply_code: 4,
                    member_id: 2,
                    code: "POST_1",
                    content: "저도 그렇게 생각합니다!",
                    p_reply_code: 1,
                    del_yn: false,
                    create_at: "2023-02-24",
                    likes: 3
                },
                {
                    reply_code: 5,
                    member_id: 3,
                    code: "POST_1",
                    content: "저도 그렇게 생각합니다!저도 그렇게 생각합니다!저도 그렇게 생각합니다!저도 그렇게 생각합니다!저도 그렇게 생각합니다!저도 그렇게 생각합니다!저도 그렇게 생각합니다!저도 그렇게 생각합니다!",
                    p_reply_code: 1,
                    del_yn: false,
                    create_at: "2023-02-24",
                    likes: 3
                }
            ]
        },
        {
            reply_code: 2,
            member_id: 4,
            code: "POST_1",
            content: "저도 참여했었는데, 정말 유익한 시간이었습니다.",
            p_reply_code: null,
            del_yn: false,
            create_at: "2023-02-24",
            likes: 423,
            reReply: [
                {
                    reply_code: 6,
                    member_id: 5,
                    code: "POST_1",
                    content: "맞아요! 정말 좋은 시간이었죠!",
                    p_reply_code: 3,
                    del_yn: false,
                    create_at: "2023-02-24",
                    likes: 10
                }
            ]
        },
        {
            reply_code: 3,
            member_id: 6,
            code: "POST_1",
            content: "다음 모임에는 꼭 참여하고 싶네요!",
            p_reply_code: null,
            del_yn: false,
            create_at: "2023-02-23",
            likes: 2,
            reReply: [
                {
                    reply_code: 8,
                    member_id: 7,
                    code: "POST_1",
                    content: "맞아요! 정말 좋은 시간이었죠!",
                    p_reply_code: 3,
                    del_yn: false,
                    create_at: "2023-02-24",
                    likes: 10
                }
            ]
        },
        {
            reply_code: 7,
            member_id: 8,
            code: "POST_1",
            content: "다음 모임에는 꼭 참여하고 싶네요!",
            p_reply_code: null,
            del_yn: false,
            create_at: "2023-02-23",
            likes: 2,
            reReply: []
        }
    ]
};