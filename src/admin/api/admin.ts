import axios from "axios";
import { ApiResponse, PageResponse } from "../../common/type/ApiResponse";
import { PostSimpleInfo, ReplySimpleInfo } from "../../common/component/Board/type/BoardDetail.types";
import { SearchCondition } from "../../community/board/type/board";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getBoardAdminAll = async (pageNum: number): Promise<ApiResponse<PageResponse<PostSimpleInfo>>> => {
  const response = await axios.get<ApiResponse<PageResponse<PostSimpleInfo>>>(`${BASE_URL}/community/board/admin/all?pageNum=${pageNum}`);
  return response.data;
}

export const searchBoardAdminAll = async (req: SearchCondition, pageNum: number): Promise<ApiResponse<PageResponse<PostSimpleInfo>>> => {
  const response = await axios.post<ApiResponse<PageResponse<PostSimpleInfo>>>(`${BASE_URL}/community/board/admin/search?pageNum=${pageNum}`, req);
  return response.data;
}

export const restrictBoard = async (boardCode: string, del_reason: string): Promise<ApiResponse<string>> => {
  const response = await axios.patch<Promise<ApiResponse<string>>>(`${BASE_URL}/community/board/restrict`, {targetCode: boardCode, delReason: del_reason});
  return response.data;
}

export const recoverBoard = async (boardCode: string): Promise<ApiResponse<string>> => {
  const response = await axios.patch<Promise<ApiResponse<string>>>(`${BASE_URL}/community/board/recover/${boardCode}`);
  return response.data;
}

export const getCommentAdminAll = async (pageNum: number): Promise<ApiResponse<PageResponse<ReplySimpleInfo>>> => {
  const response = await axios.get<ApiResponse<PageResponse<ReplySimpleInfo>>>(`${BASE_URL}/reply/admin/all?pageNum=${pageNum}`);
  return response.data;
}

export const searchCommentAdminAll = async (req: SearchCondition, pageNum: number): Promise<ApiResponse<PageResponse<ReplySimpleInfo>>> => {
  const response = await axios.post<ApiResponse<PageResponse<ReplySimpleInfo>>>(`${BASE_URL}/reply/admin/search?pageNum=${pageNum}`, req);
  return response.data;
}

export const restrictComment = async (boardCode: string, del_reason: string): Promise<ApiResponse<string>> => {
  const response = await axios.patch<Promise<ApiResponse<string>>>(`${BASE_URL}/reply/restrict`, {targetCode: boardCode, delReason: del_reason});
  return response.data;
}

export const recoverComment = async (boardCode: string): Promise<ApiResponse<string>> => {
  const response = await axios.patch<Promise<ApiResponse<string>>>(`${BASE_URL}/reply/recover/${boardCode}`);
  return response.data;
}
