import axios from "axios";
import { Category, CommuPostRequest } from "../type/boardList";
import { PostInfo } from "../../../common/component/Board/type/BoardDetail.types";

const BASE_URL = import.meta.env.VITE_API_URL;

/*Hello 데이터 받아오기*/
export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(`${BASE_URL}/community/category/list`);
  return response.data;
};

export const getPosts = async (categoryId:number, pageNum:number): Promise<PostInfo[]> => {
    const posts = await axios.get<PostInfo[]>(`${BASE_URL}/community/board/list?categoryId=${categoryId}&pageNum=${pageNum}`);
  return new Promise((resolve) => resolve(posts.data));
};
