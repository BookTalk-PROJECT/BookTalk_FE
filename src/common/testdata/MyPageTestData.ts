import { MyPageBoardType, MyPageGatheringBoardType, MyPageMyGatheringType } from "../type/MyPageBoardTable";

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