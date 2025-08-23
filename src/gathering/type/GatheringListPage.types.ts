import { GatheringStatus } from "../../common/type/Status";

export interface GatheringPost {
  id: number;
  title: string;
  views: number;
  currentMembers: number;
  maxMembers: number;
  hashtags: string[];
  imageUrl: string;
  status: GatheringStatus;
}
