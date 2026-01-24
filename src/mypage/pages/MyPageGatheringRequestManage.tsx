import React, { useMemo, useState } from "react";

import MyPageSideBar from "../component/MyPageSideBar";
import MyPageTable from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import { RowDef } from "../../common/type/common";

import MyPageManageRowButton from "../component/button/MyPageManageRowButton"; // 경로 맞게 수정
import { getMyGatheringRequestAll } from "../api/MyPage";
import RequestQAModal from "../component/RequestQAModal";

type MyPageGatheringRequestColType = {
  gathering_name: string;

  // 아래 3개는 테이블 표시를 위한 "가상 컬럼"
  qa_button: string;
  status: string;
  result: string;

  // 서버에서 실제로 받아오는 필드(화면 표시/모달/철회 판단에 사용)
  gathering_code: string;
  qa_json: string; // 질문/답변 JSON (프로시저에서 만들어서 내려줌)
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

  const [rows, setRows] = useState<MyGatheringRequestRow[]>([]);

  // Q/A 모달
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);
  const [selectedGatheringName, setSelectedGatheringName] = useState("");
  const [selectedQaJson, setSelectedQaJson] = useState("");

  // 리로드 트리거
  const [forceUpdate, setForceUpdate] = useState(0);

  const openQAModal = (gatheringName: string, qaJson: string) => {
    setSelectedGatheringName(gatheringName);
    setSelectedQaJson(qaJson ?? "[]");
    setIsQAModalOpen(true);
  };

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
    setForceUpdate((p) => p + 1);
  };

  const renderColumn = (row: any, key: Extract<keyof MyPageGatheringRequestColType, string>) => {
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
  };

  return (
    <div className="flex h-screen">
      <MyPageSideBar />

      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            <BreadCrumb major="모임" sub="신청 관리" />

            <MyPageTable<MyGatheringRequestRow, MyPageGatheringRequestColType>
              rows={rows}
              rowDef={rowDef}
              getRowKey={(r) => r.gathering_code}
              renderColumn={renderColumn}
              setRowData={setRows}
              loadRowData={(pageNum) => getMyGatheringRequestAll(pageNum)}
              forceUpdate={forceUpdate}
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
