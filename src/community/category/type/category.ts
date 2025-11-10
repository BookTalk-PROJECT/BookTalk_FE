export interface AdminCategoryT {
  categoryId: number;
  value: string;
  isActive: boolean;
  isEditing: boolean;
  isExpanded: boolean;
  subCategories: AdminSubCategoryT[];
}

export interface AdminSubCategoryT {
  categoryId: number;
  value: string;
  isActive: boolean;
  isEditing: boolean;
  isExpanded: boolean;
}

export interface CreateCategoryT {
    pCategoryId?: number;
    value: string;
}