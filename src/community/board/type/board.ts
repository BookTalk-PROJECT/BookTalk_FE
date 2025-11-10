
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


