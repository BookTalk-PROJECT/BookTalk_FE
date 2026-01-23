import React, { useState } from "react";
import { Link } from "react-router-dom";

import MyPageSideBar from "../component/MyPageSideBar";
import MyPageTable from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import { RowDef } from "../../common/type/common";

import DeleteModal from "../component/DeleteModal"; // 경로 맞게 수정
import MyPageManageRowButton from "../component/button/MyPageManageRowButton"; // 경로 맞게 수정
import { getMyGatheringBoardAll, searchMyGatheringBoards } from "../api/MyPage";

type MyPageGatheringBoardColType = {
  gathering_name: string;
  title: string;
  author: string;
  del_yn: number | boolean; // 1/0 또는 true/false
  reg_date: string; // yyyy-MM-dd
};

export type MyGatheringBoardSimpleInfo = MyPageGatheringBoardColType & {
  board_code: string; // rowKey용 (화면엔 안 보여도 됨)
};

const MyPageGatheringBoard: React.FC = () => {
  const rowDef: RowDef<MyPageGatheringBoardColType>[] = [
    { label: "모임명", key: "gathering_name", isSortable: true, isSearchType: true },
    { label: "제목", key: "title", isSortable: true, isSearchType: true },
    { label: "작성자", key: "author", isSortable: true, isSearchType: true },
    { label: "관리", key: "del_yn", isSortable: false, isSearchType: false },
    { label: "작성일", key: "reg_date", isSortable: true, isSearchType: false },
  ];

  const [rows, setRows] = useState<MyGatheringBoardSimpleInfo[]>([]);

  // 삭제 모달
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");

  // 테이블 강제 리로드
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
    // TODO: 실제 삭제 API 연결
    // await deleteGatheringBoard(code, deleteReason);
    console.log("[TODO] delete gathering board", { code, deleteReason });
    setForceUpdate((p) => p + 1);
  };

  const handleRestore = async (code: string) => {
    // TODO: 실제 복원 API 연결
    // await restoreGatheringBoard(code);
    console.log("[TODO] restore gathering board", { code });
    setForceUpdate((p) => p + 1);
  };

  const renderColumn = (row: any, key: Extract<keyof MyPageGatheringBoardColType, string>) => {
    // normalize 없다 = 백엔드가 snake_case로 정확히 내려줘야 함
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
        // TODO: 상세 라우팅은 프로젝트 경로에 맞게 바꿔라
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
  };

  return (
    <div className="flex h-screen">
      <MyPageSideBar />

      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            <BreadCrumb major="모임" sub="게시글 관리" />

            <MyPageTable<MyGatheringBoardSimpleInfo, MyPageGatheringBoardColType>
              rows={rows}
              rowDef={rowDef}
              getRowKey={(r) => r.board_code}
              renderColumn={renderColumn}
              setRowData={setRows}
              loadRowData={getMyGatheringBoardAll}
              searchRowData={searchMyGatheringBoards}
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

export default MyPageGatheringBoard;
