export interface GatheringPostRequest {
  //등록할때 사용=
  title: string;
  content: string;
  notification: boolean;
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

export interface CommuPostRequest {
  title: string;
  content: string;
  notification: boolean;
}
