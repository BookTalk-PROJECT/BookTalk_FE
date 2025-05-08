import React, { useState, useEffect, useMemo } from "react";
import MyPageSideBar from "../common/component/MyPageSideBar";
import Pagenation from "../common/component/Pagination";
import MyPageTable from "../common/component/MyPageTable";
import { bookPostMockData, MyPageBoardType } from "../common/type/MyPageBoardTable";
import MyPageBreadCrumb from "../common/component/MyPageBreadCrumb";

const MyPageCommunityBoard: React.FC = () => {
  {/* 선택된 검색 필터*/}
  const [selectedFilter, setSelectedFilter] = useState("제목");
  {/* 검색어 */}
  const [searchTerm, setSearchTerm] = useState("");
  {/* 정렬 기준 컬럼 */}
  const [sortField, setSortField] = useState<keyof MyPageBoardType>("date");
  {/* 오름차순, 내림차순 */}
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filterOption: { label: string; key: keyof MyPageBoardType }[] = [
    { label: "아이디", key: "id" },
    { label: "제목", key: "title" },
    { label: "분류", key: "category" },
    { label: "날짜", key: "date" },
    { label: "상태", key: "status" },
  ];
  {/* 컬럼 갯수 */}
  const colCount = 5;

  {/* 테이블 행 데이터 정렬 후 출력 값 */}
  const filteredAndSortedPosts = useMemo(() => {
    // 1. 검색 필터 적용
    const filtered = bookPostMockData.filter((post) => {
      const targetValue = (() => {
        switch (selectedFilter) {
          case "제목":
            return post.title;
          case "게시글 번호":
            return String(post.id); // 숫자는 문자열로 변환해서 비교
          case "분류":
            return post.category;
          case "작성 일시":
            return post.date;
          default:
            return "";
        }
      })();

      return targetValue.includes(searchTerm);
    });

    // 2. 정렬 적용
    return [...filtered].sort((a, b) => {
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
  }, [sortField, sortOrder, searchTerm, selectedFilter]);

  {/* 정렬 필드 설정 함수 */}
  const handleSort = (field: keyof MyPageBoardType) => {
    if (sortField === field) {
      //이미 해당 필드일 시 정렬만 해줌
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      //현재 정렬 필드와 다른 필드일시 셋 해주고 오름차순
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderHeader = () => (
    <>
      {filterOption.map(({ label, key }) => (
        <div key={key} onClick={() => handleSort(key)}>
           <span className="inline-block items-center gap-2 mr-2">
                       {sortField === key ? (
                         sortOrder === "asc" ? (
                           <i className="fas fa-sort-up"></i>
                         ) : (
                           <i className="fas fa-sort-down"></i>
                         )
                       ) : (
                         <i className="fas fa-sort text-gray-300"></i>
                       )}
                            </span>
          {label}</div>
      ))}
    </>
  );

  const renderRow = (post: MyPageBoardType) => (
    <div key={post.id} className="grid grid-cols-5 py-4 px-4 border-b border-gray-200 hover:bg-gray-50">
      <div>{post.id}</div>
      <div>{post.title}</div>
      <div>{post.category}</div>
      <div>{post.date}</div>
      <div>
        <button className="text-green-500 hover:text-green-700 mr-2">수정</button>
        <span className="text-gray-500">┆</span>
        <button className="text-red-500 hover:text-red-700 ml-2">삭제</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* 사이드바 */}
      <MyPageSideBar />
      {/* 메인 컨텐츠 */}
      <div className="flex-1 ml-60 bg-white rounded-lg shadow-md">
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* 브레드크럼 */}
            <MyPageBreadCrumb major="커뮤니티" sub="게시글 관리" />
            {/* 테이블 */}
            <MyPageTable
              posts={filteredAndSortedPosts}
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
            <Pagenation totalPages={10} loadPageByPageNum={() => {}}/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPageCommunityBoard;
