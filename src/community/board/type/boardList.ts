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

export interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  categoryId: number;
}
