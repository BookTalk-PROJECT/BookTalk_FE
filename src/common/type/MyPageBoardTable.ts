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




