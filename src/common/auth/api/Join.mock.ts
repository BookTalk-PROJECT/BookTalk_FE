import { Join } from "../type/type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const fetchJoin = async (joinData: Join) => {
    try{
      const response = await axios.post(`${baseURL}/member/create`,joinData);
      return response.statusText
    }catch (error){
      console.error(`회원가입 API 요청 오류-${error}`)
      return "회원가입 요청 실패";
    }
}