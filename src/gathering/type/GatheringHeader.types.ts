export interface Books {
  id: number;
  title: string;
  status: 0 | 1;
  startDate: string;
  endDate?: string;
}
export interface bookInfo {
  gatheringName: string;
  totalMembers: number;
  completeBooks: number;
}

// 백엔드 GatheringDetailResponse와 1:1 매칭 (imageUrl 제외)
export interface GatheringDetailResponse {
  gatheringCode: string;
  name: string;
  status: number;
  recruitmentPersonnel: number;
  recruitmentPeriod: string;
  activityPeriod: string;
  emdCd: string;
  sigCd: string;
  summary: string;
  delYn: boolean;
  delReason: string | null;
  masterYn: number; // 1: 개설자, 0: 일반/비회원
}