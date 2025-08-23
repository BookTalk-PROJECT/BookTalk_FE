import axios from "axios";
import { Books, bookInfo } from "../type/GatheringHeader.types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const examplebooks: Books[] = [
  { id: 1, title: "책이름1", author: "저자명", status: 1, date: "2023-02-24" },
  { id: 2, title: "책이름2", author: "저자명", status: 0, date: "2023-03-15" },
  { id: 3, title: "책이름3", author: "저자명", status: 1, date: "2023-04-01" },
];

export const exampleBookInfo: bookInfo = {
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
