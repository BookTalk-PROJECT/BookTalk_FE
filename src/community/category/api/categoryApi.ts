import axiosInstance from "../../../common/auth/config/tokenInterceptor";
import { Category } from "../../board/type/board";
import { ApiResponse } from "../../../common/type/ApiResponse";
import { AdminCategoryT } from "../type/category";
import { is } from "date-fns/locale";

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  const response = await axiosInstance.get(`/community/category/list`);
  return response.data;
};

export const getAdminCategories = async (): Promise<ApiResponse<AdminCategoryT[]>> => {
    const response = await axiosInstance.get(`/community/category/admin/list/all`);
    return response.data;
}

export const createCategory = async (value: string, isActive: boolean, pCategoryId?:number): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.post(`/community/category/create`, 
        {
            value: value, 
            pCategoryId: pCategoryId,
            isActive: isActive
        });
    return response.data;
}

export const editCategory = async (categoryId: number, value: string, isActive: boolean): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.patch(`/community/category/modify`, 
        {
            categoryId: categoryId,
            value: value, 
            isActive: isActive
        });
    return response.data;
}

export const deleteCategory = async (categoryId: number): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.delete(`/community/category/delete/${categoryId}`);
    return response.data;
}