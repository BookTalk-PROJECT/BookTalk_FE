import React, { useCallback } from "react";
import MyPageSideBar from "../component/MyPageSideBar";
import DataTableCustom from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import { RowDef } from "../../common/type/common";
import { BookReviewSimpleInfo } from "../../common/component/Board/type/BoardDetailTypes";
import { getMyBookReviewBoardAll, searchMyBookReviewBoards } from "../api/MyPage";
import { Link, useSearchParams } from "react-router-dom";
import { usePaginatedData } from "../../common/hooks/usePaginatedData";

type MyPageBookReviewColType = {
  code: string;
  book_title: string;
  review_title: string;
  reg_date: string;
  rating: number;
};

const MyPageBookReviewBoard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam) : 1;

  const rowDef: RowDef<MyPageBookReviewColType>[] = [
    { label: "리뷰 번호", key: "code", isSortable: true, isSearchType: true },
    { label: "책 제목", key: "book_title", isSortable: true, isSearchType: true },
    { label: "리뷰 제목", key: "review_title", isSortable: true, isSearchType: true },
    { label: "작성일", key: "reg_date", isSortable: true, isSearchType: false },
    { label: "평점", key: "rating", isSortable: true, isSearchType: false },
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
    fetchData: getMyBookReviewBoardAll,
    searchData: searchMyBookReviewBoards,
    initialPage,
  });

  const handlePageChange = useCallback((page: number) => {
    setSearchParams(
      page > 1 ? { page: page.toString() } : {},
      { replace: true }
    );
    goToPage(page);
  }, [setSearchParams, goToPage]);

  const renderColumn = (row: any, key: Extract<keyof MyPageBookReviewColType, string>) => {
    switch (key) {
      case "review_title":
        return <Link to={`/book-review/${row["code"]}`}>{row[key]}</Link>;
      case "rating":
        return <>{row[key]}/5</>;
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
            <BreadCrumb major="북리뷰" sub="게시글 관리" />
            <DataTableCustom<BookReviewSimpleInfo, MyPageBookReviewColType>
              rows={posts}
              rowDef={rowDef}
              getRowKey={(post) => post.code}
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

export default MyPageBookReviewBoard;
