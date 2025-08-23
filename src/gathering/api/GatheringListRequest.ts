import axios from "axios";
import { GatheringStatus } from "../../common/type/Status";
import { GatheringPost } from "../type/GatheringListPage.types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// export const mockGatheringPosts: GatheringPost[] = Array.from({ length: 100 }, (_, i) => {
//   // 임시 더미데이터
//   const statuses = [GatheringStatus.intended, GatheringStatus.progress, GatheringStatus.end] as const;
//   const status = statuses[Math.floor(Math.random() * statuses.length)];
//   return {
//     id: i + 1,
//     title: `독서모임 ${i + 1}`,
//     views: Math.floor(Math.random() * 1000),
//     currentMembers: Math.floor(Math.random() * 8) + 2,
//     maxMembers: 10,
//     status,
//     hashtags: ["#독서토론", "#자기계발", "#인문학", "#문학", "#심리학", "#철학"]
//       .sort(() => Math.random() - 0.5)
//       .slice(0, 3),
//     imageUrl: `https://readdy.ai/api/search-image?query=Cozy%20book%20club%20meeting%20space%20with%20comfortable%20seating%2C%20warm%20lighting%2C%20bookshelves%2C%20and%20a%20welcoming%20atmosphere%2C%20modern%20minimalist%20interior%20design%20with%20natural%20elements&width=400&height=250&seq=${i + 1}&orientation=landscape`,
//   };
// });

//테스트 용으로 작성된 모임 게시글 목록을 가져오는 함수
// export const fetchMockGatheringPosts = (
//   statusFilter: string,
//   searchQuery: string,
//   pageNum: number,
//   postsPerPage: number
// ) => {
//   let filtered = mockGatheringPosts;
//   if (statusFilter !== "전체") {
//     filtered = filtered.filter((post) => post.status === statusFilter);
//   }
//   if (searchQuery) {
//     filtered = filtered.filter((post) => post.title.includes(searchQuery));
//   }
//   return filtered.slice((pageNum - 1) * postsPerPage, pageNum * postsPerPage);
// };

const statusLabelMap: Record<string, string | null> = {
  전체: null,
  모집중: "INTENDED",
  진행중: "PROGRESS",
  완료: "END",
};

export const fetchMockGatheringPosts = async (
  statusFilter: string,
  searchQuery: string,
  pageNum: number,
  postsPerPage: number
): Promise<GatheringPost[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gathering/list`, {
      params: {
        page: pageNum,
        size: postsPerPage,
        status: statusLabelMap[statusFilter],
        search: searchQuery || null,
      },
    });
    return response.data?.data?.content || []; // 또는 response.data, 구조에 따라
  } catch (error) {
    console.error("모임 리스트 불러오기 실패", error);
    return [];
  }
};