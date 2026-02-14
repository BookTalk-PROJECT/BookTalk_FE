import React, { useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import MyPageSideBar from "../component/MyPageSideBar";
import DataTableCustom from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import { RowDef } from "../../common/type/common";

import DeleteModal from "../component/DeleteModal";
import MyPageManageRowButton from "../component/button/MyPageManageRowButton";
import { getMyGatheringAll, restoreGathering, searchMyGatherings } from "../api/MyPage";
import { deleteGathering } from "../../gathering/api/GatheringHeaderRequest";
import { usePaginatedData } from "../../common/hooks/usePaginatedData";

type MyPageGatheringColType = {
  gathering_code: string;
  name: string;
  leader_name: string;
  master_yn: number;
  del_yn?: boolean;
  reg_date: string;
};

export type MyGatheringSimpleInfo = MyPageGatheringColType;

const MyPageMyGatherings: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam) : 1;

  const rowDef: RowDef<MyPageGatheringColType>[] = [
    { label: "모임 코드", key: "gathering_code", isSortable: true, isSearchType: true },
    { label: "모임명", key: "name", isSortable: true, isSearchType: true },
    { label: "모임장", key: "leader_name", isSortable: false, isSearchType: false },
    { label: "관리", key: "master_yn", isSortable: false, isSearchType: false },
    { label: "개설일", key: "reg_date", isSortable: true, isSearchType: false },
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
    fetchData: getMyGatheringAll,
    searchData: searchMyGatherings,
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
    console.log("[TODO] delete gathering", { code, deleteReason });
    await deleteGathering(code, deleteReason);
    refresh();
  };

  const handleRestore = useCallback(async (code: string) => {
    console.log("[TODO] restore gathering", { code });
    await restoreGathering(code, "");
    refresh();
  }, [refresh]);

  const handleWithdraw = async (code: string) => {
    // TODO: 실제 탈퇴 API 연결
    console.log("[TODO] withdraw gathering", { code });
    refresh();
  };

  const handleEdit = (code: string) => {
    navigate(`/gathering/${code}/edit`);
  };

  const renderColumn = useCallback((row: any, key: Extract<keyof MyPageGatheringColType, string>) => {
    const gatheringCode = row.gathering_code ?? "";
    const name = row.name ?? "";
    const leaderName = row.leader_name ?? "";
    const masterYn = Number(row.master_yn ?? 0);
    const delYn = Boolean(row.del_yn ?? false);
    const regDate = row.reg_date ?? "";

    switch (key) {
      case "gathering_code":
        return <>{gatheringCode}</>;

      case "name":
        return <Link to={`/gathering/detail/${gatheringCode}`}>{name}</Link>;

      case "leader_name":
        return <>{leaderName}</>;

      case "reg_date":
        return <>{regDate}</>;

      case "master_yn": {
        const actions =
          masterYn === 1
            ? delYn
              ? [
                  {
                    label: "복원",
                    color: "gray" as const,
                    onClick: () => handleRestore(gatheringCode),
                  },
                ]
              : [
                  {
                    label: "수정",
                    color: "blue" as const,
                    onClick: () => handleEdit(gatheringCode),
                  },
                  {
                    label: "삭제",
                    color: "red" as const,
                    onClick: () => openDeleteModal(gatheringCode),
                  },
                ]
            : [
                {
                  label: "탈퇴",
                  color: "gray" as const,
                  onClick: () => handleWithdraw(gatheringCode),
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
            <BreadCrumb major="모임" sub="내 모임" />

            <DataTableCustom<MyGatheringSimpleInfo, MyPageGatheringColType>
              rows={rows}
              rowDef={rowDef}
              getRowKey={(r) => r.gathering_code}
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

export default MyPageMyGatherings;
