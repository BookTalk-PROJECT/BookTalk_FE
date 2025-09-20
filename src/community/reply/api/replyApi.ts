import axios from "axios";
import { ReplyRequest } from "../type/reply";
import { ApiResponse } from "../../../common/type/ApiResponse";

const BASE_URL = import.meta.env.VITE_API_URL;

// 댓글 등록 (부모 댓글 & 대댓글)
export const postReply = async (req: ReplyRequest): Promise<ApiResponse<string>> => {
  const response = await axios.post<Promise<ApiResponse<string>>>(`${BASE_URL}/reply/create`, req);
  return response.data;
};

export const editReply = async (replyCode: string, content: string): Promise<ApiResponse<string>> => {
  const response = await axios.patch<ApiResponse<string>>(`${BASE_URL}/reply/modify`, {replyCode: replyCode, content: content});
  return response.data;
};

export const deleteReply = async (replyCode: string): Promise<ApiResponse<string>> => {
  const response = await axios.delete<ApiResponse<string>>(`${BASE_URL}/reply/delete/${replyCode}`);
  return response.data;
};