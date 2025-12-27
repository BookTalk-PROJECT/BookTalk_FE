import axios from "axios";
import { Post } from "../../common/type/BoardTable";

const API_BASE_URL = import.meta.env.VITE_API_URL;

type PageResponseDto<T> = {
  content: T[];
  totalPages: number;
};

type ResponseDto<T> = {
  code: number;
  data: T;
};

// 더미 없음
export const fetchGatheringBoardList = async (
  gatheringId: string,
  pageNum: number = 1,
  pageSize: number = 10
): Promise<PageResponseDto<Post>> => {
  // 병합한 컨트롤러가 실제로 쓰는 경로로 맞추면 됨
  // 예: GET /gathering/list/{gatheringCode}?pageNum=1&pageSize=10
  const res = await axios.get<ResponseDto<PageResponseDto<Post>>>(
    `${API_BASE_URL}/gathering/board/list/${gatheringId}`,
    { params: { pageNum, pageSize } }
  );

  return res.data.data;
};