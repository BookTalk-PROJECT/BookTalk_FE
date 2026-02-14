import React, { useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";

import MyPageSideBar from "../component/MyPageSideBar";
import DataTableCustom from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import { RowDef } from "../../common/type/common";

import DeleteModal from "../component/DeleteModal";
import MyPageManageRowButton from "../component/button/MyPageManageRowButton";
import { getMyGatheringBoardAll, searchMyGatheringBoards } from "../api/MyPage";
import { usePaginatedData } from "../../common/hooks/usePaginatedData";

type MyPageGatheringBoardColType = {
  gathering_name: string;
  title: string;
  author: string;
  del_yn: number | boolean;
  reg_date: string;
};

export type MyGatheringBoardSimpleInfo = MyPageGatheringBoardColType & {
  board_code: string;
};

const MyPageGatheringBoard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam) : 1;

  const rowDef: RowDef<MyPageGatheringBoardColType>[] = [
    { label: "모임명", key: "gathering_name", isSortable: true, isSearchType: true },
    { label: "제목", key: "title", isSortable: true, isSearchType: true },
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
    fetchData: getMyGatheringBoardAll,
    searchData: searchMyGatheringBoards,
    initialPage,
  });

  const handlePageChange = useCallback((page: number) => {
    setSearchParams(
      page > 1 ? { page: page.toString() } : {},
      { replace: true }
    );
    goToPage(page);
  }, [setSearchParams, goToPage]);

  const openDeleteModal = useCallback((code: string) => {
    setSelectedCode(code);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCode("");
  };

  const handleDelete = async (code: string, deleteReason: string) => {
    // TODO: 실제 삭제 API 연결
    // await deleteGatheringBoard(code, deleteReason);
    console.log("[TODO] delete gathering board", { code, deleteReason });
    refresh();
  };

  const handleRestore = useCallback(async (code: string) => {
    // TODO: 실제 복원 API 연결
    // await restoreGatheringBoard(code);
    console.log("[TODO] restore gathering board", { code });
    refresh();
  }, [refresh]);

  const renderColumn = useCallback((row: any, key: Extract<keyof MyPageGatheringBoardColType, string>) => {
    const boardCode = row.board_code ?? "";
    const gatheringName = row.gathering_name ?? "";
    const title = row.title ?? "";
    const author = row.author ?? "";
    const delYn = row.del_yn;
    const isDeleted = delYn === true || delYn === 1 || delYn === "1";
    const regDate = row.reg_date ?? "";

    switch (key) {
      case "gathering_name":
        return <>{gatheringName}</>;

      case "title":
        return <Link to={`/gathering/boardDetail/${boardCode}`}>{title}</Link>;

      case "author":
        return <>{author}</>;

      case "reg_date":
        return <>{regDate}</>;

      case "del_yn": {
        const actions = isDeleted
          ? [
              {
                label: "복원",
                color: "gray" as const,
                onClick: () => handleRestore(boardCode),
              },
            ]
          : [
              {
                label: "삭제",
                color: "red" as const,
                onClick: () => openDeleteModal(boardCode),
              },
            ];

        return <MyPageManageRowButton actions={actions} />;
      }

      default:
        return <>{row[key]}</>;
    }
  }, [handleRestore, openDeleteModal]);

  return (
    <div className="flex min-h-screen">
      <MyPageSideBar />

      <div className="flex-1 bg-gray-50 py-8 px-3 md:px-6 overflow-auto min-w-0">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            <BreadCrumb major="모임" sub="게시글 관리" />

            <DataTableCustom<MyGatheringBoardSimpleInfo, MyPageGatheringBoardColType>
              rows={rows}
              rowDef={rowDef}
              getRowKey={(r) => r.board_code}
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

      <DeleteModal
        onDelete={handleDelete}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedCode={selectedCode}
        closeDeleteModal={closeDeleteModal}
      />
    </div>
  );
};

export default MyPageGatheringBoard;
