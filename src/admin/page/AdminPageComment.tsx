// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from "react";
import MyPageSideBar from "../../common/component/MyPageSideBar";
import Pagenation from "../../common/component/Pagination";
const AdminPageComment: React.FC = () => {
  // 댓글 데이터 상태
  const [comments, setComments] = useState<any[]>([]);
  const [filteredComments, setFilteredComments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("커뮤니티");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchType, setSearchType] = useState<string>("내용");
  const [searchText, setSearchText] = useState<string>("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<string>("asc");
  // 초기 댓글 데이터 생성
  useEffect(() => {
    const categories = ["커뮤니티", "북리뷰", "모임"];
    const authors = [
      "책사랑",
      "독서광",
      "모임장",
      "코딩러버",
      "취미왕",
      "책벌레",
      "모임지기",
      "독서가",
      "문화인",
      "예술가",
    ];
    const titles = [
      "독서 토론",
      "신간 리뷰",
      "주말 모임",
      "코딩 스터디",
      "취미 공유",
      "베스트셀러",
      "정기 모임",
      "문화 이야기",
      "예술 감상",
      "도서 추천",
      "스터디 모집",
      "독서 모임",
      "작가와의 대화",
      "북 콘서트",
      "독서 캠페인",
    ];
    const contents = [
      "좋은 책 추천합니다",
      "함께 공부해요",
      "모임 참여하세요",
      "코딩 질문있어요",
      "취미 공유해요",
      "이번 달 신간",
      "정기 모임 공지",
      "문화 행사 안내",
      "예술 작품 감상",
      "도서 리뷰입니다",
    ];
    const deleteReasons = [
      "커뮤니티 규정 위반",
      "스팸 활동 감지",
      "욕설 포함",
      "중복 게시물",
      "광고성 내용",
      "저작권 침해",
      "개인정보 노출",
      "규정 위반",
      "부적절한 홍보",
      "불건전 콘텐츠",
    ];

    const generateDate = (index: number) => {
      const date = new Date("2025-04-19");
      date.setDate(date.getDate() - index);
      return date.toISOString().split("T")[0];
    };

    const commentsData = Array.from({ length: 100 }, (_, index) => ({
      id: 1000 - index,
      title: `${titles[index % titles.length]} ${Math.floor(index / titles.length) + 1}`,
      author: authors[index % authors.length],
      category: categories[index % categories.length],
      content: contents[index % contents.length],
      writer: authors[index % authors.length],
      date: generateDate(index),
      deleteReason: `${deleteReasons[index % deleteReasons.length]}: ${index + 1}번째 사유`,
    }));

    setComments(commentsData);
    filterComments(commentsData, activeTab);
  }, []);
  // 댓글 필터링 함수
  const filterComments = (data: any[], tab: string, page: number = 1) => {
    let filtered = [...data];
    // 탭 필터링
    if (tab !== "전체") {
      filtered = filtered.filter((comment) => comment.category === tab);
    }
    // 검색 필터링
    if (searchText) {
      filtered = filtered.filter((comment) => {
        if (searchType === "내용") {
          return comment.content.includes(searchText);
        } else if (searchType === "작성자") {
          return comment.author.includes(searchText);
        } else if (searchType === "글 제목") {
          return comment.title.includes(searchText);
        }
        return true;
      });
    }
    // 정렬
    if (sortField) {
      filtered.sort((a, b) => {
        if (a[sortField] < b[sortField]) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (a[sortField] > b[sortField]) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    setFilteredComments(filtered);
  };
  // 탭 변경 핸들러
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    filterComments(comments, tab, 1);
  };
  // 정렬 핸들러
  const handleSort = (field: string) => {
    const direction = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredComments].sort((a, b) => {
      if (a[field] < b[field]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredComments(sorted);
  };
  // 검색 핸들러
  const handleSearch = () => {
    filterComments(comments, activeTab, 1);
  };
  // 페이지당 항목 수
  const itemsPerPage = 10;
  // 현재 페이지의 댓글
  const currentComments = filteredComments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  // 전체 페이지 수
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // 복구 핸들러
  const handleRestore = (id: number) => {
    alert(`댓글 ID ${id}가 복구되었습니다.`);
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="fixed top-6 left-0 w-60 h-full bg-blue-600 text-white p-6 space-y-8">
        <MyPageSideBar />
      </div>

      <div className="flex-1 ml-60 bg-white rounded-lg shadow-md">
        {/* 브레드크럼 네비게이션 */}
        <div className="p-6 border-b border-gray-200">
          <div className="text-lg font-medium text-gray-700">관리자 &gt; 댓글 관리</div>
        </div>
        {/* 필터 및 검색 영역 */}
        <div className="p-6 flex flex-wrap justify-between items-center">
          <div className="flex space-x-2 mb-4 sm:mb-0">
            <button
              onClick={() => handleTabChange("커뮤니티")}
              className={`!rounded-button whitespace-nowrap px-4 py-2 text-sm font-medium cursor-pointer ${activeTab === "커뮤니티" ? "bg-green-500 text-white" : "bg-green-100 text-green-800"}`}>
              커뮤니티
            </button>
            <button
              onClick={() => handleTabChange("북리뷰")}
              className={`!rounded-button whitespace-nowrap px-4 py-2 text-sm font-medium cursor-pointer ${activeTab === "북리뷰" ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-800"}`}>
              북리뷰
            </button>
            <button
              onClick={() => handleTabChange("모임")}
              className={`!rounded-button whitespace-nowrap px-4 py-2 text-sm font-medium cursor-pointer ${activeTab === "모임" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800"}`}>
              모임
            </button>
          </div>
          <div className="flex w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i className="fas fa-filter text-gray-400"></i>
              </div>
              <select
                className="block w-full pl-4 pr-3 py-2 text-sm border border-gray-300 rounded-l-lg bg-gray-100 focus:outline-none"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}>
                <option value="내용">내용</option>
                <option value="작성자">작성자</option>
                <option value="글 제목">글 제목</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="flex-1 sm:flex-none border-y border-gray-300 py-2 px-4 text-sm focus:outline-none"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="!rounded-button whitespace-nowrap bg-gray-800 text-white px-4 py-2 text-sm font-medium rounded-r-lg cursor-pointer hover:bg-gray-700">
              검색
            </button>
          </div>
        </div>
        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("id")}>
                  <div className="flex items-center">
                    <span>번호</span>
                    <span className="ml-1">
                      {sortField === "id" ? (
                        sortDirection === "asc" ? (
                          <i className="fas fa-sort-up"></i>
                        ) : (
                          <i className="fas fa-sort-down"></i>
                        )
                      ) : (
                        <i className="fas fa-sort text-gray-300"></i>
                      )}
                    </span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("title")}>
                  <div className="flex items-center">
                    <span>글 제목</span>
                    <span className="ml-1">
                      {sortField === "title" ? (
                        sortDirection === "asc" ? (
                          <i className="fas fa-sort-up"></i>
                        ) : (
                          <i className="fas fa-sort-down"></i>
                        )
                      ) : (
                        <i className="fas fa-sort text-gray-300"></i>
                      )}
                    </span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("author")}>
                  <div className="flex items-center">
                    <span>작성자</span>
                    <span className="ml-1">
                      {sortField === "author" ? (
                        sortDirection === "asc" ? (
                          <i className="fas fa-sort-up"></i>
                        ) : (
                          <i className="fas fa-sort-down"></i>
                        )
                      ) : (
                        <i className="fas fa-sort text-gray-300"></i>
                      )}
                    </span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("content")}>
                  <div className="flex items-center">
                    <span>내용</span>
                    <span className="ml-1">
                      {sortField === "content" ? (
                        sortDirection === "asc" ? (
                          <i className="fas fa-sort-up"></i>
                        ) : (
                          <i className="fas fa-sort-down"></i>
                        )
                      ) : (
                        <i className="fas fa-sort text-gray-300"></i>
                      )}
                    </span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}>
                  <div className="flex items-center">
                    <span>작성 일시</span>
                    <span className="ml-1">
                      {sortField === "date" ? (
                        sortDirection === "asc" ? (
                          <i className="fas fa-sort-up"></i>
                        ) : (
                          <i className="fas fa-sort-down"></i>
                        )
                      ) : (
                        <i className="fas fa-sort text-gray-300"></i>
                      )}
                    </span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentComments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.content}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRestore(comment.id)}
                        className="!rounded-button whitespace-nowrap bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 text-xs rounded cursor-pointer">
                        복구
                      </button>
                      <div className="relative group">
                        {/* 정보 아이콘 (i 모양) */}
                        <div className="w-4 h-4 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                          i
                        </div>

                        {/* 툴팁 (아이콘에 hover 시 나타날 내용) */}
                        <div className="absolute z-10 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg left-6 top-0">
                          <p>삭제 사유: {comment.deleteReason}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {currentComments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* 페이지네이션 */}
        <Pagenation totalPages={10} loadPageByPageNum={() => {}} ></Pagenation>
      </div>
    </div>
  );
};
export default AdminPageComment;
