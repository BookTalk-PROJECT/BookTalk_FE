import axios from "axios";
import { ReplyRequest } from "../type/reply";

const BASE_URL = import.meta.env.VITE_API_URL;

export const editReply = async (replyCode: string, content: string): Promise<ApiResponse<null>> => {
  const response = await axios.patch<ApiResponse<null>>(`${BASE_URL}/reply/modify`, {replyCode: replyCode, content: content});
  return response.data;
};

export const deleteReply = async (replyCode: string): Promise<ApiResponse<null>> => {
  const response = await axios.delete<ApiResponse<null>>(`${BASE_URL}/reply/delete/${replyCode}`);
  return response.data;
};