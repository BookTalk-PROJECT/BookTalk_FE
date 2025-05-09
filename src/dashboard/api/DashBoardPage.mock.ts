// src/mocks/mock.ts

import { BookClub, BookReview, CardData, recencyReply } from "../type/DashBoardPage.type";

// 카드 데이터
export const mockCardData: CardData[] = [
    {
        title: "활성화 모임",
        count: "256개",
        description: "다양한 주제의 독서 모임",
        icon: "fa-book-reader",
        iconBgColor: "bg-blue-100",
        iconTextColor: "text-blue-500",
        countColor: "text-blue-600",
    },
    {
        title: "신규 모임",
        count: "23개",
        description: "이번 주 새로 생긴 모임",
        icon: "fa-star",
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-500",
        countColor: "text-green-600",
    },
    {
        title: "추천 도서",
        count: "42권",
        description: "이달의 회원 추천 도서",
        icon: "fa-bookmark",
        iconBgColor: "bg-indigo-100",
        iconTextColor: "text-indigo-500",
        countColor: "text-indigo-600",
    },
    {
        title: "활발한 토론",
        count: "128개",
        description: "진행 중인 도서 토론",
        icon: "fa-comments",
        iconBgColor: "bg-pink-100",
        iconTextColor: "text-pink-500",
        countColor: "text-pink-600",
    },
];

// 모임 데이터
export const mockBookClubs: BookClub[] = [
    { id: "1", title: "현대 문학의 이해", createdAt: "2025-05-09", memberCount: 24 },
    { id: "2", title: "고전 소설 탐구", createdAt: "2025-05-08", memberCount: 18 },
    { id: "3", title: "과학 도서 클럽", createdAt: "2025-05-07", memberCount: 31 },
    { id: "4", title: "철학 독서 모임", createdAt: "2025-05-06", memberCount: 15 },
    { id: "5", title: "역사 탐험가들", createdAt: "2025-05-05", memberCount: 22 },
];

// 책 리뷰 데이터
export const mockBookReviews: BookReview[] = [
    {
        id: "1",
        title: "5월 독서 모임 일정 안내",
        content: "다음 주 토요일 오후 3시에 카페에서 만나요...",
        author: "김지민",
        commentCount: 12,
        likeCount: 24,
    },
    {
        id: "2",
        title: "소설 '데미안' 독후감",
        content: "헤르만 헤세의 대표작 데미안을 읽고...",
        author: "이서연",
        commentCount: 8,
        likeCount: 17,
    },
    {
        id: "3",
        title: "추천 도서: 사피엔스",
        content: "유발 하라리의 사피엔스는 인류의 역사를...",
        author: "박준호",
        commentCount: 15,
        likeCount: 32,
    },
    {
        id: "4",
        title: "독서 토론 방법론",
        content: "효과적인 독서 토론을 위한 방법을 공유합니다...",
        author: "최민지",
        commentCount: 7,
        likeCount: 19,
    },
    {
        id: "5",
        title: "신간 소개: 미래의 역사",
        content: "이번 달에 출간된 미래의 역사라는 책을...",
        author: "정다운",
        commentCount: 5,
        likeCount: 11,
    },
];

// 최근 댓글 데이터
export const mockDiscussions: recencyReply[] = [
    {
        id: "1",
        content: "정말 좋은 책 추천 감사합니다. 저도 읽어봐야겠어요!",
        author: "한소희",
        timestamp: "2025-05-09 14:23",
    },
    {
        id: "2",
        content: "다음 모임에서 이 책에 대해 더 자세히 이야기 나눠보고 싶네요.",
        author: "김태현",
        timestamp: "2025-05-09 11:45",
    },
    {
        id: "3",
        content: "저는 이 작가의 다른 작품도 읽어봤는데, 이 책이 가장 인상적이었어요.",
        author: "이지원",
        timestamp: "2025-05-08 18:32",
    },
    {
        id: "4",
        content: "토론 방법론 글 정말 유익했습니다. 다음 모임에서 적용해보겠습니다.",
        author: "박현우",
        timestamp: "2025-05-08 15:17",
    },
    {
        id: "5",
        content: "일정 변경 가능한가요? 그날 다른 약속이 있어서요.",
        author: "정민수",
        timestamp: "2025-05-07 20:05",
    },
];

// 차트 데이터
export const mockChartData = {
    userChartData: {
        labels: ["5/3", "5/4", "5/5", "5/6", "5/7", "5/8", "5/9"],
        values: [12, 15, 9, 23, 17, 28, 21],
    },
    postChartData: {
        labels: ["5/3", "5/4", "5/5", "5/6", "5/7", "5/8", "5/9"],
        values: [32, 45, 29, 53, 37, 48, 61],
    },
    commentChartData: {
        labels: ["5/3", "5/4", "5/5", "5/6", "5/7", "5/8", "5/9"],
        values: [78, 65, 89, 103, 87, 118, 91],
    },
    likeChartData: {
        labels: ["5/3", "5/4", "5/5", "5/6", "5/7", "5/8", "5/9"],
        values: [145, 132, 167, 189, 154, 201, 178],
    },
};
