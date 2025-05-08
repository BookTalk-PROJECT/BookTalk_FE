import React from "react";

export interface MyPageTableProps<T> {
  posts: T[];
  filterOptions: string[];
  selectedFilter: string;
  onChangeFilter: (val: string) => void;
  searchTerm: string;
  onSearchTermChange: (val: string) => void;
  onSearchClick: () => void;
  renderHeader: () => React.ReactNode;
  renderRow: (row: T) => React.ReactNode;
  colCount: number;
}

export interface MyPageTableCommonColType {
  id: number;
  title: string;
  category: string;
  date: string;
}

export interface MyPageBoardType extends MyPageTableCommonColType {
  status: string;
}

export interface MyPageBookCommentType extends MyPageTableCommonColType{
  author: string;
  category: string;
  content: string;
}

export interface MyPageGatheringBoardType extends MyPageTableCommonColType{
  gathering:string;
  manage: string;
}

export const bookPostMockData: MyPageBoardType[] = [
  { id: 167, title: "하하웃어", category: "IT", date: "2025-03-27", status: "수정" },
  { id: 35, title: "반갑습니다", category: "예술", date: "2025-03-26", status: "수정" },
  { id: 7, title: "그런일은", category: "소설", date: "2025-03-24", status: "수정" },
];

export const gatheringBoardPostMockData: MyPageGatheringBoardType[] = [
  { id: 167, gathering: "좋은모임" ,title: "하하웃어", category: "IT", date: "2025-03-27", manage: "수정" },
  { id: 35, gathering: "나쁜모임", title: "반갑습니다", category: "예술", date: "2025-03-26", manage: "수정" },
  { id: 7, gathering: "이상한모임", title: "그런일은", category: "소설", date: "2025-03-24", manage: "수정" },
];



