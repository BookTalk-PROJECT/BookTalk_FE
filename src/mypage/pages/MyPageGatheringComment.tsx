import React, { useState } from "react";
import { Link } from "react-router-dom";

import MyPageSideBar from "../component/MyPageSideBar";
import MyPageTable from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import { RowDef } from "../../common/type/common";

import DeleteModal from "../component/DeleteModal"; // 경로 맞게 수정
import MyPageManageRowButton from "../component/button/MyPageManageRowButton"; // 경로 맞게 수정
import { getMyGatheringCommentAll, searchMyGatheringComments } from "../api/MyPage";

type MyPageGatheringCommentColType = {
  gathering_name: string;
  post_title: string;
  content: string;
  author: string;
  del_yn: number | boolean; // 0/1 또는 true/false
  reg_date: string; // yyyy-MM-dd
};

export type MyGatheringCommentSimpleInfo = MyPageGatheringCommentColType & {
  reply_code: string; // rowKey / 삭제/복원 대상
  post_code: string; // 링크 이동용(원하면)
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

  const [rows, setRows] = useState<MyGatheringCommentSimpleInfo[]>([]);

  // 삭제 모달
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");

  // 테이블 강제 리로드
  const [forceUpdate, setForceUpdate] = useState(0);

  const openDeleteModal = (replyCode: string) => {
    setSelectedCode(replyCode);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCode("");
  };

  const handleDelete = async (replyCode: string, deleteReason: string) => {
    // TODO: 실제 삭제 API 연결
    // await deleteReply(replyCode, deleteReason);
    console.log("[TODO] delete reply", { replyCode, deleteReason });

    setForceUpdate((p) => p + 1);
  };

  const handleRestore = async (replyCode: string) => {
    // TODO: 실제 복원 API 연결
    // await restoreReply(replyCode);
    console.log("[TODO] restore reply", { replyCode });

    setForceUpdate((p) => p + 1);
  };

  const renderColumn = (row: any, key: Extract<keyof MyPageGatheringCommentColType, string>) => {
    // normalize 없음: 백엔드가 snake_case 정확히 내려줘야 함
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
        // TODO: 게시글 상세 라우팅은 프로젝트에 맞게 수정
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
  };

  return (
    <div className="flex h-screen">
      <MyPageSideBar />

      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            <BreadCrumb major="모임" sub="댓글 관리" />

            <MyPageTable<MyGatheringCommentSimpleInfo, MyPageGatheringCommentColType>
              rows={rows}
              rowDef={rowDef}
              getRowKey={(r) => r.reply_code}
              renderColumn={renderColumn}
              setRowData={setRows}
              loadRowData={getMyGatheringCommentAll}
              searchRowData={searchMyGatheringComments}
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

export default MyPageGatheringComment;
