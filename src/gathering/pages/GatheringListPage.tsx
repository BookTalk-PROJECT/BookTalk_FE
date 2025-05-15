import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ButtonWrapper from "../../common/component/Button";
import { GatheringPost } from "../type/GatheringListPage.types";
import GatheringCard from "../component/GatheringCard";
import CustomButton from "../../common/component/CustomButton";
import { fetchMockGatheringPosts } from "../api/GatheringListRequest";

const GatheringListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [isFooterHovered, setIsFooterHovered] = useState(false);
  const [posts, setPosts] = useState<GatheringPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const POSTS_PER_PAGE = 9;

  const loadMorePosts = () => {
    if (loading || !hasMore) return;
    setLoading(true);

    setTimeout(() => {
      const newPosts = fetchMockGatheringPosts(statusFilter, searchQuery, page, POSTS_PER_PAGE);
      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(newPosts.length === POSTS_PER_PAGE);
      setLoading(false);
      setPage((prev) => prev + 1);
    }, 400);
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [statusFilter]);

  useEffect(() => {
    if (page === 1) {
      loadMorePosts();
    }
  }, [page]);

  const handleSearch = () => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  };

  useEffect(() => {
    if (!lastPostElementRef.current) return;

    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const currentObserver = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        loadMorePosts();
      }
    }, options);

    currentObserver.observe(lastPostElementRef.current);

    return () => currentObserver.disconnect();
  }, [posts, loading, hasMore]);

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 mb-[280px]">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-2">독서모임</h2>
          <p className="text-center text-gray-600 mb-8">함께 읽고 나누는 독서의 즐거움</p>

          <div className="flex items-center justify-between mb-8 border-b border-gray-300 pb-2">
            {/* 왼쪽: 탭 필터 */}
            <div className="flex items-center gap-6">
              <div className="flex space-x-6">
                {["전체", "모집중", "진행중", "완료"].map((label) => (
                  <button
                    key={label}
                    onClick={() => setStatusFilter(label)}
                    className={`pb-2 text-sm font-medium transition-all duration-200 ${statusFilter === label ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 오른쪽: 모임 개설 버튼 + 검색창 */}
            <div className="flex items-center gap-4">
              <CustomButton onClick={() => navigate("/gatheringlist/create")} color="black">
                <>
                  모임 개설
                </>
              </CustomButton>

              <div className="flex items-center gap-0">
                {/* 드롭다운 - 검색 기준 선택 */}
                <select
                  className="border border-gray-300 py-2 px-4 text-sm text-gray-700 rounded-l-full focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                  defaultValue="전체">
                  <option value="전체">카테고리</option>
                  <option value="모임이름">모임이름</option>
                  <option value="닉네임">닉네임(모임장)</option>
                </select>

                {/* 검색 입력창 */}
                <div className="relative w-full">
                  {/* 검색 입력창 */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="border border-l-0 border-gray-300 py-2 px-4 pr-12 text-sm text-gray-700 rounded-r-full focus:outline-none focus:ring-2 focus:ring-red-300 w-full"
                    placeholder="검색어를 입력해주세요..."
                  />

                  {/* 검색 버튼 */}
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <CustomButton onClick={handleSearch} color="none">
                      <i className="fas fa-search" />
                    </CustomButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 모임 카드 생성부 */}
            {posts.map((gathering, index) => (
              <GatheringCard
                key={gathering.id}
                gathering={gathering}
                lastRef={index === posts.length - 1 ? lastPostElementRef : undefined}
              />
            ))}
          </div>

          {loading && (
            <div className="flex justify-center items-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          )}

          {!hasMore && !loading && (
            <div className="text-center text-gray-500 mt-8 text-sm">더 이상 모임을 찾을 수 없습니다.</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default GatheringListPage;
