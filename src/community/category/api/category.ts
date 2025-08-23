import axios from "axios";
import { AdminCategoryT, CreateCategoryT } from "../type/category";

const BASE_URL = import.meta.env.VITE_API_URL;

export const createCategory = async (value: string, pCategoryId?:number, ): Promise<ApiResponse<number>> => {
    const response = await axios.post(`${BASE_URL}/community/category/create`, 
        {
            value: value, 
            pCategoryId: pCategoryId
        });
    return response.data;
}

export const getCategories = async (): Promise<ApiResponse<AdminCategoryT>> => {
    const response = await axios.get(`${BASE_URL}/community/category/list`);
    return response.data;
}