import axios from "axios";
import { Books, GatheringCreateRequest, Question, SearchResult } from "../type/GatheringCreatePage.types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

//추가된 책 테스트용
export const mockBooks: Books[] = [
  // {
  //     id: 1,
  //     name: "테스트용 책1",
  //     startDate: "2025-04-01",
  //     status: "planned",
  // },
  // {
  //     id: 2,
  //     name: "테스트용 책2",
  //     startDate: "2025-04-10",
  //     status: "in_progress",
  // },
];

// 모임 개설 페이지의 책 추가 모달에서 리스트 출력 테스트용용
// 추후 API를 뽑은 데이터가 여기로 들어가야함
export const mockSearchResults: SearchResult[] = [
  { id: "101", title: "프론트엔드 마스터"},
  { id: "102", title: "백엔드 초격차" },
];

// 기본 질문
export const mockQuestions: Question[] = [
  { id: 1, question: "어떤 책을 좋아하세요?" },
  { id: 2, question: "아빠를 속인거야?" },
  { id: 3, question: "저를 속인거에요?" },
];

// 모임 생성 요청 함수
// export const createGathering = async (gatheringData: GatheringCreateRequest) => {
//   try {
//     //console.log(API_BASE_URL+" 이거 머고? ");
//     const response = await axios.post(`${API_BASE_URL}/gathering/create`, gatheringData, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("모임 생성 실패:", error);
//     throw error; // 에러는 다시 던져서 호출한 쪽에서 처리
//   }
// };

export const createGathering = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/gathering/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("모임 생성 실패:", error);
    throw error;
  }
};