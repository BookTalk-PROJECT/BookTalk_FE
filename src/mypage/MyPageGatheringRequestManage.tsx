import React, { useState, useEffect, useMemo } from "react";
import MyPageSideBar from "../common/component/MyPageSideBar";
import Pagenation from "../common/component/Pagination";
import MyPageTable from "../common/component/MyPageTable";
import {
  MyPageMyGatheringType,
} from "../common/type/MyPageBoardTable";
import MyPageBreadCrumb from "../common/component/MyPageBreadCrumb";
import { gatheringBoardPostMockData, myGatheringPostMockData } from "../common/testdata/MyPageTestData";

const MyPageGatheringRequest: React.FC = () => {
  {/* 선택된 검색 필터*/}
  const [selectedFilter, setSelectedFilter] = useState("모임명");
  {/* 검색어 */}
  const [searchTerm, setSearchTerm] = useState("");
  {/* 정렬 기준 컬럼 */}
  const [sortField, setSortField] = useState<keyof MyPageMyGatheringType>("date");
  {/* 오름차순, 내림차순 */}
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filterOption: { label: string; key: keyof MyPageMyGatheringType }[] = [
    { label: "게시물 번호", key: "id" },
    { label: "모임명", key:"gathering"},
    { label: "분류", key:"category"},
    { label: "신청 일시", key: "date" },
    { label: "상태", key:"status"},
  ];
  {/* 컬럼 갯수 */}
  const colCount = 5;

  {/* 테이블 행 데이터 정렬 후 출력 값 */}
  const filteredAndSortedPosts = useMemo(() => {
    // 1. 검색 필터 적용
    const filtered = myGatheringPostMockData.filter((post) => {
      const targetValue = (() => {
        switch (selectedFilter) {
          case "모임명":
            return post.gathering;
          case "게시글 번호":
            return String(post.id); // 숫자는 문자열로 변환해서 비교
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
  const handleSort = (field: keyof MyPageMyGatheringType) => {
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
    <tr>
      {filterOption.map(({ label, key }) => (
        <th
          key={key}
          onClick={() => handleSort(key)}
          className="px-4 py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap cursor-pointer"
        >
        <span className="inline-flex items-center gap-1">
          <span>{label}</span>
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
        </th>
      ))}
      <th
        key="manage"
        onClick={() => handleSort("manage")}
        className="px-4 py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap cursor-pointer"
      ><span>관리</span></th>
    </tr>
  );

  const renderRow = (post: MyPageMyGatheringType) => (
    <tr key={post.id} className="hover:bg-gray-50 border-b">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.gathering}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.category}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.date}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.status}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-xs rounded mr-2">신청 철회</button>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* 사이드바 */}
      <MyPageSideBar />
      {/* 메인 컨텐츠 */}
      <div className="ml-60 flex-1 flex flex-col bg-white rounded-lg shadow-md">
        <main>
          <div className="w-full max-w-none mx-auto">
            {/* 브레드크럼 */}
            <MyPageBreadCrumb major="모임" sub="모임 신청 관리" />
            {/* 테이블 */}
            <MyPageTable
              posts={filteredAndSortedPosts}
              filterOptions={["", "게시글 번호", "분류", "작성 일시"]}
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

export default MyPageGatheringRequest;
