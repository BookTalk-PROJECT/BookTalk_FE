import React, { useState, useMemo, useCallback } from "react";
import MyPageSideBar from "../../mypage/component/MyPageSideBar";
import BreadCrumb from "../../common/component/BreadCrumb";
import DataTableCustom from "../../common/component/DataTableCustom";
import MyPageManageRowButton from "../../mypage/component/button/MyPageManageRowButton";
import MyPageActiveTabButton from "../../mypage/component/button/MyPageActiveTabButton";
import { ReplySimpleInfo } from "../../common/component/Board/type/BoardDetailTypes";
import { RowDef } from "../../common/type/common";
import { AdminCommentColType } from "../type/AdminCommunity";
import { Link } from "react-router-dom";
import DeleteModal from "../../mypage/component/DeleteModal";
import { getCommentAdminAll, recoverComment, restrictComment, searchCommentAdminAll } from "../api/admin";
import { usePaginatedData } from "../../common/hooks/usePaginatedData";

const AdminPageComment: React.FC = () => {
  const rowDef: RowDef<AdminCommentColType>[] = [
    { label: "댓글 번호", key: "reply_code", isSortable: true, isSearchType: true },
    { label: "글 번호", key: "post_code", isSortable: true, isSearchType: true },
    { label: "댓글 내용", key: "content", isSortable: true, isSearchType: true },
    { label: "작성자", key: "author", isSortable: true, isSearchType: true },
    { label: "작성일", key: "date", isSortable: true, isSearchType: false },
    { label: "관리", key: "manage", isSortable: true, isSearchType: false },
    { label: "사유", key: "deleteReason", isSortable: true, isSearchType: false },
  ];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("커뮤니티");

  // Get postType based on active tab
  const getPostType = useCallback((tab: string): string => {
    return tab === "북리뷰" ? "bookreview" : "community";
  }, []);

  // useMemo로 loadRowData 메모이제이션 - activeTab 변경 시 자동 갱신
  const fetchData = useMemo(
    () => (pageNum: number) => getCommentAdminAll(pageNum, getPostType(activeTab)),
    [activeTab, getPostType]
  );

  // useMemo로 searchRowData 메모이제이션
  const searchData = useMemo(
    () => (req: any, pageNum: number) => searchCommentAdminAll(req, pageNum, getPostType(activeTab)),
    [activeTab, getPostType]
  );

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
    refresh,
  } = usePaginatedData({
    fetchData,
    searchData,
  });

  const openDeleteModal = useCallback((code: string) => {
    setSelectedCode(code);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCode(null);
  };

  const handleDelete = async (replyCode: string, deleteReason: string) => {
    await restrictComment(replyCode, deleteReason);
    refresh();
  };

  const handleRecover = useCallback(async (replyCode: string) => {
    if (confirm("게시글을 복구하시겠습니까?")) {
      await recoverComment(replyCode);
      refresh();
    }
  }, [refresh]);

  // Get detail page path based on post code prefix
  const getDetailPath = (postCode: string) => {
    if (postCode.startsWith("BR_")) {
      return `/book-review/${postCode}`;
    }
    return `/boardDetail/${postCode}`;
  };

  const renderColumn = useCallback((row: any, key: Extract<keyof AdminCommentColType, string>) => {
    switch (key) {
      case "content":
        return <Link to={getDetailPath(row["post_code"])}>{row[key]}</Link>;
      case "manage":
        return row["delYn"] ? (
          <MyPageManageRowButton
            actions={[{ label: "복구", color: "green", onClick: () => handleRecover(row.reply_code) }]}
          />
        ) : (
          <MyPageManageRowButton
            actions={[{ label: "삭제", color: "red", onClick: () => openDeleteModal(row.reply_code) }]}
          />
        );
      case "deleteReason":
        return row["deleteReason"] ? (
          <td className="relative group overflow-visible flex items-center justify-center px-4 py-4 whitespace-nowrap text-sm text-gray-500">
            <div className="w-4 h-4 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
              i
            </div>
            <div className="absolute z-50 hidden group-hover:block p-2 bg-gray-800 text-white text-xs rounded shadow-lg top-0 right-full mr-2 whitespace-normal min-w-20 w-auto">
              삭제 사유: {row[key]}
            </div>
          </td>
        ) : (
          <></>
        );
      default:
        return <>{row[key]}</>;
    }
  }, [handleRecover, openDeleteModal]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MyPageSideBar />
      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            <BreadCrumb major="관리자" sub="댓글 관리" />
            <MyPageActiveTabButton
              actions={[
                { label: "커뮤니티", color: "yellow" },
                { label: "북리뷰", color: "red" },
              ]}
              setActiveTab={setActiveTab}
            />
            <DataTableCustom<ReplySimpleInfo, AdminCommentColType>
              rows={comments}
              rowDef={rowDef}
              getRowKey={(reply) => reply.reply_code}
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

export default AdminPageComment;
