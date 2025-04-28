export interface Books {
    id: number;
    name: string;
    startDate: string;
    status: "planned" | "in_progress" | "completed";
}

export interface SearchResult {
    id: string;
    title: string;
}

export interface Question {
    id: number;
    text: string;
}

// 모임 신청 데이터 타입
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
