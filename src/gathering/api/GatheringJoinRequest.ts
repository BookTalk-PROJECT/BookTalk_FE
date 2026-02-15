import axios, { AxiosError } from "axios";
import { JoinAnswer, RecruitQuestion } from "../type/GatheringJoin.types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * 모임 가입 신청 질문 목록 조회
 * @param gatheringId - 모임 ID
 * @returns 가입 신청 질문 목록
 * @throws {Error} API 요청 실패 시 에러
 */
export const getRecruitQuestions = async (gatheringId: string): Promise<RecruitQuestion[]> => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/gathering/${gatheringId}/recruitQuestions`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 백엔드 ResponseDto 구조 처리
    const payload = Array.isArray(res.data) ? res.data : res.data?.data ?? [];

    // 프론트엔드에서 사용하기 위한 표준화
    const questions: RecruitQuestion[] = payload.map((q: any, index: number) => ({
      id: q.id ?? q.recruit_question ?? index + 1,
      question: q.content ?? q.question ?? "",
      required: q.required ?? true,
      maxLength: q.maxLength ?? 300,
    }));

    return questions;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.msg || "가입 질문을 불러오는데 실패했습니다.";
      throw new Error(errorMessage);
    }
    throw new Error("가입 질문 조회 중 오류가 발생했습니다.");
  }
};

/**
 * 모임 가입 신청 제출
 * @param gatheringId - 모임 ID
 * @param answers - 질문에 대한 답변 목록
 * @returns API 응답 데이터
 * @throws {Error} API 요청 실패 시 에러
 */
export const submitJoinRequest = async (gatheringId: string, answers: JoinAnswer[]) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const res = await axios.post(
      `${API_BASE_URL}/gathering/${gatheringId}/recruitRequest`,
      { answers },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.msg || "모임 가입 신청에 실패했습니다.";
      throw new Error(errorMessage);
    }
    throw new Error("모임 가입 신청 중 오류가 발생했습니다.");
  }
};
