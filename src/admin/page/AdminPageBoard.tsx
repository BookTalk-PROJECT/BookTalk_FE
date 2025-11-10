import React, { useState } from "react";
import MyPageSideBar from "../../mypage/component/MyPageSideBar";
import BreadCrumb from "../../common/component/BreadCrumb";
import MyPageTable from "../../common/component/DataTableCustom";
import MyPageManageRowButton from "../../mypage/component/button/MyPageManageRowButton";
import MyPageActiveTabButton from "../../mypage/component/button/MyPageActiveTabButton";
import { RowDef } from "../../common/type/common";
import { AdminBoardColType } from "../type/AdminCommunity";
import { PostSimpleInfo } from "../../common/component/Board/type/BoardDetailTypes";
import { Link } from "react-router-dom";
import DeleteModal from "../../mypage/component/DeleteModal";
import { getBoardAdminAll, recoverBoard, restrictBoard, searchBoardAdminAll } from "../api/admin";

const AdminPageBoard: React.FC = () => {
  const rowDef: RowDef<AdminBoardColType>[] = [
    { label: "게시물 번호", key: "board_code", isSortable: true, isSearchType: true },
    { label: "제목", key: "title", isSortable: true, isSearchType: true },
    { label: "분류", key: "category", isSortable: true, isSearchType: true },
    { label: "작성자", key: "author", isSortable: true, isSearchType: true },
    { label: "날짜", key: "date", isSortable: true, isSearchType: false },
    { label: "관리", key: "manage", isSortable: true, isSearchType: false },
    { label: "사유", key: "deleteReason", isSortable: true, isSearchType: false },
  ];
  const [posts, setPosts] = useState<PostSimpleInfo[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("전체");

  const handleDelete = async (boardCode: string, deleteReason: string) => {
    await restrictBoard(boardCode, deleteReason);
    setPosts(prev =>
      prev.map(post =>
        post.board_code === boardCode
          ? { ...post, delYn: true, deleteReason: deleteReason } // delYn만 변경
          : post // 나머지는 그대로
      )
    );
  }

  const handleRecover = async (boardCode: string) => {
    if(confirm("게시글을 복구하시겠습니까?")) {
      await recoverBoard(boardCode);
      setPosts(prev =>
        prev.map(post =>
          post.board_code === boardCode
            ? { ...post, delYn: false, deleteReason: null } // delYn만 변경
            : post // 나머지는 그대로
        )
      );
    }
  }

  const openDeleteModal = (code: string) => {
    setSelectedCode(code);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCode(null);
  };

  const renderColumn = (row: any, key: Extract<keyof AdminBoardColType, string>) => {
    switch (key) {
      case "title":
      return <Link to={`/boardDetail/${row["board_code"]}`}>{row[key]}</Link>;
      case "manage":
      return (
        row["delYn"] ? 
          <MyPageManageRowButton actions={[{ label: "복구", color: "green", onClick: () => handleRecover(row.board_code) },]}/> 
          : <MyPageManageRowButton actions={[{ label: "삭제", color: "red", onClick: () => openDeleteModal(row.board_code) },]}/>
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
            <BreadCrumb major="관리자" sub="게시물 관리" />
            <MyPageActiveTabButton
              actions={[
                { label: "전체", color: "blue"},
                { label: "커뮤니티", color: "yellow"},
                // { label: "북리뷰", color: "red"},
                // { label: "모임", color: "green"},
              ]}
              setActiveTab={setActiveTab}
            />
            <MyPageTable<PostSimpleInfo, AdminBoardColType>
              rows={posts}
              rowDef={rowDef}
              getRowKey={(post) => post.board_code}
              renderColumn={renderColumn}
              setRowData={setPosts}
              loadRowData={getBoardAdminAll}
              searchRowData={searchBoardAdminAll}
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

export default AdminPageBoard;
