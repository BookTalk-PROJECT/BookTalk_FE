import { GatheringStatus } from "../../common/type/Status";
import { GatheringPost } from "../type/GatheringListPage.types";

export const mockGatheringPosts: GatheringPost[] = Array.from({ length: 100 }, (_, i) => { // 임시 더미데이터
  const statuses = [GatheringStatus.intended, GatheringStatus.progress, GatheringStatus.end] as const;
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  return {
    id: i + 1,
    title: `독서모임 ${i + 1}`,
    views: Math.floor(Math.random() * 1000),
    currentMembers: Math.floor(Math.random() * 8) + 2,
    maxMembers: 10,
    status,
    hashtags: ["#독서토론", "#자기계발", "#인문학", "#문학", "#심리학", "#철학"].sort(() => Math.random() - 0.5).slice(0, 3),
    imageUrl: `https://readdy.ai/api/search-image?query=Cozy%20book%20club%20meeting%20space%20with%20comfortable%20seating%2C%20warm%20lighting%2C%20bookshelves%2C%20and%20a%20welcoming%20atmosphere%2C%20modern%20minimalist%20interior%20design%20with%20natural%20elements&width=400&height=250&seq=${i + 1}&orientation=landscape`,
  };
});

export const fetchMockGatheringPosts = (statusFilter: string, searchQuery: string, pageNum: number, postsPerPage: number) => {
  let filtered = mockGatheringPosts;
  if (statusFilter !== "전체") {
    filtered = filtered.filter(post => post.status === statusFilter);
  }
  if (searchQuery) {
    filtered = filtered.filter(post => post.title.includes(searchQuery));
  }
  return filtered.slice((pageNum - 1) * postsPerPage, pageNum * postsPerPage);
};
