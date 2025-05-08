import React, { useEffect, useMemo, useState } from "react";
import MyPageSideBar from "../common/component/MyPageSideBar";
import { MyPageBoardType, MyPageBookCommentType } from "../common/type/MyPageBoardTable";
import MyPageTable from "../common/component/MyPageTable";
import MyPageBreadCrumb from "../common/component/MyPageBreadCrumb";
import Pagenation from "../common/component/Pagination";

const MyPageCommunityComment: React.FC = () => {
  const [comments, setComments] = useState<MyPageBookCommentType[]>([]);
  const [activeTab, setActiveTab] = useState("커뮤니티");
  const [searchType, setSearchType] = useState("내용");
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState<keyof MyPageBookCommentType>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const colCount = 7;

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

    const data: MyPageBookCommentType[] = Array.from({ length: 50 }, (_, i) => ({
      id: 1000 - i,
      title: `${titles[i % titles.length]} ${i + 1}`,
      author: authors[i % authors.length],
      content: contents[i % contents.length],
      manage: categories[i % categories.length],
      date: generateDate(i),
    }));

    setComments(data);
  }, []);

  const filterOption: { label: string; key: keyof MyPageBookCommentType }[] = [
    { label: "번호", key: "id" },
    { label: "글 제목", key: "title" },
    { label: "작성자", key: "author" },
    { label: "내용", key: "content" },
    { label: "작성일", key: "date" }
  ];

  const handleSort = (field: keyof MyPageBookCommentType) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filtered = useMemo(() => {
    let data = [...comments];

    if (searchText) {
      data = data.filter((c) => {
        const target = searchType === "작성자" ? c.author : searchType === "글 제목" ? c.title : c.content;
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
      return sortOrder === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
    return data;
  }, [comments, activeTab, searchType, searchText, sortField, sortOrder]);

  const paginatedComments = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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


  const renderRow = (comment: MyPageBookCommentType) => (
    <tr key={comment.id} className="hover:bg-gray-50 border-b">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comment.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.title}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.author}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.content}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.date}</td>
      <td>
        <button className="text-green-500 hover:text-green-700 mr-2">수정</button>
        <span className="text-gray-500">┆</span>
        <button className="text-red-500 hover:text-red-700 ml-2">삭제</button>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* 사이드바 */}
      <MyPageSideBar />
      {/* 메인 컨텐츠 */}
      <div className="flex-1 ml-60 bg-white rounded-lg shadow-md">
        <main>
          <div className="w-full max-w-none mx-auto">
            {/* 브레드크럼 */}
            <MyPageBreadCrumb major="커뮤니티" sub="댓글 관리" />
            {/* 테이블 */}
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
            <Pagenation totalPages={10} loadPageByPageNum={() => {}}/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPageCommunityComment;
