import { PostDetail, PostDetailInfo } from "../../../common/component/Board/type/BoardDetail.types";

export interface CommuDetail extends PostDetailInfo {
  category_id: string;
}

export interface Category {
  categoryId: number;
  value: string;
  isActive: boolean;
  subCategories: SubCategory[];
}

export interface SubCategory {
  categoryId: number;
  value: string;
  isActive: boolean;
}

export interface CommuPostRequest {
  title: string;
  content: string;
  notification_yn?: boolean;
}

export type SearchType = "board_code" | "title" | "author" | "category";

export interface SearchCondition {
  keywordType: SearchType;
  keyword: string;
  startDate: string;
  endDate: string;
}
