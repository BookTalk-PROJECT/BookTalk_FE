import axios from "axios";
import { Books, bookInfo } from "../type/GatheringHeader.types";

// API 키 및 기본 URL 설정
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const examplebooks: Books[] = [
  { id: 1, title: "책이름1", author: "저자명", status: 1, startDate: "2023-02-24", endDate: "2023-03-01" },
  { id: 2, title: "책이름2", author: "저자명", status: 0, startDate: "2023-03-15", endDate: "2023-03-22" },
  { id: 3, title: "책이름3", author: "저자명", status: 1, startDate: "2023-04-01" },
];

export const exampleBookInfo: bookInfo = {
  gatheringName: "즐거운 독서 모임",
  totalMembers: 8,
  completeBooks: 3,
  weeklyDay: "목요일",
};

// 책 목록 API 요청 함수
export const fetchGatheringBooks = async (gatheringId: string): Promise<Books[]> => {
  const response = await axios.get<Books[]>(`${API_BASE_URL}/gatheringlist/${gatheringId}/books`);
  return response.data;
};

// 모임 정보 API 요청 함수
export const fetchGatheringInfo = async (gatheringId: string): Promise<bookInfo> => {
  const response = await axios.get<bookInfo>(`${API_BASE_URL}/gatheringlist/${gatheringId}/info`);
  return response.data;
};
