import axios from "axios";
import { Category, CommuPost} from "../type/boardList";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/*Hello 데이터 받아오기*/
export const getCategories = async (): Promise<Category[]> => {
  //   const response = await axios.get<Category[]>(`${BASE_URL}/board/categories`);
  const categories = [
    {
      id: 2,
      name: "문학",
      subCategories: [
        { id: 4, name: "소설" },
        { id: 5, name: "시/에세이" },
      ],
    },
    {
      id: 6,
      name: "인문",
      subCategories: [
        { id: 8, name: "심리학" },
        { id: 9, name: "교육학" },
      ],
    },
    {
      id: 10,
      name: "사회과학",
      subCategories: [
        { id: 12, name: "경제학" },
        { id: 13, name: "정치학" },
      ],
    },
    {
      id: 14,
      name: "자연과학",
      subCategories: [
        { id: 16, name: "수학" },
        { id: 17, name: "물리학" },
      ],
    },
    {
      id: 8,
      name: "기술공학",
      subCategories: [
        { id: 20, name: "IT/컴퓨터" },
        { id: 21, name: "기계" },
      ],
    },
  ];
  return new Promise((resolve) => resolve(categories));
};

export const getPosts = async (): Promise<CommuPost[]> => {
  //   const response = await axios.get<Categories[]>(`${BASE_URL}/board/categories`);
  const posts = [
    { id: 2, title: "이달의 추천도서", author: "관리자", date: "2025-04-15", views: 187, categoryId: 4 },
    { id: 3, title: "독서토론 모임 안내", author: "관리자", date: "2025-04-14", views: 156, categoryId: 5 },
    { id: 4, title: "봄맞이 도서 할인전", author: "마케팅팀", date: "2025-04-13", views: 142, categoryId: 8 },
    { id: 5, title: "베스트셀러 순위", author: "김민수", date: "2025-04-12", views: 98, categoryId: 9 },
    {
      id: 6,
      title: "신간 리뷰: 미래과학의 전망",
      author: "박지훈",
      date: "2025-04-11",
      views: 76,
      categoryId: 12,
    },
    { id: 7, title: "도서 구매 후기", author: "이영희", date: "2025-04-10", views: 112, categoryId: 13 },
    { id: 8, title: "전자책 이용 안내", author: "최준호", date: "2025-04-09", views: 89, categoryId: 16 },
    { id: 9, title: "도서 반납 연장 문의", author: "정다은", date: "2025-04-08", views: 67, categoryId: 17 },
    { id: 10, title: "도서관 이용 안내", author: "홍길동", date: "2025-04-07", views: 201, categoryId: 20 },
  ];
  return new Promise((resolve) => resolve(posts));
};
