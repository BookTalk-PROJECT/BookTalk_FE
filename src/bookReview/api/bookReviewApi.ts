import axios from "axios";
import { BookReview, BookReviewCreate, BookReviewDetail, BookReviewUpdate } from "../types/bookReview";
import { ApiResponse, PageResponse } from "../../common/type/ApiResponse";
import { SearchCondition } from "../../common/type/common"; // Import SearchCondition

const BASE_URL = import.meta.env.VITE_API_URL;

export const createBookReview = async (req: BookReviewCreate): Promise<ApiResponse<string>> => {
  const response = await axios.post<ApiResponse<string>>(`${BASE_URL}/book-reviews`, req);
  return response.data;
};

export const getBookReviewList = async (page: number, size: number): Promise<ApiResponse<PageResponse<BookReview>>> => {
  const response = await axios.get<ApiResponse<PageResponse<BookReview>>>(
    `${BASE_URL}/book-reviews?page=${page}&size=${size}`
  );
  return response.data;
};

export const searchBookReviews = async (
  cond: SearchCondition,
  page: number,
  size: number
): Promise<ApiResponse<PageResponse<BookReview>>> => {
  const response = await axios.post<ApiResponse<PageResponse<BookReview>>>(
    `${BASE_URL}/book-reviews/search?page=${page}&size=${size}`,
    cond
  );
  return response.data;
};

export const getBookReview = async (code: string): Promise<ApiResponse<BookReviewDetail>> => {
  const response = await axios.get<ApiResponse<BookReviewDetail>>(`${BASE_URL}/book-reviews/${code}`);
  return response.data;
};

export const updateBookReview = async (code: string, req: BookReviewUpdate): Promise<ApiResponse<void>> => {
  const response = await axios.put<ApiResponse<void>>(`${BASE_URL}/book-reviews/${code}`, req);
  return response.data;
};

export const deleteBookReview = async (code: string): Promise<ApiResponse<void>> => {
  const response = await axios.delete<ApiResponse<void>>(`${BASE_URL}/book-reviews/${code}`);
  return response.data;
};
