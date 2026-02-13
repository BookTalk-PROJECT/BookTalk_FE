import React from "react";
import MyPageSideBar from "../component/MyPageSideBar";
import DataTableCustom from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import { RowDef } from "../../common/type/common";
import { ReplySimpleInfo } from "../../common/component/Board/type/BoardDetailTypes";
import { getMyCommentAll, searchMyComments } from "../api/MyPage";
import { Link } from "react-router-dom";
import { usePaginatedData } from "../../common/hooks/usePaginatedData";

type MyPageCommentColType = {
  reply_code: string;
  post_code: string;
  content: string;
  date: string;
};

const MyPageCommunityComment: React.FC = () => {
  const rowDef: RowDef<MyPageCommentColType>[] = [
    { label: "댓글 번호", key: "reply_code", isSortable: true, isSearchType: true },
    { label: "글 번호", key: "post_code", isSortable: true, isSearchType: true },
    { label: "댓글 내용", key: "content", isSortable: true, isSearchType: true },
    { label: "작성일", key: "date", isSortable: true, isSearchType: false },
  ];

  // 커스텀 훅 사용
  const {
    data: comments,
    totalPages,
    currentPage,
    isLoading,
    error,
    goToPage,
    search,
    resetSearch,
  } = usePaginatedData({
    fetchData: getMyCommentAll,
    searchData: searchMyComments,
  });

  const renderColumn = (row: any, key: Extract<keyof MyPageCommentColType, string>) => {
    switch (key) {
      case "content":
        return <Link to={`/boardDetail/${row.post_code}`}>{row[key]}</Link>;
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
            <BreadCrumb major="커뮤니티" sub="댓글 관리" />
            <DataTableCustom<ReplySimpleInfo, MyPageCommentColType>
              rows={comments}
              rowDef={rowDef}
              getRowKey={(comment) => comment.reply_code}
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

export default MyPageCommunityComment;
