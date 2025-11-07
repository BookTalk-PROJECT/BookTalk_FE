import React, { useState, useEffect } from "react";
import MyPageSideBar from "../component/MyPageSideBar";
import Pagenation from "../../common/component/Pagination";
import MyPageTable from "../component/MyPageTable";
import MyPageBreadCrumb from "../component/MyPageBreadCrumb";
import { MyPageCommentType, RowDef } from "../type/MyPageBoardTable";
import { ReplySimpleInfo } from "../../common/component/Board/type/BoardDetail.types";
import { getMyCommentAll, searchMyComments } from "../api/MyPage";
import DeleteModal from "../component/DeleteModal";
import { Link } from "react-router-dom";
import { SearchType } from "../../community/board/type/board";
import { recoverComment, restrictComment } from "../../admin/api/admin";

const MyPageCommunityComment: React.FC = () => {
  const rowDef: RowDef<MyPageCommentType>[] = [
    { label: "댓글 번호", key: "reply_code", isSortable: true, isSearchType: true },
    { label: "글 번호", key: "post_code", isSortable: true, isSearchType: true },
    { label: "댓글 내용", key: "content", isSortable: true, isSearchType: true },
    { label: "작성일", key: "date", isSortable: true, isSearchType: false },
  ];

  {/* searchBar */}
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedFilter, setSelectedFilter] = useState(rowDef[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (pageNum: number) => {
    searchMyComments({
      keywordType: selectedFilter.key as SearchType,
      keyword: searchTerm,
      startDate: dateRange.start,
      endDate: dateRange.end
    }, pageNum).then((res) => {
      setComments(res.data.content);
      setTotalPages(res.data.totalPages);
      setIsSearching(true);
    });
  }

  const resetSearch = () => {
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setIsSearching(false);
    loadComments(1);
  }

  {/* table body */}
  const [comments, setComments] = useState<ReplySimpleInfo[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const loadComments = (pageNum: number) => {
    getMyCommentAll(pageNum).then((res) => {
      setComments(res.data.content);
      setTotalPages(res.data.totalPages);
    });
  }
  const openDeleteModal = (code: string) => {
    setSelectedCode(code);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCode(null);
  };

  const handleDelete = async (replyCode: string, deleteReason: string) => {
    await restrictComment(replyCode, deleteReason);
    loadComments(1);
  }

  const handleRecover = async (replyCode: string) => {
    if(confirm("게시글을 복구하시겠습니까?"))
      await recoverComment(replyCode);
    loadComments(1);
  }

  {/* header */}
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      //이미 해당 필드일 시 정렬만 해줌
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    loadComments(1);
  }, []);

  {/* render Functions */}
  const renderSearchBar = () => {
    return (
      <div className="flex justify-end items-center gap-5 mt-6 mb-6 pr-5">
        <div className="relative">
          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="bg-white px-4 py-2 rounded-md shadow-sm flex items-center gap-2 border border-gray-300 hover:bg-gray-100">
            <span>{selectedFilter.label}</span>
            <i className={`fas fa-chevron-${isFilterDropdownOpen ? "up" : "down"}`}></i>
          </button>
          {isFilterDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-md shadow-lg z-50">
              <ul className="py-1">
                {rowDef.map((def) => (
                  def.isSearchType && (
                  <li
                    key={def.key}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedFilter(def);
                      setIsFilterDropdownOpen(false);
                    }}>
                    {def.label}
                  </li>)
                ))}
              </ul>
            </div>
          )}
        </div>
        <>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
            />
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="border rounded-button px-3 py-1.5 text-sm"
            />
            <span className="text-sm text-gray-600">~</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="border rounded-button px-3 py-1.5 text-sm"
            />
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => resetSearch()}>
            초기화
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => handleSearch(1)}>
            검색
          </button>
        </>
      </div>
    )
  }

  const renderHeader = () => {
    return (
      <tr>
        {rowDef.map(({ label, key, isSortable }) => {
          return isSortable ? (
            <th
              onClick={() => handleSort(key)}
              className="px-4 py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap cursor-pointer">
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
          ) : (
            <th
              className="px-4 py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap cursor-pointer">
              <span>{label}</span>
            </th>
          );
        })}
      </tr>
    )
  }

  const renderRow = (comment: any) => (
    <React.Fragment key={comment.reply_code}>
      <tr className="hover:bg-gray-50 border-b">
        {rowDef.map(({ key }) => {
          switch (key) {
            case "content":
              return (
                <td key={key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <Link to={`/boardDetail/${comment["post_code"]}`}>
                    {comment[key]}
                  </Link>
                </td>
              );
            default:
              return (
                <td key={key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {comment[key]}
                </td>
              );
          }
        })}
      </tr>
    </React.Fragment>
  );

  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
      <MyPageSideBar />
      {/* 메인 컨텐츠 */}
      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            {/* 브레드크럼 */}
            <MyPageBreadCrumb major="커뮤니티" sub="댓글 관리" />
            {/* 테이블 */}
          <MyPageTable
            rows={comments}
            renderHeader={renderHeader}
            renderSearchBar={renderSearchBar}
            renderRow={renderRow}
          />
          {/* 페이지네이션 */}
          <Pagenation totalPages={totalPages} loadPageByPageNum={(num) => isSearching ? handleSearch(num) : loadComments(num)} />
          </main>
        </div>
      </div>
      
      {/* 삭제 모달 */}
      <DeleteModal
        onDelete={handleDelete}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedCode={selectedCode!}
        closeDeleteModal={closeDeleteModal}
      />
    </div>
  );
};

export default MyPageCommunityComment;
