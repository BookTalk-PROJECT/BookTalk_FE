export interface Books {
  isbn: string | number; //책 ISBN
  name: string; // 책 이름
  order : number;
  complete_yn: number; // 모임 내부 독서 상태(예정, 진행중, 완료)
  startDate: string; // 시작 날짜
}

export interface SearchResult {
  id: string;
  title: string;
}

export interface Question {
  id: number;
  question: string;
}

// 모임 개설 데이터 타입
export interface GatheringCreateRequest {
  groupName: string;
  location: string;
  meetingDetails: string;
  recruitmentPersonnel: string;
  recruitmentPeriod: string;
  activityPeriod: string;
  books: Books[];
  questions: Question[];
  hashtags: string[];
}
