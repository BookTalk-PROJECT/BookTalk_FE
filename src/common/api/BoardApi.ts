import axios from "axios";
import { ImageUploadRes } from "../component/Board/type/BoardDetailTypes";

const BASE_URL = import.meta.env.VITE_API_URL;

export const uploadImage = async (formData: FormData): Promise<ImageUploadRes> => {
  const response = await axios.post<ImageUploadRes>(`${BASE_URL}/upload-image`, formData);
  return response.data;
};
