import React, { useState, useCallback } from "react";

import MyPageSideBar from "../component/MyPageSideBar";
import DataTableCustom from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import { RowDef } from "../../common/type/common";

import MyPageManageRowButton from "../component/button/MyPageManageRowButton";
import RequestQAModal from "../component/RequestQAModal";
import { approveGatheringRequest, getGatheringApprovalList, rejectGatheringRequest } from "../api/MyPage";
import { usePaginatedData } from "../../common/hooks/usePaginatedData";

type ApprovalColType = {
  gathering_name: string;
  applicant_name: string;
  qa_button: string;
  manage: string;
  status: string;
};

export type ApprovalRow = {
  gathering_code: string;
  gathering_name: string;

  applicant_id: number;
  applicant_name: string;

  qa_json: string;
  status: "WAITING" | "REJECT";
  reject_reason?: string | null;

  qa_button?: string;
  manage?: string;
};

export type ApproveReq = {
  gathering_code: string;
  applicant_id: number;
};

export type RejectReq = {
  gathering_code: string;
  applicant_id: number;
  reject_reason: string;
};

const MyPageGatheringApprovalManage: React.FC = () => {
  const rowDef: RowDef<ApprovalColType>[] = [
    { label: "모임명", key: "gathering_name", isSortable: true, isSearchType: false },
    { label: "신청자", key: "applicant_name", isSortable: true, isSearchType: false },
    { label: "답변목록", key: "qa_button", isSortable: false, isSearchType: false },
    { label: "관리", key: "manage", isSortable: false, isSearchType: false },
    { label: "상태", key: "status", isSortable: true, isSearchType: false },
  ];

  const [isQAModalOpen, setIsQAModalOpen] = useState(false);
  const [selectedGatheringName, setSelectedGatheringName] = useState("");
  const [selectedQaJson, setSelectedQaJson] = useState("[]");

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
    fetchData: (pageNum: number) => getGatheringApprovalList(pageNum),
  });

  const openQAModal = useCallback((gatheringName: string, qaJson: string) => {
    setSelectedGatheringName(gatheringName);
    setSelectedQaJson(qaJson ?? "[]");
    setIsQAModalOpen(true);
  }, []);

  const closeQAModal = () => {
    setIsQAModalOpen(false);
    setSelectedGatheringName("");
    setSelectedQaJson("[]");
  };

  const statusLabel = (s: string) => {
    if (s === "WAITING") return "대기";
    if (s === "REJECT") return "거부";
    return s ?? "";
  };

  const onApprove = async (row: ApprovalRow) => {
    await approveGatheringRequest({
      gathering_code: row.gathering_code,
      applicant_id: row.applicant_id,
    });
    refresh();
  };

  const onReject = async (row: ApprovalRow) => {
    const reason = window.prompt("거부 사유를 입력하세요", "") ?? "";
    await rejectGatheringRequest({
      gathering_code: row.gathering_code,
      applicant_id: row.applicant_id,
      reject_reason: reason,
    });
    refresh();
  };

  const renderColumn = useCallback((row: any, key: Extract<keyof ApprovalColType, string>) => {
    const gatheringName = row.gathering_name ?? "";
    const applicantName = row.applicant_name ?? "";
    const qaJson = row.qa_json ?? "[]";
    const status = row.status ?? "";
    const rejectReason = row.reject_reason ?? "";

    switch (key) {
      case "gathering_name":
        return <>{gatheringName}</>;

      case "applicant_name":
        return <>{applicantName}</>;

      case "qa_button":
        return (
          <MyPageManageRowButton
            actions={[{ label: "보기", color: "blue", onClick: () => openQAModal(gatheringName, qaJson) }]}
          />
        );

      case "manage":
        if (status === "REJECT") {
          return <>{rejectReason ? `거부 사유: ${rejectReason}` : "-"}</>;
        }
        return (
          <MyPageManageRowButton
            actions={[
              { label: "승인", color: "green", onClick: () => onApprove(row as ApprovalRow) },
              { label: "거부", color: "red", onClick: () => onReject(row as ApprovalRow) },
            ]}
          />
        );

      case "status":
        return <>{statusLabel(status)}</>;

      default:
        return <>{row[key]}</>;
    }
  }, [openQAModal]);

  return (
    <div className="flex h-screen">
      <MyPageSideBar />

      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            <BreadCrumb major="모임" sub="신청 승인 관리" />

            <DataTableCustom<ApprovalRow, ApprovalColType>
              rows={rows}
              rowDef={rowDef}
              getRowKey={(r) => `${r.gathering_code}_${r.applicant_id}`}
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

export default MyPageGatheringApprovalManage;
