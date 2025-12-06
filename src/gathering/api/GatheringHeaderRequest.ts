import axios from "axios";
import { Books, GatheringDetailResponse, bookInfo } from "../type/GatheringHeader.types";
import { ResponseDto } from "../../common/auth/type/ResponseDto";

// API 키 및 기본 URL 설정
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const examplebooks: Books[] = [
  { id: 1, title: "책이름1", status: 1, startDate: "2023-02-24", endDate: "2023-03-01" },
  { id: 2, title: "책이름2", status: 0, startDate: "2023-03-15", endDate: "2023-03-22" },
  { id: 3, title: "책이름3", status: 1, startDate: "2023-04-01" },
];

export const exampleBookInfo: GatheringDetailResponse = {
  gatheringCode: "GA_EXAMPLE",
  name: "예시 모임",
  status: 0,
  recruitmentPersonnel: 10,
  recruitmentPeriod: "2025-10 ~ 2025-12",
  activityPeriod: "2026-01 ~ 2026-03",
  emdCd: "예시읍면동",
  sigCd: "예시행정구역",
  summary: "예시 설명",
  masterYn: 1,
  delYn: false,
  delReason: null,
};

// 책 목록
export const fetchGatheringBooks = async (gatheringId: string): Promise<Books[]> => {
  const res = await axios.get<ResponseDto<Books[]>>(`${API_BASE_URL}/gathering/${gatheringId}/books`);
  return res.data.data;
};

export const fetchGatheringInfo = async (gatheringId: string): Promise<GatheringDetailResponse> => {
  const token = localStorage.getItem("accessToken"); // 로그인 시 저장된 JWT
  const res = await axios.get<ResponseDto<GatheringDetailResponse>>(
    `${API_BASE_URL}/gathering/detail/${gatheringId}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined // 비로그인 접근 허용이면 헤더 없이도 호출 가능
  );
  return res.data.data;
};

export const deleteGathering = async (code: string, reason: string) => {
  const token = localStorage.getItem("accessToken");
  await axios.post(
    `${API_BASE_URL}/gathering/${code}/delete`,
    { reason },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
