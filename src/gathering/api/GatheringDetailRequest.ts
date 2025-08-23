import axios from "axios";
import { Post } from "../../common/type/BoardTable";

const API_BASE_URL = import.meta.env.BASE_URL;

export const posts: Post[] = [
  // 게시글 더미
  { id: 35, title: "독서모임 후기 35", date: "2023-02-24", author: "이름님 0", views: 385 },
  { id: 34, title: "독서모임 후기 34", date: "2023-02-20", author: "이름님 4", views: 374 },
  { id: 33, title: "독서모임 후기 33", date: "2023-02-21", author: "이름님 3", views: 363 },
  { id: 32, title: "독서모임 후기 32", date: "2023-02-22", author: "이름님 2", views: 352 },
  { id: 31, title: "독서모임 후기 31", date: "2023-02-23", author: "이름님 1", views: 341 },
  { id: 30, title: "독서모임 후기 30", date: "2023-02-24", author: "이름님 0", views: 330 },
  { id: 29, title: "독서모임 후기 29", date: "2023-02-20", author: "이름님 4", views: 319 },
  { id: 28, title: "독서모임 후기 28", date: "2023-02-21", author: "이름님 3", views: 308 },
  { id: 27, title: "독서모임 후기 27", date: "2023-02-22", author: "이름님 2", views: 297 },
  { id: 26, title: "독서모임 후기 26", date: "2023-02-23", author: "이름님 1", views: 286 },
  { id: 25, title: "독서모임 후기 25", date: "2023-02-24", author: "이름님 0", views: 275 },
  { id: 24, title: "독서모임 후기 24", date: "2023-02-20", author: "이름님 4", views: 264 },
  { id: 23, title: "독서모임 후기 23", date: "2023-02-21", author: "이름님 3", views: 253 },
  { id: 22, title: "독서모임 후기 22", date: "2023-02-22", author: "이름님 2", views: 242 },
  { id: 21, title: "독서모임 후기 21", date: "2023-02-23", author: "이름님 1", views: 231 },
  { id: 20, title: "독서모임 후기 20", date: "2023-02-24", author: "이름님 0", views: 220 },
  { id: 19, title: "독서모임 후기 19", date: "2023-02-20", author: "이름님 4", views: 209 },
  { id: 18, title: "독서모임 후기 18", date: "2023-02-21", author: "이름님 3", views: 198 },
  { id: 17, title: "독서모임 후기 17", date: "2023-02-22", author: "이름님 2", views: 187 },
  { id: 16, title: "독서모임 후기 16", date: "2023-02-23", author: "이름님 1", views: 176 },
  { id: 15, title: "독서모임 후기 15", date: "2023-02-24", author: "이름님 0", views: 165 },
  { id: 14, title: "독서모임 후기 14", date: "2023-02-20", author: "이름님 4", views: 154 },
  { id: 13, title: "독서모임 후기 13", date: "2023-02-21", author: "이름님 3", views: 143 },
  { id: 12, title: "독서모임 후기 12", date: "2023-02-22", author: "이름님 2", views: 132 },
  { id: 11, title: "독서모임 후기 11", date: "2023-02-23", author: "이름님 1", views: 121 },
  { id: 10, title: "독서모임 후기 10", date: "2023-02-24", author: "이름님 0", views: 110 },
  { id: 9, title: "독서모임 후기 9", date: "2023-02-20", author: "이름님 4", views: 99 },
  { id: 8, title: "독서모임 후기 8", date: "2023-02-21", author: "이름님 3", views: 88 },
  { id: 7, title: "독서모임 후기 7", date: "2023-02-22", author: "이름님 2", views: 77 },
  { id: 6, title: "독서모임 후기 6", date: "2023-02-23", author: "이름님 1", views: 66 },
  { id: 5, title: "독서모임 후기 5", date: "2023-02-24", author: "이름님 0", views: 55 },
  { id: 4, title: "독서모임 후기 4", date: "2023-02-20", author: "이름님 4", views: 44 },
  { id: 3, title: "독서모임 후기 3", date: "2023-02-21", author: "이름님 3", views: 33 },
  { id: 2, title: "독서모임 후기 2", date: "2023-02-22", author: "이름님 2", views: 22 },
  { id: 1, title: "독서모임 후기 1", date: "2023-02-23", author: "이름님 1", views: 11 },
];

// 모임 게시글 리스트API
export const fetchGatheringBoardList = async (postId: string): Promise<Post[]> => {
  console.log(" 모임 번호: " + postId + " 이거 게시글 리스트 가져온다이?");

  // 실제 API 요청으로 변경할 경우
  const response = await axios.get(`${API_BASE_URL}/gatheringboard/${postId}`, {});
  return response.data;
};
