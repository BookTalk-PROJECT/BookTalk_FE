import React, { useEffect, useState } from "react";
import MyPageSideBar from "../../mypage/component/MyPageSideBar";
import MyPageBreadCrumb from "../../mypage/component/MyPageBreadCrumb";
import MyPageTable from "../../mypage/component/MyPageTable";
import Pagenation from "../../common/component/Pagination";
import { adminBoardMockData } from "../../mypage/testdata/MyPageTestData"; // 예시 mock 데이터 import
import MyPageManageRowButton from "../../mypage/component/button/MyPageManageRowButton";
import MyPageActiveTabButton from "../../mypage/component/button/MyPageActiveTabButton";
import { MyPageBoardType, RowDef } from "../../mypage/type/MyPageBoardTable";
import { PostSimpleInfo } from "../../common/component/Board/type/BoardDetail.types";
import { Link } from "react-router-dom";
import DeleteModal from "../../mypage/component/DeleteModal";
import { SearchCondition, SearchType } from "../../community/board/type/board";
import { getBoardAdminAll, recoverBoard, restrictBoard, searchBoardAdminAll } from "../api/admin";

const AdminPageBoard: React.FC = () => {
  const rowDef: RowDef<MyPageBoardType>[] = [
    { label: "게시물 번호", key: "board_code", isSortable: true, isSearchType: true },
    { label: "제목", key: "title", isSortable: true, isSearchType: true },
    { label: "분류", key: "category", isSortable: true, isSearchType: true },
    { label: "작성자", key: "author", isSortable: true, isSearchType: true },
    { label: "날짜", key: "date", isSortable: true, isSearchType: false },
    { label: "관리", key: "manage", isSortable: true, isSearchType: false },
    { label: "사유", key: "deleteReason", isSortable: true, isSearchType: false },
  ];
  {/* searchBar */}
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedFilter, setSelectedFilter] = useState(rowDef[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (pageNum: number) => {
    searchBoardAdminAll({
      keywordType: selectedFilter.key as SearchType,
      keyword: searchTerm,
      startDate: dateRange.start,
      endDate: dateRange.end
    }, pageNum).then((res) => {
      setPosts(res.data.content);
      setTotalPages(res.data.totalPages);
      setIsSearching(true);
    });
  }

  const resetSearch = () => {
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setIsSearching(false);
    loadBoards(1);
  }
  
  {/* table body */}
  const [posts, setPosts] = useState<PostSimpleInfo[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const loadBoards = (pageNum: number) => {
    getBoardAdminAll(pageNum).then((res) => {
      setPosts(res.data.content);
      setTotalPages(res.data.totalPages);
    });
  }

  const handleDelete = async (boardCode: string, deleteReason: string) => {
    await restrictBoard(boardCode, deleteReason);
    loadBoards(1);
  }

  const handleRecover = async (boardCode: string) => {
    if(confirm("게시글을 복구하시겠습니까?"))
      await recoverBoard(boardCode);
    loadBoards(1);
  }

  const openDeleteModal = (code: string) => {
    setSelectedCode(code);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCode(null);
  };

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

  {/* others */}
  const [activeTab, setActiveTab] = useState("전체");

  useEffect(() => {
    loadBoards(1);
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

  const renderRow = (post: any) => (
    <React.Fragment key={post.board_code}>
      <tr className="hover:bg-gray-50 border-b">
        {rowDef.map(({ key }) => {
          switch (key) {
            case "title":
              return (
                <td key={key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <Link to={`/boardDetail/${post["board_code"]}`}>
                    {post[key]}
                  </Link>
                </td>
              );

            case "manage":
              return (
                <td key={key}>
                  {post["delYn"] ? (
                    <MyPageManageRowButton
                      actions={[
                        { label: "복구", color: "green", onClick: () => handleRecover(post.board_code) },
                      ]}
                    />
                  ) : (
                    <MyPageManageRowButton
                      actions={[
                        { label: "삭제", color: "red", onClick: () => openDeleteModal(post.board_code) },
                      ]}
                    />
                  )}
                </td>
              );

            case "deleteReason":
              return post[key] ? (
                <td
                  key={key}
                  className="relative group overflow-visible flex items-center justify-center px-4 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  <div className="w-4 h-4 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    i
                  </div>
                  <div className="absolute z-50 hidden group-hover:block p-2 bg-gray-800 text-white text-xs rounded shadow-lg top-0 right-full mr-2 whitespace-normal min-w-20 w-auto">
                    삭제 사유: {post[key]}
                  </div>
                </td>
              ) : null;

            default:
              return (
                <td key={key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post[key]}
                </td>
              );
          }
        })}
      </tr>
    </React.Fragment>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MyPageSideBar />
      <div className="flex-1 px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <MyPageBreadCrumb major="관리자" sub="게시물 관리" />
          <MyPageActiveTabButton
            actions={[
              { label: "전체", color: "blue"},
              { label: "커뮤니티", color: "yellow"},
              // { label: "북리뷰", color: "red"},
              // { label: "모임", color: "green"},
            ]}
            setActiveTab={setActiveTab}
          />
          <MyPageTable
            rows={posts}
            renderHeader={renderHeader}
            renderSearchBar={renderSearchBar}
            renderRow={renderRow}
          />
          <Pagenation totalPages={totalPages} loadPageByPageNum={(num) => isSearching ? handleSearch(num) : loadBoards(num)} />
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

export default AdminPageBoard;
