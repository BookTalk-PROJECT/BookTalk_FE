import axios from "axios";
import { PostDetail, PostSimpleInfo } from "../../../common/component/Board/type/BoardDetailTypes";
import { CommuPostRequest } from "../../../common/component/Board/type/BoardDetailTypes";
import { SearchCondition } from "../../../common/type/common";
import { ApiResponse, PageResponse } from "../../../common/type/ApiResponse";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getBoards = async (
  categoryId: number,
  pageNum: number
): Promise<ApiResponse<PageResponse<PostSimpleInfo>>> => {
  const response = await axios.get<ApiResponse<PageResponse<PostSimpleInfo>>>(
    `${BASE_URL}/community/board/list?categoryId=${categoryId}&pageNum=${pageNum}`
  );
  return response.data;
};

export const getBoardDetail = async (postId: string): Promise<ApiResponse<PostDetail>> => {
  const response = await axios.get<ApiResponse<PostDetail>>(`${BASE_URL}/community/board/detail/${postId}`);
  return response.data;
};

export const queryNextBoardCode = async (postId: string, categoryId: string): Promise<ApiResponse<string>> => {
  const response = await axios.get<ApiResponse<string>>(
    `${BASE_URL}/community/board/query/next?boardCode=${postId}&categoryId=${categoryId}`
  );
  return response.data;
};

export const queryPrevBoardCode = async (postId: string, categoryId: string): Promise<ApiResponse<string>> => {
  const response = await axios.get<ApiResponse<string>>(
    `${BASE_URL}/community/board/query/prev?boardCode=${postId}&categoryId=${categoryId}`
  );
  return response.data;
};

export const searchBoards = async (
  req: SearchCondition,
  categoryId: number,
  pageNum: number
): Promise<ApiResponse<PageResponse<PostSimpleInfo>>> => {
  const response = await axios.post<ApiResponse<PageResponse<PostSimpleInfo>>>(
    `${BASE_URL}/community/board/list/search?categoryId=${categoryId}&pageNum=${pageNum}`,
    req
  );
  return response.data;
};

export const postBoard = async (req: CommuPostRequest, categoryId: string): Promise<ApiResponse<string>> => {
  const response = await axios.post<Promise<ApiResponse<string>>>(`${BASE_URL}/community/board/create`, {
    ...req,
    categoryId: categoryId,
  });
  return response.data;
};

export const editBoard = async (req: CommuPostRequest, postCode: string): Promise<ApiResponse<string>> => {
  const response = await axios.patch<Promise<ApiResponse<string>>>(`${BASE_URL}/community/board/modify`, {
    ...req,
    boardCode: postCode,
  });
  return response.data;
};

export const deleteBoard = async (postId: string): Promise<ApiResponse<string>> => {
  const response = await axios.delete<Promise<ApiResponse<string>>>(`${BASE_URL}/community/board/delete/${postId}`);
  return response.data;
};

// 좋아요 등록 (게시글)
export const setLikePost = async (postId: string): Promise<ApiResponse<string>> => {
  const response = await axios.post<ApiResponse<string>>(`${BASE_URL}/likes/set/${postId}`);
  return response.data;
};

// 좋아요 해제 (게시글)
export const resetLikePost = async (postId: string): Promise<ApiResponse<string>> => {
  const response = await axios.post<ApiResponse<string>>(`${BASE_URL}/likes/reset/${postId}`);
  return response.data;
};
