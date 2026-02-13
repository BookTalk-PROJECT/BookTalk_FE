import React from "react";
import MyPageSideBar from "../component/MyPageSideBar";
import DataTableCustom from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import { RowDef } from "../../common/type/common";
import { PostSimpleInfo } from "../../common/component/Board/type/BoardDetailTypes";
import { getMyBoardAll, searchMyBoards } from "../api/MyPage";
import { Link } from "react-router-dom";
import { usePaginatedData } from "../../common/hooks/usePaginatedData";

type MyPageBoardColType = {
  board_code: string;
  title: string;
  category: string;
  date: string;
};

const MyPageCommunityBoard: React.FC = () => {
  const rowDef: RowDef<MyPageBoardColType>[] = [
    { label: "게시물 번호", key: "board_code", isSortable: true, isSearchType: true },
    { label: "제목", key: "title", isSortable: true, isSearchType: true },
    { label: "분류", key: "category", isSortable: true, isSearchType: true },
    { label: "날짜", key: "date", isSortable: true, isSearchType: false },
  ];

  // 커스텀 훅 사용
  const {
    data: posts,
    totalPages,
    currentPage,
    isLoading,
    error,
    goToPage,
    search,
    resetSearch,
  } = usePaginatedData({
    fetchData: getMyBoardAll,
    searchData: searchMyBoards,
  });

  const renderColumn = (row: any, key: Extract<keyof MyPageBoardColType, string>) => {
    switch (key) {
      case "title":
        return <Link to={`/boardDetail/${row["board_code"]}?categoryId=${row["categoryId"]}`}>{row[key]}</Link>;
      default:
        return <>{row[key]}</>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
      <MyPageSideBar />
      {/* 메인 컨텐츠 */}
      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            <BreadCrumb major="커뮤니티" sub="게시글 관리" />
            <DataTableCustom<PostSimpleInfo, MyPageBoardColType>
              rows={posts}
              rowDef={rowDef}
              getRowKey={(post) => post.board_code}
              renderColumn={renderColumn}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={goToPage}
              isLoading={isLoading}
              error={error}
              searchEnabled={true}
              onSearch={search}
              onResetSearch={resetSearch}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyPageCommunityBoard;
