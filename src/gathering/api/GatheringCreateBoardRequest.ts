import axios from "axios";
import { CommuPostRequest } from "../../common/component/Board/type/BoardDetailTypes";

const API_BASE_URL = import.meta.env.VITE_API_URL;

type ResponseDto<T = any> = {
  code: number;
  data?: T;
};

// 모임 게시글 등록 api
export const gatheringCreatePost = async (
  gatheringCode: string,
  postData: CommuPostRequest
): Promise<ResponseDto> => {
  const payload = {
    gatheringCode,                 // 서버 CreateGatheringBoardCommand에 맞춰
    title: postData.title,
    content: postData.content,
    notification_yn: postData.notification_yn ?? false,
  };

  const res = await axios.post(`${API_BASE_URL}/gathering/board/create`, payload);

  // const res = await axios.post(`${API_BASE_URL}/gathering/create`, payload);

  return res.data;
};
