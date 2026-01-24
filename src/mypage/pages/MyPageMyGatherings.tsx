import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import MyPageSideBar from "../component/MyPageSideBar";
import MyPageTable from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import { RowDef } from "../../common/type/common";

import DeleteModal from "../component/DeleteModal"; // 경로 맞게 수정
import MyPageManageRowButton from "../component/button/MyPageManageRowButton"; // 경로 맞게 수정
import { getMyGatheringAll, restoreGathering, searchMyGatherings } from "../api/MyPage";
import { deleteGathering } from "../../gathering/api/GatheringHeaderRequest";

type MyPageGatheringColType = {
  gathering_code: string;
  name: string;
  leader_name: string; // 모임장 이름(member.name)
  master_yn: number; // 1이면 모임장(현재 로그인 사용자 기준), 0이면 참여자
  del_yn?: boolean; // 삭제/복원 분기용
  reg_date: string; // 개설일(= reg_time 기준, yyyy-MM-dd 문자열 권장)
};

export type MyGatheringSimpleInfo = MyPageGatheringColType;

const MyPageMyGatherings: React.FC = () => {
  const navigate = useNavigate();
  // 컬럼 순서: 모임코드, 모임명, 모임장, 관리, 개설일
  const rowDef: RowDef<MyPageGatheringColType>[] = [
    { label: "모임 코드", key: "gathering_code", isSortable: true, isSearchType: true },
    { label: "모임명", key: "name", isSortable: true, isSearchType: true },
    { label: "모임장", key: "leader_name", isSortable: false, isSearchType: false },
    { label: "관리", key: "master_yn", isSortable: false, isSearchType: false },
    { label: "개설일", key: "reg_date", isSortable: true, isSearchType: false },
  ];

  const [rows, setRows] = useState<MyGatheringSimpleInfo[]>([]);

  // 삭제 모달
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");

  // 테이블 강제 리로드 트리거
  const [forceUpdate, setForceUpdate] = useState(0);

  const openDeleteModal = (code: string) => {
    setSelectedCode(code);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCode("");
  };

  const handleDelete = async (code: string, deleteReason: string) => {
    // TODO: 실제 삭제 API
    console.log("[TODO] delete gathering", { code, deleteReason });
    await deleteGathering(code, deleteReason);
    setForceUpdate((p) => p + 1);
  };

  const handleRestore = async (code: string) => {
    // TODO: 실제 복원 API 연결
    console.log("[TODO] restore gathering", { code });
    await restoreGathering(code, "");
    setForceUpdate((p) => p + 1);
  };

  const handleWithdraw = async (code: string) => {
    // TODO: 실제 탈퇴 API 연결
    console.log("[TODO] withdraw gathering", { code });
    setForceUpdate((p) => p + 1);
  };

  const handleEdit = (code: string) => {
    navigate(`/gathering/${code}/edit`);
  };

  const renderColumn = (row: any, key: Extract<keyof MyPageGatheringColType, string>) => {
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
        // 모임장: 삭제/복원, 참여자: 탈퇴
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
  };

  return (
    <div className="flex h-screen">
      <MyPageSideBar />

      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            <BreadCrumb major="모임" sub="내 모임" />

            <MyPageTable<MyGatheringSimpleInfo, MyPageGatheringColType>
              rows={rows}
              rowDef={rowDef}
              getRowKey={(r) => r.gathering_code}
              renderColumn={renderColumn}
              setRowData={setRows}
              loadRowData={getMyGatheringAll}
              searchRowData={searchMyGatherings}
              forceUpdate={forceUpdate}
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
