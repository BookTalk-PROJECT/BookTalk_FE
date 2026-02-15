import { Question } from "../type/GatheringCreatePage.types";

/**
 * 모임 가입 신청 시 사용되는 기본 질문 목록
 */
export const DEFAULT_RECRUIT_QUESTIONS: Question[] = [
  { id: 1, question: "모임을 가입하려는 이유가 뭔가요?" },
  { id: 2, question: "어떤 장르를 좋아하시나요?" },
  { id: 3, question: "특별히 좋아하는 책이 있으신가요?" },
];
