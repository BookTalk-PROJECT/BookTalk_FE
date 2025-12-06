import { Memberboard } from "../type/role";
import axios from "axios";
import { ApiResponse } from "../../common/type/ApiResponse";
import { MyPageMemberDataType } from "../../mypage/type/MyPageTable";

const baseURL = import.meta.env.VITE_API_URL;

export const getAllMember = async (): Promise<ApiResponse<Memberboard[]>> => {
  const response = await axios.get<ApiResponse<Memberboard[]>>(`${baseURL}/member/list`);
  return response.data;
};
