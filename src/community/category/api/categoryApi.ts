import axios from "axios";
import { Category } from "../../board/type/board";
import { ApiResponse } from "../../../common/type/ApiResponse";
import { AdminCategoryT } from "../type/category";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  const response = await axios.get(`${BASE_URL}/community/category/list`);
  return response.data;
};

export const getAdminCategories = async (): Promise<ApiResponse<AdminCategoryT[]>> => {
  const response = await axios.get(`${BASE_URL}/community/category/admin/list/all`);
  return response.data;
};

export const createCategory = async (
  value: string,
  isActive: boolean,
  pCategoryId?: number,
  displayOrder?: number
): Promise<ApiResponse<number>> => {
  const response = await axios.post(`${BASE_URL}/community/category/create`, {
    value: value,
    pCategoryId: pCategoryId,
    isActive: isActive,
    displayOrder: displayOrder,
  });
  return response.data;
};

export const editCategory = async (
  categoryId: number,
  value: string,
  isActive: boolean,
  displayOrder?: number
): Promise<ApiResponse<number>> => {
  const response = await axios.patch(`${BASE_URL}/community/category/modify`, {
    categoryId: categoryId,
    value: value,
    isActive: isActive,
    displayOrder: displayOrder,
  });
  return response.data;
};

export const deleteCategory = async (categoryId: number): Promise<ApiResponse<number>> => {
  const response = await axios.delete(`${BASE_URL}/community/category/delete/${categoryId}`);
  return response.data;
};

export interface ReorderItem {
  categoryId: number;
  displayOrder: number;
}

export const reorderCategories = async (orders: ReorderItem[]): Promise<ApiResponse<void>> => {
  const response = await axios.patch(`${BASE_URL}/community/category/reorder`, {
    orders,
  });
  return response.data;
};
