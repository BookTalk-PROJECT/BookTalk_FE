import React, { useEffect, useMemo, useState } from "react";
import MyPageSideBar from "../common/component/MyPageSideBar";

import { BookCommentType } from "../common/type/MyPageBoardTable";
import MyPageTable from "../common/component/MyPageTable";
import MyPageBreadCrumb from "../common/component/MyPageBreadCrumb";
import Pagenation from "../common/component/Pagination";

const MyPageBookReviewComment: React.FC = () => {
  const [comments, setComments] = useState<BookCommentType[]>([]);
  const [activeTab, setActiveTab] = useState("커뮤니티");
  const [searchType, setSearchType] = useState("내용");
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState<keyof BookCommentType>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const colCount = 6;

  useEffect(() => {
    const categories = ["커뮤니티", "북리뷰", "모임"];
    const authors = ["책사랑", "독서광", "모임장", "코딩러버", "취미왕"];
    const titles = ["독서 토론", "신간 리뷰", "코딩 스터디", "문화 이야기"];
    const contents = ["좋은 책 추천합니다", "함께 공부해요", "모임 참여하세요"];
    const generateDate = (index: number) => {
      const date = new Date("2025-04-19");
      date.setDate(date.getDate() - index);
      return date.toISOString().split("T")[0];
    };

    const data: BookCommentType[] = Array.from({ length: 50 }, (_, i) => ({
      id: 1000 - i,
      title: `${titles[i % titles.length]} ${i + 1}`,
      author: authors[i % authors.length],
      content: contents[i % contents.length],
      category: categories[i % categories.length],
      date: generateDate(i),
    }));

    setComments(data);
  }, []);

  const handleSort = (field: keyof BookCommentType) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filtered = useMemo(() => {
    let data = [...comments];
    if (activeTab !== "전체") {
      data = data.filter((c) => c.category === activeTab);
    }
    if (searchText) {
      data = data.filter((c) => {
        const target =
          searchType === "작성자" ? c.author :
            searchType === "글 제목" ? c.title :
              c.content;
        return target.includes(searchText);
      });
    }
    data.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortField === "date") {
        return sortOrder === "asc"
          ? new Date(aVal).getTime() - new Date(bVal).getTime()
          : new Date(bVal).getTime() - new Date(aVal).getTime();
      }
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return data;
  }, [comments, activeTab, searchType, searchText, sortField, sortOrder]);

  const paginatedComments = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderHeader = () => (
    <>
      <div onClick={() => handleSort("id")}>번호</div>
      <div onClick={() => handleSort("title")}>글 제목</div>
      <div onClick={() => handleSort("author")}>작성자</div>
      <div onClick={() => handleSort("content")}>내용</div>
      <div onClick={() => handleSort("date")}>작성일</div>
      <div onClick={() => handleSort("date")}>관리</div>
    </>
  );

  const renderRow = (comment: BookCommentType) => (
    <div key={comment.id} className="grid grid-cols-6 py-4 px-4 border-b border-gray-200 hover:bg-gray-50">
      <div>{comment.id}</div>
      <div>{comment.title}</div>
      <div>{comment.author}</div>
      <div>{comment.content}</div>
      <div>{comment.date}</div>
      <div>
        <button className="text-green-600 hover:underline">수정</button>
        <button className="text-red-500 hover:underline">삭제</button>
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
            <MyPageBreadCrumb major = "북리뷰" sub = "댓글 관리"/>
            <MyPageTable
              posts={paginatedComments}
              filterOptions={["내용", "작성자", "글 제목"]}
              selectedFilter={searchType}
              onChangeFilter={setSearchType}
              searchTerm={searchText}
              onSearchTermChange={setSearchText}
              onSearchClick={() => setCurrentPage(1)}
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

export default MyPageBookReviewComment;
