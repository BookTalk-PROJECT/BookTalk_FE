import React, { useCallback } from "react";
import MyPageSideBar from "../component/MyPageSideBar";
import DataTableCustom from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import { RowDef } from "../../common/type/common";
import { getMyBoardAll, searchMyBoards } from "../api/MyPage";
import { Link, useSearchParams } from "react-router-dom";
import { usePaginatedData } from "../../common/hooks/usePaginatedData";

type MyPageBoardColType = {
  board_code: string;
  title: string;
  category: string;
  date: string;
};

export type MyCommunityBoardSimpleInfo = {
  board_code: string;
  categoryId: number;
  title: string;
  author: string;
  date: string;
  views: number;
  del_yn: boolean;
};

const MyPageCommunityBoard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam) : 1;

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
    initialPage,
  });

  const handlePageChange = useCallback((page: number) => {
    setSearchParams(
      page > 1 ? { page: page.toString() } : {},
      { replace: true }
    );
    goToPage(page);
  }, [setSearchParams, goToPage]);

  const renderColumn = (row: any, key: Extract<keyof MyPageBoardColType, string>) => {
    switch (key) {
      case "title":
        return <Link to={`/boardDetail/${row["board_code"]}?categoryId=${row["categoryId"]}`}>{row[key]}</Link>;
      default:
        return <>{row[key]}</>;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* 사이드바 */}
      <MyPageSideBar />
      {/* 메인 컨텐츠 */}
      <div className="flex-1 bg-gray-50 py-8 px-3 md:px-6 overflow-auto min-w-0">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            <BreadCrumb major="커뮤니티" sub="게시글 관리" />
            <DataTableCustom<MyCommunityBoardSimpleInfo, MyPageBoardColType>
              rows={posts}
              rowDef={rowDef}
              getRowKey={(post) => post.board_code}
              renderColumn={renderColumn}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
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
