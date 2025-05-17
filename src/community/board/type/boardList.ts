export interface GatheringPostRequest {
  //등록할때 사용
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
}
export interface BoardCategories {
  hello: string;
}

export interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
}

export interface CommuPostRequest extends GatheringPostRequest {
  categoryId: number;
}
