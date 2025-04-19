import React, { useState, useEffect } from "react";
import MyPageSideBar from "../common/component/MyPageSideBar";

interface Post {
  id: number;
  title: string;
  category: string;
  date: string;
  status: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

const MyPageBookReviewBoard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("제목");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const filterOptions = ["제목", "게시글 번호", "분류", "작성 일시"];
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 10,
    pageSize: 10,
  });
  const [sortField, setSortField] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchPosts = async () => {
    try {
      const mockPosts = [
        { id: 167, title: "하하웃어", category: "IT", date: "2025-03-27", status: "수정" },
        { id: 35, title: "반갑습니다", category: "예술", date: "2025-03-26", status: "수정" },
        { id: 7, title: "그런일은", category: "소설", date: "2025-03-24", status: "수정" },
      ];
      const sortedPosts = mockPosts.sort((a, b) => {
        if (sortField === "id") {
          return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
        } else if (sortField === "title") {
          return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (sortField === "category") {
          return sortOrder === "asc" ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category);
        } else {
          return sortOrder === "asc"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [pagination.currentPage, searchTerm, sortField, sortOrder]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <MyPageSideBar></MyPageSideBar>
      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">북리뷰 {">"} 게시글 관리</h2>
            </div>

            {/* 검색 및 필터 */}
            <div className="flex justify-end items-center gap-2 mb-6">
              <div className="relative">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="bg-white px-4 py-2 rounded-md shadow-sm flex items-center gap-2 !rounded-button whitespace-nowrap border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100">
                  <span>{selectedFilter}</span>
                  <i className={`fas fa-chevron-${isFilterDropdownOpen ? "up" : "down"} text-gray-500`}></i>{" "}
                  {/* 화살표 아이콘 추가 */}
                </button>
                {isFilterDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-md shadow-lg z-50">
                    <ul className="py-1">
                      {filterOptions.map((option) => (
                        <li
                          key={option}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedFilter(option);
                            setIsFilterDropdownOpen(false);
                          }}>
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="검색어를 입력하세요"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white" // 여기 추가
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => fetchPosts()}>
                검색
              </button>
            </div>

            {/* 게시글 목록 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-[100px_1fr_150px_150px_100px] bg-gray-50 py-3 px-4 border-b border-gray-200">
                <div
                  className="text-sm font-medium text-gray-500 cursor-pointer flex items-center gap-1"
                  onClick={() => handleSort("id")}>
                  게시글 번호
                  {sortField === "id" && <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"}`}></i>}
                </div>
                <div
                  className="text-sm font-medium text-gray-500 cursor-pointer flex items-center gap-1"
                  onClick={() => handleSort("title")}>
                  제목
                  {sortField === "title" && <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"}`}></i>}
                </div>
                <div
                  className="text-sm font-medium text-gray-500 cursor-pointer flex items-center gap-1"
                  onClick={() => handleSort("category")}>
                  분류
                  {sortField === "category" && <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"}`}></i>}
                </div>
                <div
                  className="text-sm font-medium text-gray-500 cursor-pointer flex items-center gap-1"
                  onClick={() => handleSort("date")}>
                  작성 일시
                  {sortField === "date" && <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"}`}></i>}
                </div>
                <div className="text-sm font-medium text-gray-500 text-center">관리</div>
              </div>

              {posts.map((post) => (
                <div
                  key={post.id}
                  className="grid grid-cols-[100px_1fr_150px_150px_100px] py-4 px-4 border-b border-gray-200 hover:bg-gray-50">
                  <div className="text-sm text-gray-900">{post.id}</div>
                  <div className="text-sm text-gray-900">{post.title}</div>
                  <div className="text-sm text-gray-500">{post.category}</div>
                  <div className="text-sm text-gray-500">{post.date}</div>
                  <div className="flex justify-center gap-2">
                    <button className="text-sm text-green-500 hover:text-green-700 !rounded-button whitespace-nowrap">
                      수정
                    </button>
                    <button className="text-sm text-red-500 hover:text-red-700 !rounded-button whitespace-nowrap">
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-6 gap-2">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 !rounded-button"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}>
                <i className="fas fa-chevron-left"></i>
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((num) => {
                  const current = pagination.currentPage;
                  return num === 1 || num === pagination.totalPages || (num >= current - 2 && num <= current + 2);
                })
                .map((num, index, array) => (
                  <React.Fragment key={num}>
                    {index > 0 && array[index - 1] !== num - 1 && <span className="w-8 text-center">...</span>}
                    <button
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${pagination.currentPage === num ? "bg-gray-800 text-white" : "text-gray-500 hover:bg-gray-100"} !rounded-button`}
                      onClick={() => handlePageChange(num)}>
                      {num}
                    </button>
                  </React.Fragment>
                ))}
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 !rounded-button"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPageBookReviewBoard;
