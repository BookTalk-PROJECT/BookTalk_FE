export interface MyPageCommonPost {
  id: number;
  title: string;
  category: string;
  date: string;
  status: string;
}

export interface MyPageCommment extends MyPageCommonPost{
  content: string;
}

export type TablePageType = 'Book_Board' | 'Book_Comment';

export interface BookPostType {
  id: number;
  title: string;
  category: string;
  date: string;
  status: string;
}

export const bookPostMockData: BookPostType[] = [
  { id: 167, title: "하하웃어", category: "IT", date: "2025-03-27", status: "수정" },
  { id: 35, title: "반갑습니다", category: "예술", date: "2025-03-26", status: "수정" },
  { id: 7, title: "그런일은", category: "소설", date: "2025-03-24", status: "수정" },
];

export interface BookCommentType {
  id: number;
  title: string;
  author: string;
  category: string;
  content: string;
  date: string;
}
