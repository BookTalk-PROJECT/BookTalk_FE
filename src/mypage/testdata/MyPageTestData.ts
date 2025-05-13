import {
  AdminBoardType,
  GatheringRequestQuestion,
  MyPageBoardType, MyPageBookCommentType,
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

export const myBookCommentMockData: MyPageBookCommentType[] = [
  {
    id: 101,
    title: "신간 리뷰",
    author: "책사랑",
    content: "좋은 책 추천합니다",
    date: "2025-04-19",
    manage: "수정",
  },
  {
    id: 102,
    title: "독서 토론",
    author: "독서광",
    content: "함께 공부해요",
    date: "2025-04-18",
    manage: "수정",
  },
  {
    id: 103,
    title: "코딩 스터디",
    author: "코딩러버",
    content: "모임 참여하세요",
    date: "2025-04-17",
    manage: "수정",
  },
  {
    id: 104,
    title: "문화 이야기",
    author: "취미왕",
    content: "재밌는 활동이었어요",
    date: "2025-04-16",
    manage: "수정",
  },
  {
    id: 105,
    title: "신간 리뷰",
    author: "모임장",
    content: "정보 공유해요",
    date: "2025-04-15",
    manage: "수정",
  },
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


export const adminBoardMockData: AdminBoardType[] = [
  {
    id: 1,
    title: "신간 리뷰",
    category: "커뮤니티",
    author: "책사랑",
    deleteReason: "스팸 활동 감지",
    date: "2025-03-25",
    manage: "삭제됨",
  },
  {
    id: 2,
    title: "문화 이야기",
    category: "커뮤니티",
    author: "문화인",
    deleteReason: "욕설 포함",
    date: "2025-03-24",
    manage: "삭제됨",
  },
  {
    id: 3,
    title: "코딩 스터디",
    category: "커뮤니티",
    author: "코딩러버",
    deleteReason: "광고성 내용",
    date: "2025-03-23",
    manage: "삭제됨",
  },
  {
    id: 4,
    title: "작가와의 대화",
    category: "모임",
    author: "책벌레",
    deleteReason: "저작권 침해",
    date: "2025-03-22",
    manage: "삭제됨",
  },
  {
    id: 5,
    title: "도서 추천",
    category: "커뮤니티",
    author: "독서광",
    deleteReason: "중복 게시물",
    date: "2025-03-21",
    manage: "삭제됨",
  },
  {
    id: 6,
    title: "정기 모임",
    category: "모임",
    author: "모임장",
    deleteReason: "개인정보 노출",
    date: "2025-03-20",
    manage: "삭제됨",
  },
  {
    id: 7,
    title: "취미 공유",
    category: "모임",
    author: "취미왕",
    deleteReason: "불건전 콘텐츠",
    date: "2025-03-19",
    manage: "삭제됨",
  },
  {
    id: 8,
    title: "독서 모임",
    category: "북리뷰",
    author: "독서가",
    deleteReason: "커뮤니티 규정 위반",
    date: "2025-03-18",
    manage: "삭제됨",
  },
  {
    id: 9,
    title: "주말 모임",
    category: "북리뷰",
    author: "모임지기",
    deleteReason: "규정 위반",
    date: "2025-03-17",
    manage: "삭제됨",
  },
  {
    id: 10,
    title: "베스트셀러",
    category: "커뮤니티",
    author: "예술가",
    deleteReason: "부적절한 홍보",
    date: "2025-03-16",
    manage: "삭제됨",
  },
];


