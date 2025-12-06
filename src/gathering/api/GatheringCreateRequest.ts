import axios from "axios";
import { Question } from "../type/GatheringCreatePage.types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// 기본 질문
export const mockQuestions: Question[] = [
  { id: 1, question: "모임을 가입하려는 이유가 뭔가요?" },
  { id: 2, question: "어떤 장르를 좋아하시나요?" },
  { id: 3, question: "특별히 좋아하는 책이 있으신가요?" },
];

export const createGathering = async (formData: FormData) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(`${API_BASE_URL}/gathering/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("모임 생성 실패:", error);
    throw error;
  }
};
