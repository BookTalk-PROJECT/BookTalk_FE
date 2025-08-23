export interface GatheringPostRequest {
  //등록할때 사용=
  title: string;
  content: string;
  notification: boolean;
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
  notification: boolean;
}
