import {
  GatheringRequestQuestion,
  MyPageBoardType,
  MyPageGatheringBoardType, MyPageGatheringRequestManageType,
  MyPageMyGatheringType,
} from "../type/MyPageBoardTable";

export const bookPostMockData: MyPageBoardType[] = [
  { id: 167, title: "하하웃어", category: "IT", date: "2025-03-27", manage: "수정"},
  { id: 35, title: "반갑습니다", category: "예술", date: "2025-03-26", manage: "수정" },
  { id: 7, title: "그런일은", category: "소설", date: "2025-03-24", manage: "수정" },
];

export const gatheringBoardPostMockData: MyPageGatheringBoardType[] = [
  { id: 167, gathering: "좋은모임" ,title: "하하웃어",  date: "2025-03-27", manage: "수정" },
  { id: 35, gathering: "나쁜모임", title: "반갑습니다",  date: "2025-03-26", manage: "수정" },
  { id: 7, gathering: "이상한모임", title: "그런일은",  date: "2025-03-24", manage: "수정" },
];


export const myGatheringPostMockData: MyPageMyGatheringType[] = [
  { id: 167, gathering: "좋은모임" ,category: "IT",  date: "2025-03-27", status: "종료" , manage:"수정"},
  { id: 35, gathering: "나쁜모임", category: "IT",  date: "2025-03-26", status: "종료" , manage:"수정" },
  { id: 37, gathering: "이상한모임", category: "예술",  date: "2025-03-21", status: "종료" , manage:"수정" },
  { id: 56, gathering: "행복한모임", category: "그런일은",  date: "2025-03-21", status: "진행중" , manage:"수정" },
  { id: 66, gathering: "망한모임", category: "소설",  date: "2025-03-12", status: "모집중" , manage:"수정"},
  { id: 32, gathering: "냄새나는모임", category: "예술",  date: "2025-03-06", status: "진행중" , manage:"수정" },
];

// 질문 샘플
const gatheringSampleQuestions: GatheringRequestQuestion[] = [
  {
    question: "어떻게 책을 소개할건가요?",
    answer: "나를 책으로만 안 사람도 없답니다!!",
  },
  {
    question: "짬깐아 아빠를 속일 수 있니?",
    answer: "못 속여요 ㅎㅎ",
  },
  {
    question: "이 모임을 신청하게된 계기가 있습니까?",
    answer: "여자 친구와 함께 읽고 싶습니다.",
  },
  {
    question: "이런 모임을 가져본 적이 있나요?",
    answer: "없습니다요",
  },
  {
    question: "개인적으로 활동중인 책이 있나요?",
    answer: "작년 책, 셋 있어요!",
  },
];

// 모임 신청 샘플 데이터
export const myGatheringRequestMockData: MyPageGatheringRequestManageType[] = [
  {
    id: 1,
    gathering: "그린빈즈",
    category: "소설",
    date: "2025-03-24",
    status: "승인 대기",
    questions: gatheringSampleQuestions,
    manage:""
  },
  {
    id: 2,
    gathering: "공부할때 먹으면 좋은 간식 추천",
    category: "IT",
    date: "2025-03-23",
    status: "승인 대기",
    questions: gatheringSampleQuestions.slice(0, 2),
    manage:""
  },
  {
    id: 3,
    gathering: "이거 읽으면 이제 뭐 읽으면 좋을까요?",
    category: "예술",
    date: "2025-03-22",
    status: "승인 대기",
    questions: gatheringSampleQuestions.slice(1, 4),
    manage:""
  },
];
