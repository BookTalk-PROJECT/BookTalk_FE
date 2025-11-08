
export type GatheringStatus = "INTENDED" | "PROGRESS" | "END";

export interface GatheringDetailResponse {
  code: string;
  name: string;
  recruitmentPersonnel: number;
  recruitmentPeriod: string;
  activityPeriod: string;
  emdCd?: string | null;
  sigCd?: string | null;
  imageUrl?: string | null;
  summary: string;
  status: GatheringStatus;
  books: {
    isbn: string;
    name: string;
    order: number;
    completeYn: boolean | number;
    startDate: string;
    endDate?: string | null;
  }[];
  questions: { id: number; question: string; order?: number }[];
  hashtags: string[];
  location?: string | null;
}