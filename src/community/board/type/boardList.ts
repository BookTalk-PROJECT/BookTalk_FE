import { Post } from "../../../common/component/BoardTable";

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

export interface CommuPost extends Post {
  categoryId: number;
}
