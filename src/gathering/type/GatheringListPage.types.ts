export interface GatheringPost {
  id: number;
  title: string;
  views: number;
  currentMembers: number;
  maxMembers: number;
  status: "모집중" | "진행중" | "완료";
  hashtags: string[];
  imageUrl: string;
}
