import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";

import MyPageSideBar from "../component/MyPageSideBar";
import DataTableCustom from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import { RowDef } from "../../common/type/common";

import DeleteModal from "../component/DeleteModal";
import MyPageManageRowButton from "../component/button/MyPageManageRowButton";
import { getMyGatheringCommentAll, searchMyGatheringComments } from "../api/MyPage";
import { usePaginatedData } from "../../common/hooks/usePaginatedData";

type MyPageGatheringCommentColType = {
  gathering_name: string;
  post_title: string;
  content: string;
  author: string;
  del_yn: number | boolean;
  reg_date: string;
};

export type MyGatheringCommentSimpleInfo = MyPageGatheringCommentColType & {
  reply_code: string;
  post_code: string;
};

const MyPageGatheringComment: React.FC = () => {
  const rowDef: RowDef<MyPageGatheringCommentColType>[] = [
    { label: "모임명", key: "gathering_name", isSortable: true, isSearchType: true },
    { label: "게시글명", key: "post_title", isSortable: true, isSearchType: true },
    { label: "댓글 내용", key: "content", isSortable: false, isSearchType: true },
    { label: "작성자", key: "author", isSortable: true, isSearchType: true },
    { label: "관리", key: "del_yn", isSortable: false, isSearchType: false },
    { label: "작성일", key: "reg_date", isSortable: true, isSearchType: false },
  ];

  // 삭제 모달
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");

  // 커스텀 훅 사용
  const {
    data: rows,
    totalPages,
    currentPage,
    isLoading,
    error,
    goToPage,
    search,
    resetSearch,
    refresh,
  } = usePaginatedData({
    fetchData: getMyGatheringCommentAll,
    searchData: searchMyGatheringComments,
  });

  const openDeleteModal = useCallback((replyCode: string) => {
    setSelectedCode(replyCode);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCode("");
  };

  const handleDelete = async (replyCode: string, deleteReason: string) => {
    // TODO: 실제 삭제 API 연결
    // await deleteReply(replyCode, deleteReason);
    console.log("[TODO] delete reply", { replyCode, deleteReason });
    refresh();
  };

  const handleRestore = useCallback(async (replyCode: string) => {
    // TODO: 실제 복원 API 연결
    // await restoreReply(replyCode);
    console.log("[TODO] restore reply", { replyCode });
    refresh();
  }, [refresh]);

  const renderColumn = useCallback((row: any, key: Extract<keyof MyPageGatheringCommentColType, string>) => {
    const replyCode = row.reply_code ?? "";
    const postCode = row.post_code ?? "";
    const gatheringName = row.gathering_name ?? "";
    const postTitle = row.post_title ?? "";
    const content = row.content ?? "";
    const author = row.author ?? "";
    const delYn = row.del_yn;
    const isDeleted = delYn === true || delYn === 1 || delYn === "1";
    const regDate = row.reg_date ?? "";

    switch (key) {
      case "gathering_name":
        return <>{gatheringName}</>;

      case "post_title":
        return <Link to={`/gathering/boardDetail/${postCode}`}>{postTitle}</Link>;

      case "content":
        return <>{content}</>;

      case "author":
        return <>{author}</>;

      case "reg_date":
        return <>{regDate}</>;

      case "del_yn": {
        const actions = isDeleted
          ? [{ label: "복원", color: "gray" as const, onClick: () => handleRestore(replyCode) }]
          : [{ label: "삭제", color: "red" as const, onClick: () => openDeleteModal(replyCode) }];

        return <MyPageManageRowButton actions={actions} />;
      }

      default:
        return <>{row[key]}</>;
    }
  }, [handleRestore, openDeleteModal]);

  return (
    <div className="flex h-screen">
      <MyPageSideBar />

      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            <BreadCrumb major="모임" sub="댓글 관리" />

            <DataTableCustom<MyGatheringCommentSimpleInfo, MyPageGatheringCommentColType>
              rows={rows}
              rowDef={rowDef}
              getRowKey={(r) => r.reply_code}
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

      <DeleteModal
        onDelete={handleDelete}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedCode={selectedCode}
        closeDeleteModal={closeDeleteModal}
      />
    </div>
  );
};

export default MyPageGatheringComment;
