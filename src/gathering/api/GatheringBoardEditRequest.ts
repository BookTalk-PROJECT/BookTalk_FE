import axios from "axios";
import { CommuPostRequest } from "../../common/component/Board/type/BoardDetailTypes";
import { ApiResponse } from "../../common/type/ApiResponse";

const BASE = import.meta.env.VITE_API_URL;

type UpdateGatheringBoardPayload = CommuPostRequest & {
  postCode: string;
  // 백엔드 커맨드에 맞춰서 gatheringCode가 필요하면 같이 보냄
  gatheringCode?: string;
};

export const editGatheringBoard = async (
  postCode: string,
  postData: CommuPostRequest,
  gatheringCode?: string
): Promise<ApiResponse<any>> => {
  const payload: UpdateGatheringBoardPayload = {
    postCode,
    ...postData,
    gatheringCode,
  };

  // 백엔드가 /modify를 PATCH로 받을 때
  const res = await axios.patch(`${BASE}/gathering/board/modify`, payload);
  return res.data;
};
