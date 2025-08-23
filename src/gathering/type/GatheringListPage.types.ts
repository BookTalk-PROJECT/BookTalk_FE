import { GatheringStatus } from "../../common/type/Status";

// export interface GatheringPost {
//   id: number;
//   title: string;
//   views: number;
//   currentMembers: number;
//   maxMembers: number;
//   hashtags: string[];
//   imageUrl: string;
//   status: GatheringStatus;
// }

export interface GatheringPost {
  code: string;
  title: string;
  views: number;
  currentMembers: number;
  maxMembers: number;
  status: {
    type: "INTENDED" | "PROGRESS" | "END"; // enum 그대로 반영
    name: string; // 예: 모집중
  };
  imageUrl: string;
  hashtags: string[];
}
