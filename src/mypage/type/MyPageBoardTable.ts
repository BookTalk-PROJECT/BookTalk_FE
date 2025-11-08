import React from "react";

export interface MyPageTableProps<T> {
  rows: any[];
  renderHeader: () => React.JSX.Element;
  renderSearchBar?: () => React.JSX.Element;
  renderRow: (row: any) => React.JSX.Element;
}

export interface MyPageTableCommonColType {
  date: string;
  manage: string;
  deleteReason: string;
}

export interface MyPageBoardType extends MyPageTableCommonColType {
  board_code: string;
  title: string;
  category: string;
  author: string;
}

export interface MyPageCommentType extends MyPageTableCommonColType {
  reply_code: string;
  post_code: string;
  title: string;
  author: string;
  content: string;
}

export interface MyPageGatheringBoardType extends MyPageTableCommonColType {
  title: string;
  gathering: string;
}

export interface MyPageMyGatheringType extends MyPageTableCommonColType {
  category: string;
  status: string;
  gathering: string;
}

export interface MyPageGatheringRequestManageType extends MyPageMyGatheringType {
  questions: GatheringRequestQuestion[];
}

export interface GatheringRequestQuestion {
  question: string;
  answer: string;
}

export interface AdminBoardType extends MyPageBoardType {
  deleteReason: string;
  author: string;
}

export interface AdminCommentType extends MyPageCommentType {
  deleteReason: string;
  category: string;
}

export interface MyPageMemberDataType {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  birth: string;
  gender: string;
  authType: string;
}

export interface MyPageModifyMemberDataType {
  phoneNumber: string;
  password: string;
  address: string;
}

export type RowDef<T> = {
  label: string; 
  key: keyof T, 
  isSortable: boolean , 
  isSearchType: boolean
}