import React, {useState, useEffect, useMemo} from "react";
import MyPageSideBar from "../common/component/MyPageSideBar";
import Pagenation from "../common/component/Pagination";
import MyPageTable from "../common/component/MyPageTable";
import {bookPostMockData, BookPostType, TablePageType} from "../common/type/MyPageBoardTable";
import MyPageBreadCrumb from "../common/component/MyPageBreadCrumb";

const MyPageBookReviewBoard: React.FC = () => {

  const [selectedFilter, setSelectedFilter] = useState("제목");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof BookPostType>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const colCount = 5;

  const handleSort = (field: keyof BookPostType) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedPosts = useMemo(() => {
    return [...bookPostMockData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortField === "date") {
        return sortOrder === "asc"
            ? new Date(aValue).getTime() - new Date(bValue).getTime()
            : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortOrder === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
    });
  }, [sortField, sortOrder]);

  const renderHeader = () => (
      <>
        <div onClick={() => handleSort("id")}>게시글 번호</div>
        <div onClick={() => handleSort("title")}>제목</div>
        <div onClick={() => handleSort("category")}>분류</div>
        <div onClick={() => handleSort("date")}>작성일</div>
        <div onClick={() => handleSort("status")}>상태</div>
      </>
  );

  const renderRow = (post: BookPostType) => (
      <div
          key={post.id}
          className="grid grid-cols-5 py-4 px-4 border-b border-gray-200 hover:bg-gray-50"
      >
        <div>{post.id}</div>
        <div>{post.title}</div>
        <div>{post.category}</div>
        <div>{post.date}</div>
        <div className="flex justify-center gap-2">
          <button className="text-green-500 hover:text-green-700">수정</button>
          <button className="text-red-500 hover:text-red-700">삭제</button>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* 사이드바 */}
      <div className="fixed top-6 left-0 w-60 h-full bg-blue-600 text-white p-6 space-y-8">
        <MyPageSideBar />
      </div>
      {/* 메인 컨텐츠 */}
      <div className="flex-1 ml-60 bg-white rounded-lg shadow-md">
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
          <MyPageBreadCrumb major = "북리뷰" sub = "게시글 관리"/>
            <MyPageTable
                posts={sortedPosts}
                filterOptions={["제목", "게시글 번호", "분류", "작성 일시"]}
                selectedFilter={selectedFilter}
                onChangeFilter={setSelectedFilter}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onSearchClick={() => console.log("검색 실행:", selectedFilter, searchTerm)}
                renderHeader={renderHeader}
                renderRow={renderRow}
                colCount={colCount}
            />
            {/* 페이지네이션 */}
            <Pagenation totalPages={10} loadPageByPageNum={() => {}}></Pagenation>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPageBookReviewBoard;