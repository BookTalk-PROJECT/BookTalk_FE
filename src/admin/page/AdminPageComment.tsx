import React, { useEffect, useState } from "react";
import MyPageSideBar from "../../mypage/component/MyPageSideBar";
import MyPageBreadCrumb from "../../mypage/component/MyPageBreadCrumb";
import MyPageTable from "../../mypage/component/MyPageTable";
import Pagenation from "../../common/component/Pagination";
import { adminCommentMockData } from "../../mypage/testdata/MyPageTestData"; // 예시 mock 데이터 import
import MyPageManageRowButton from "../../mypage/component/button/MyPageManageRowButton";
import MyPageActiveTabButton from "../../mypage/component/button/MyPageActiveTabButton";
import { ReplySimpleInfo } from "../../common/component/Board/type/BoardDetail.types";
import { MyPageBookCommentType } from "../../mypage/type/MyPageBoardTable";
import { getCommentAdminAll, recoverComment, restrictComment } from "../../mypage/api/MyPage";
import { Link } from "react-router-dom";
import DeleteModal from "../../mypage/component/DeleteModal";

const AdminPageComment: React.FC = () => {
  const [comments, setComments] = useState<ReplySimpleInfo[]>([]);
  const [postKeys, setPostKeys] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("전체");
  
  const row: { label: string; key: keyof MyPageBookCommentType }[] = [
    { label: "댓글 번호", key: "reply_code" },
    { label: "글 번호", key: "post_code" },
    { label: "댓글 내용", key: "content" },
    { label: "작성자", key: "author" },
    { label: "작성일", key: "date" },
    { label: "관리", key: "manage" },
    { label: "사유", key: "deleteReason" },
  ];

  const openDeleteModal = (code: string) => {
    setSelectedCode(code);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCode(null);
  };

  const loadComments = (pageNum: number) => {
    getCommentAdminAll(pageNum).then((res) => {
      setComments(res.data.content);
      setTotalPages(res.data.totalPages);
      setPostKeys(comments.length > 0 ? Object.keys(comments[0]) : []);
    });
  }

  const handleDelete = async (replyCode: string, deleteReason: string) => {
    await restrictComment(replyCode, deleteReason);
    loadComments(1);
  }

  const handleRecover = async (replyCode: string) => {
    if(confirm("게시글을 복구하시겠습니까?"))
      await recoverComment(replyCode);
    loadComments(1);
  }

  useEffect(() => {
    loadComments(1);
  }, []);
  const filterOption: { label: string; key: string }[] = [row[0], row[1], row[2], row[3]];

  const initialFilter: { label: string; key: string }[] = [row[1]];

  const renderRow = (post: any) => (
    <React.Fragment key={post.reply_code}>
      <tr className="hover:bg-gray-50 border-b">
        {row.map(({ key }) => {
          if (key === "reply_code") {
            return (
              <td key={key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {post[key]}
              </td>
            );
          } else if(key === "content") {
            return (
              <td key={key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                <Link to={`/boardDetail/${post["post_code"]}`}>
                  {post[key]}
                </Link>
              </td>
            );
          } else if (key === "manage") {
            return (
            <td key={key}>
              {post["delYn"] ? 
                <MyPageManageRowButton
                  actions={[
                    { label: "복구", color: "green", onClick: () => handleRecover(post.reply_code) },
                  ]}
                />
              :
                <MyPageManageRowButton
                  actions={[
                    { label: "삭제", color: "red", onClick: () => openDeleteModal(post.reply_code) },
                  ]}
                />
              }
            </td>
            )
          } else if (key === "deleteReason") {
            return (
              post[key] && 
              (<td key={key} className="relative group overflow-visible flex items-center justify-center px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="w-4 h-4 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  i
                </div>
                <div className="absolute z-50 hidden group-hover:block p-2 bg-gray-800 text-white text-xs rounded shadow-lg top-0 right-full mr-2 whitespace-normal min-w-20 w-auto">
                  삭제 사유: {post[key]}
                </div>
              </td>)
            );
          } else {
            return (
              <td key={key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {post[key]}
              </td>
            );
          }
        })}
      </tr>

      {/* 👇 확장 영역: 클릭된 row 아래에만 표시 */}
      {/* {expandedRowId === post.board_code && post.questions && (
        <tr>
          <td colSpan={row.length} className="px-6 py-4 bg-gray-50">
            <div className="space-y-2">
              {post.questions.map((q: any, index: number) => (
                <div key={index} className="text-sm">
                  <div className="font-medium">{q.question}</div>
                  <div className="ml-4 text-gray-700">⇒ {q.answer}</div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )} */}
    </React.Fragment>
  );
  return (
    <div className="flex min-h-screen bg-gray-50">
      <MyPageSideBar />

      <div className="flex-1 px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <MyPageBreadCrumb major="관리자" sub="댓글 관리" />
          <MyPageActiveTabButton
            actions={[
              { label: "전체", color: "blue"},
              { label: "커뮤니티", color: "yellow"},
              // { label: "북리뷰", color: "red"},
              // { label: "모임", color: "green"},
            ]}
            setActiveTab={setActiveTab}
          />

          <MyPageTable
            posts={comments}
            row={row}
            initialFilter={initialFilter}
            filterOptions={filterOption}
            postKeys={postKeys}
            renderRow={renderRow}
          />
          <Pagenation totalPages={totalPages} loadPageByPageNum={(num) => loadComments(num)} />     
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
