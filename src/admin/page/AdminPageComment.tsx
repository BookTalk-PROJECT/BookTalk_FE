import React, { useState } from "react";
import MyPageSideBar from "../../mypage/component/MyPageSideBar";
import BreadCrumb from "../../common/component/BreadCrumb";
import MyPageTable from "../../common/component/DataTableCustom";
import MyPageManageRowButton from "../../mypage/component/button/MyPageManageRowButton";
import MyPageActiveTabButton from "../../mypage/component/button/MyPageActiveTabButton";
import { ReplySimpleInfo } from "../../common/component/Board/type/BoardDetailTypes";
import { RowDef } from "../../common/type/common";
import { AdminCommentColType } from "../type/AdminCommunity";
import { Link } from "react-router-dom";
import DeleteModal from "../../mypage/component/DeleteModal";
import { getCommentAdminAll, recoverComment, restrictComment, searchCommentAdminAll } from "../api/admin";

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

  const [comments, setComments] = useState<ReplySimpleInfo[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("전체");

  const openDeleteModal = (code: string) => {
    setSelectedCode(code);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCode(null);
  };


  const handleDelete = async (replyCode: string, deleteReason: string) => {
    await restrictComment(replyCode, deleteReason);
    setComments(prev =>
      prev.map(reply =>
        reply.reply_code === replyCode
          ? { ...reply, delYn: true, deleteReason: deleteReason } // delYn만 변경
          : reply // 나머지는 그대로
      )
    );
  }

  const handleRecover = async (replyCode: string) => {
    if(confirm("게시글을 복구하시겠습니까?")) {
      await recoverComment(replyCode);
      setComments(prev =>
        prev.map(reply =>
          reply.reply_code === replyCode
            ? { ...reply, delYn: false, deleteReason: null } // delYn만 변경
            : reply // 나머지는 그대로
        )
      );
    }
  }

  const renderColumn = (row: any, key: Extract<keyof AdminCommentColType, string>) => {
    switch (key) {
      case "content":
      return <Link to={`/boardDetail/${row["post_code"]}`}>{row[key]}</Link>;
      case "manage":
      return (
        row["delYn"] ? 
          <MyPageManageRowButton actions={[{ label: "복구", color: "green", onClick: () => handleRecover(row.reply_code) },]}/> 
          : <MyPageManageRowButton actions={[{ label: "삭제", color: "red", onClick: () => openDeleteModal(row.reply_code) },]}/>
      );
      case "deleteReason":
      return row["deleteReason"] ? (
        <td className="relative group overflow-visible flex items-center justify-center px-4 py-4 whitespace-nowrap text-sm text-gray-500">
          <div className="w-4 h-4 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xl font-bold">i</div>
          <div className="absolute z-50 hidden group-hover:block p-2 bg-gray-800 text-white text-xs rounded shadow-lg top-0 right-full mr-2 whitespace-normal min-w-20 w-auto">
            삭제 사유: {row[key]}
          </div>
        </td>
      ) : <></>;
      default:
      return <>{row[key]}</>;
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MyPageSideBar />
      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            <BreadCrumb major="관리자" sub="댓글 관리" />
            <MyPageActiveTabButton
              actions={[
                { label: "전체", color: "blue"},
                { label: "커뮤니티", color: "yellow"},
                // { label: "북리뷰", color: "red"},
                // { label: "모임", color: "green"},
              ]}
              setActiveTab={setActiveTab}
            />
            <MyPageTable<ReplySimpleInfo, AdminCommentColType>
              rows={comments}
              rowDef={rowDef}
              getRowKey={(reply) => reply.reply_code}
              renderColumn={renderColumn}
              setRowData={setComments}
              loadRowData={getCommentAdminAll}
              searchRowData={searchCommentAdminAll}
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
