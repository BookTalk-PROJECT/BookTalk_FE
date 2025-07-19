export interface Books {
  id: number;
  title: string;
  author: string;
  status: 0 | 1;
  startDate: string;
  endDate?: string;
}

export interface bookInfo {
  gatheringName: string;
  totalMembers: number;
  completeBooks: number;
  weeklyDay: string;
}
