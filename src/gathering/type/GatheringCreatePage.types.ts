export interface Books {
    id: number;  //책 ISBN
    name: string;  // 책 이름
    startDate: string; // 시작일(등록일)
    status: "planned" | "in_progress" | "completed"; // 모임 내부 독서 상태(예정, 진행중, 완료)
}

export interface SearchResult {
    id: string;
    title: string;
}

export interface Question {
    id: number;
    text: string;
}

// 모임 개설 데이터 타입
export interface GatheringCreateRequest {
    groupName: string;
    location: string;
    meetingFormat: string;
    meetingDetails: string;
    recruitmentPeriod: string;
    activityPeriod: string;
    books: Books[];
    questions: Question[];
    hashtags: string[];
}
