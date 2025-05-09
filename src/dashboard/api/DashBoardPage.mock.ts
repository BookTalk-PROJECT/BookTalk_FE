import axios from "axios";
import { RecentGatherings, HighlightCard, RecentPost, RecentReply, ChartConfig } from "../type/DashBoardPage.type";

// API 키 및 기본 URL 설정
const baseURL = import.meta.env.BASE_URL;

// 더미 데이터 목록
export const testHighlightCards: HighlightCard[] = [
    {
        title: "활성화 모임",
        count: 256,
        description: "다양한 주제의 독서 모임",
        icon: "fas fa-book-reader",
        iconColor: "bg-blue-100 text-blue-500",
        textColor: "text-blue-600",
    },
    {
        title: "신규 모임",
        count: 23,
        description: "이번 주 새로 생긴 모임",
        icon: "fas fa-star",
        iconColor: "bg-green-100 text-green-500",
        textColor: "text-green-600",
    },
    {
        title: "추천 도서",
        count: 42,
        description: "이달의 회원 추천 도서",
        icon: "fas fa-bookmark",
        iconColor: "bg-indigo-100 text-indigo-500",
        textColor: "text-indigo-600",
    },
    {
        title: "활발한 댓글",
        count: 128,
        description: "오늘 작성된 댓글",
        icon: "fas fa-comment-dots",
        iconColor: "bg-pink-100 text-pink-500",
        textColor: "text-pink-600",
    },
];

// 더미 데이터 목록 (최신 모임)
export const testRecentGatherings: RecentGatherings[] = [
    { title: "현대 문학의 이해", createdAt: "2025-05-09", members: 24 },
    { title: "고전 소설 탐구", createdAt: "2025-05-08", members: 18 },
    { title: "과학 도서 클럽", createdAt: "2025-05-07", members: 31 },
    { title: "철학 독서 모임", createdAt: "2025-05-06", members: 15 },
    { title: "역사 탐험가들", createdAt: "2025-05-05", members: 22 },
];

// 더미 데이터 목록 (최신 게시글)
export const testRecentPosts: RecentPost[] = [
    {
        title: "5월 독서 모임 일정 안내",
        content: "다음 주 토요일 오후 3시에 카페에서 만나요...",
        author: "김지민",
        comments: 12,
        likes: 24,
    },
    {
        title: "소설 '데미안' 독후감",
        content: "헤르만 헤세의 대표작 데미안을 읽고...",
        author: "이서연",
        comments: 8,
        likes: 17,
    },
    {
        title: "추천 도서: 사피엔스",
        content: "유발 하라리의 사피엔스는 인류의 역사를...",
        author: "박준호",
        comments: 15,
        likes: 32,
    },
    {
        title: "독서 토론 방법론",
        content: "효과적인 독서 토론을 위한 방법을 공유합니다...",
        author: "최민지",
        comments: 7,
        likes: 19,
    },
    {
        title: "신간 소개: 미래의 역사",
        content: "이번 달에 출간된 미래의 역사라는 책을...",
        author: "정다운",
        comments: 5,
        likes: 11,
    },
];

// 더미 데이터 목록 (최신 댓글)
export const testRecentComments: RecentReply[] = [
    {
        content: "정말 좋은 책 추천 감사합니다. 저도 읽어봐야겠어요!",
        author: "한소희",
        createdAt: "2025-05-09 14:23",
    },
    {
        content: "다음 모임에서 이 책에 대해 더 자세히 이야기 나눠보고 싶네요.",
        author: "김태현",
        createdAt: "2025-05-09 11:45",
    },
    {
        content: "저는 이 작가의 다른 작품도 읽어봤는데, 이 책이 가장 인상적이었어요.",
        author: "이지원",
        createdAt: "2025-05-08 18:32",
    },
    {
        content: "토론 방법론 글 정말 유익했습니다. 다음 모임에서 적용해보겠습니다.",
        author: "박현우",
        createdAt: "2025-05-08 15:17",
    },
    {
        content: "일정 변경 가능한가요? 그날 다른 약속이 있어서요.",
        author: "정민수",
        createdAt: "2025-05-07 20:05",
    },
];

// 더미 차트 데이터 설정
export const testChartConfigs: ChartConfig[] = [
    { id: "userChart", title: "일별 사용자 가입 추이", color: "#3B82F6", data: [12, 15, 9, 23, 17, 28, 21] },
    { id: "postChart", title: "일별 게시글 작성 추이", color: "#10B981", data: [32, 45, 29, 53, 37, 48, 61] },
    { id: "commentChart", title: "일별 댓글 작성 추이", color: "#6366F1", data: [78, 65, 89, 103, 87, 118, 91] },
    { id: "likeChart", title: "일별 좋아요 수 추이", color: "#EC4899", data: [145, 132, 167, 189, 154, 201, 178] },
];


// 하이라이트 카드 데이터 요청
export const fetchHighlightCards = async (): Promise<HighlightCard[]> => {
    try {
        const response = await axios.get(`${baseURL}/dashboard/highlightcards`);
        return response.data; // 서버로부터 응답받은 데이터
    } catch (error) {
        console.error("API 요청 오류:", error);
        return testHighlightCards;
    }
};

// 최신 모임 데이터 요청 (API 요청 실패 시 더미 데이터 사용)
export const fetchRecentGatherings = async (): Promise<RecentGatherings[]> => {
    try {
        const response = await axios.get(`${baseURL}/dashboard/recentgatherings`);
        return response.data;
    } catch (error) {
        console.error("API 요청 오류:", error);
        return testRecentGatherings;
    }
};

// 최신 게시글 데이터 요청 (API 요청 실패 시 더미 데이터 사용)
export const fetchRecentPosts = async (): Promise<RecentPost[]> => {
    try {
        const response = await axios.get(`${baseURL}/dashboard/recentposts`);
        return response.data;
    } catch (error) {
        console.error("API 요청 오류:", error);
        return testRecentPosts;
    }
};

// 최신 댓글 데이터 요청 (API 요청 실패 시 더미 데이터 사용)
export const fetchRecentReplies = async (): Promise<RecentReply[]> => {
    try {
        const response = await axios.get(`${baseURL}/dashboard/recentcomments`);
        return response.data;
    } catch (error) {
        console.error("API 요청 오류:", error);
        return testRecentComments;
    }
};

// API 요청 함수 (차트 데이터) - 실패 시 더미 데이터 사용
export const fetchChartData = async (chartId: string): Promise<ChartConfig> => {
    try {
        const response = await axios.get(`${baseURL}/dashboard/charts/${chartId}`);
        return response.data;
    } catch (error) {
        console.error(`API 요청 오류 (차트 - ${chartId}):`, error);
        const fallbackData = testChartConfigs.find((chart) => chart.id === chartId);
        if (!fallbackData) {
            throw new Error(`더미 데이터가 정의되지 않은 차트 ID: ${chartId}`);
        }
        return fallbackData;
    }
};