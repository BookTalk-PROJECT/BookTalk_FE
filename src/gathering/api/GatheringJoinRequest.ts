import axios from "axios";
import { JoinAnswer, RecruitQuestion } from "../type/GatheringJoin.types";

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

// 모임 질문 정보보 API 요청 함수
export const GetRecruitQuestion = async (gatheringId: string): Promise<RecruitQuestion[]> => {
  console.log("모임 " + gatheringId + "번 질문목록 가져온데이? ");

  const response = await axios.get(`/api/gathering/${gatheringId}/recruitquestions`);

  const serverQuestions = response.data.map((q: any, index: number) => ({
    id: q.id || index + 1,
    question: q.content || q.question,
    required: true,
    maxLength: 300,
  }));
  return serverQuestions.data;
};

// POST: 모임 가입 신청 API
export const GatheringJoinRequest = async (gatheringId: string, answers: JoinAnswer[]) => {
  console.log("제출할 답변 목록 보낸다이? :", answers); // 콘솔 출력

  // 실제 요청
  const res = await axios.post(`/api/gathering/${gatheringId}/recruitrequest`, {
    answers: answers,
  });

  return res.data;
};
