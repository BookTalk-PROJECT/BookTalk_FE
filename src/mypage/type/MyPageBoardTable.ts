import React from "react";

export interface MyPageTableProps<T> {
  posts: T[];
  row: { label: string; key: string}[];
  isExpandableRow: boolean;
  filterOptions: { label: string; key: string}[];
  initialFilter: { label: string; key: string}[];
  manageOption: React.ReactNode;
  postKeys: string[];
  activeTab?: string;
}

export interface MyPageTableCommonColType {
  id: number;
  date: string;
  manage: string;
}

export interface MyPageBoardType extends MyPageTableCommonColType {
  title: string;
  category: string;
}

export interface MyPageBookCommentType extends MyPageTableCommonColType{
  title: string;
  author: string;
  content: string;
}

export interface MyPageGatheringBoardType extends MyPageTableCommonColType{
  title: string;
  gathering:string;
}

export interface MyPageMyGatheringType extends MyPageTableCommonColType{
  category: string,
  status:string,
  gathering:string;
}

export interface MyPageGatheringRequestManageType extends MyPageMyGatheringType{
  questions:GatheringRequestQuestion[]
}

export interface GatheringRequestQuestion {
  question: string,
  answer: string,
}

export interface AdminBoardType extends MyPageBoardType {
  deleteReason: string;
  author: string;
}

export interface AdminCommentType extends MyPageBookCommentType {
  deleteReason: string;
  category: string;
}




