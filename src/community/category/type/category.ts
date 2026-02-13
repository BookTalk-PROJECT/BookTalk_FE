export interface AdminCategoryT {
  categoryId: number;
  value: string;
  isActive: boolean;
  isEditing: boolean;
  isExpanded: boolean;
  displayOrder: number;
  subCategories: AdminSubCategoryT[];
}

export interface AdminSubCategoryT {
  categoryId: number;
  value: string;
  isActive: boolean;
  isEditing: boolean;
  isExpanded: boolean;
  displayOrder: number;
}

export interface CreateCategoryT {
  pCategoryId?: number;
  value: string;
  displayOrder?: number;
}
