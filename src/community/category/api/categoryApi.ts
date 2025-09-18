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
    const response = await axios.get(`${BASE_URL}/community/category/list`);
    return response.data;
}

export const createCategory = async (value: string, pCategoryId?:number, ): Promise<ApiResponse<number>> => {
    const response = await axios.post(`${BASE_URL}/community/category/create`, 
        {
            value: value, 
            pCategoryId: pCategoryId
        });
    return response.data;
}