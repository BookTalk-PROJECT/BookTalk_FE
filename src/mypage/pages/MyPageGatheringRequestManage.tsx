import React, { useMemo, useState, useCallback } from "react";

import MyPageSideBar from "../component/MyPageSideBar";
import DataTableCustom from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import { RowDef } from "../../common/type/common";

import MyPageManageRowButton from "../component/button/MyPageManageRowButton";
import { getMyGatheringRequestAll } from "../api/MyPage";
import RequestQAModal from "../component/RequestQAModal";
import { usePaginatedData } from "../../common/hooks/usePaginatedData";

type MyPageGatheringRequestColType = {
  gathering_name: string;
  qa_button: string;
  status: string;
  result: string;
  gathering_code: string;
  qa_json: string;
  reject_reason?: string | null;
};

export type MyGatheringRequestRow = MyPageGatheringRequestColType;

const MyPageGatheringRequestManage: React.FC = () => {
  const rowDef: RowDef<MyPageGatheringRequestColType>[] = [
    { label: "모임명", key: "gathering_name", isSortable: true, isSearchType: false },
    { label: "질문목록", key: "qa_button", isSortable: false, isSearchType: false },
    { label: "상태", key: "status", isSortable: true, isSearchType: false },
    { label: "결과", key: "result", isSortable: false, isSearchType: false },
  ];

  // Q/A 모달
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);
  const [selectedGatheringName, setSelectedGatheringName] = useState("");
  const [selectedQaJson, setSelectedQaJson] = useState("");

  // 커스텀 훅 사용
  const {
    data: rows,
    totalPages,
    currentPage,
    isLoading,
    error,
    goToPage,
    refresh,
  } = usePaginatedData({
    fetchData: (pageNum: number) => getMyGatheringRequestAll(pageNum),
  });

  const openQAModal = useCallback((gatheringName: string, qaJson: string) => {
    setSelectedGatheringName(gatheringName);
    setSelectedQaJson(qaJson ?? "[]");
    setIsQAModalOpen(true);
  }, []);

  const closeQAModal = () => {
    setIsQAModalOpen(false);
    setSelectedGatheringName("");
    setSelectedQaJson("");
  };

  const statusLabel = useMemo(() => {
    return (s: string) => {
      if (s === "WAITING") return "대기";
      if (s === "REJECT") return "거부";
      return s ?? "";
    };
  }, []);

  const handleWithdraw = async (gatheringCode: string) => {
    // TODO: 실제 철회 API 연결
    // await withdrawRecruitRequest(gatheringCode);
    console.log("[TODO] withdraw recruit request", { gatheringCode });
    refresh();
  };

  const renderColumn = useCallback((row: any, key: Extract<keyof MyPageGatheringRequestColType, string>) => {
    const gatheringCode = row.gathering_code ?? "";
    const gatheringName = row.gathering_name ?? "";
    const qaJson = row.qa_json ?? "[]";
    const status = row.status ?? "";
    const rejectReason = row.reject_reason ?? "";

    switch (key) {
      case "gathering_name":
        return <>{gatheringName}</>;

      case "qa_button":
        return (
          <MyPageManageRowButton
            actions={[
              {
                label: "보기",
                color: "blue",
                onClick: () => openQAModal(gatheringName, qaJson),
              },
            ]}
          />
        );

      case "status":
        return <>{statusLabel(status)}</>;

      case "result":
        if (status === "WAITING") {
          return (
            <MyPageManageRowButton
              actions={[
                {
                  label: "철회",
                  color: "red",
                  onClick: () => handleWithdraw(gatheringCode),
                },
              ]}
            />
          );
        }
        if (status === "REJECT") {
          return <>{rejectReason || "-"}</>;
        }
        return <>-</>;

      default:
        return <>{row[key]}</>;
    }
  }, [openQAModal, statusLabel]);

  return (
    <div className="flex h-screen">
      <MyPageSideBar />

      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            <BreadCrumb major="모임" sub="신청 관리" />

            <DataTableCustom<MyGatheringRequestRow, MyPageGatheringRequestColType>
              rows={rows}
              rowDef={rowDef}
              getRowKey={(r) => r.gathering_code}
              renderColumn={renderColumn}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={goToPage}
              isLoading={isLoading}
              error={error}
            />
          </main>
        </div>
      </div>

      <RequestQAModal
        isOpen={isQAModalOpen}
        gatheringName={selectedGatheringName}
        qaJson={selectedQaJson}
        onClose={closeQAModal}
      />
    </div>
  );
};

export default MyPageGatheringRequestManage;
