import axios from "axios";
import { JoinAnswer, RecruitQuestion } from "../type/GatheringJoin.types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const sampleQuestions: RecruitQuestion[] = [
  { id: 1, question: "이 모임에 가입하고자 하는 이유는 무엇인가요????", required: true, maxLength: 300 },
  {
    id: 2,
    question: "최근에 읽은 책 중 가장 인상 깊었던 책은 무엇이며, 그 이유는 무엇인가요?",
    required: true,
    maxLength: 500,
  },
  { id: 3, question: "일주일에 독서에 할애할 수 있는 시간은 얼마나 되나요?", required: false, maxLength: 200 },
  { id: 4, question: "본인이 선호하는 책 장르는 무엇인가요? (여러 장르 선택 가능)", required: true, maxLength: 300 },
  {
    id: 5,
    question: "모임에서 진행하고 싶은 활동이나 제안이 있다면 자유롭게 작성해주세요.",
    required: true,
    maxLength: 500,
  },
];

export const GetRecruitQuestion = async (gatheringId: string): Promise<RecruitQuestion[]> => {
  console.log(`모임 ${gatheringId}번 질문목록 가져온데이?`);

  // (선택) 인증이 필요한 경우 토큰 헤더 첨부
  const token = localStorage.getItem("accessToken");
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;

  const res = await axios.get(`${API_BASE_URL}/gathering/${gatheringId}/recruitQuestions`, config);

  // 백엔드가 배열을 그대로 주는 경우와 ResponseDto로 감싼 경우 모두 처리
  const payload = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);

  // 프론트에서 사용하기 위한 표준화 (required/maxLength는 기본값 유지)
  const serverQuestions: RecruitQuestion[] = payload.map((q: any, index: number) => ({
    id: q.id ?? q.recruit_question ?? index + 1,
    question: q.content ?? q.question ?? "",
    required: q.required ?? true,
    maxLength: q.maxLength ?? 300,
  }));

  return serverQuestions;
};

// POST: 모임 가입 신청 API
export const GatheringJoinRequest = async (gatheringId: string, answers: JoinAnswer[]) => {
  const token = localStorage.getItem("accessToken");
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;

  return (
    await axios.post(
      `${API_BASE_URL}/gathering/${gatheringId}/recruitRequest`,
      { answers }, // { answers: [{questionId, answer}, ...] }
      config
    )
  ).data;
};
