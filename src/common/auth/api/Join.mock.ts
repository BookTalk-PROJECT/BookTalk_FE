import { Member, ValidationEmail } from "../type/type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const createMember = async (joinData: Member) => {
  try {
    const response = await axios.post(`${baseURL}/member/create`, joinData);
    return response.statusText;
  } catch (error) {
    console.error(`회원가입 API 요청 오류-${error}`);
    return "회원가입 요청 실패";
  }
};

export const validationEmail = async (email: ValidationEmail) => {
  try {
    const response = await axios.post(`${baseURL}/member/validation`, email);
    return response.data.data.isExistMember;
  } catch (error) {
    console.error(`아이디 중복검사 API 요청 오류-${error}`);
    return "아이디 중복검사 요청 실패";
  }
};
