import React, { useState, useEffect, useMemo } from "react";
import MyPageSideBar from "../component/MyPageSideBar";
import Pagenation from "../../common/component/Pagination";
import MyPageTable from "../component/MyPageTable";
import MyPageBreadCrumb from "../component/MyPageBreadCrumb";
import { MyPageBoardType } from "../type/MyPageBoardTable";
import { PostSimpleInfo } from "../../common/component/Board/type/BoardDetail.types";
import { getBoardAdminAll, recoverBoard, restrictBoard } from "../api/MyPage";
import DeleteModal from "../component/DeleteModal";
import MyPageManageRowButton from "../component/button/MyPageManageRowButton";
import { Link } from "react-router-dom";

const MyPageCommunityBoard: React.FC = () => {
  const [posts, setPosts] = useState<PostSimpleInfo[]>([]);
  const [postKeys, setPostKeys] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);

  const loadBoards = (pageNum: number) => {
    getBoardAdminAll(pageNum).then((res) => {
      setPosts(res.data.content);
      setTotalPages(res.data.totalPages);
      setPostKeys(posts.length > 0 ? Object.keys(posts[0]) : []);
    });
  }

  const handleDelete = async (boardCode: string, deleteReason: string) => {
    await restrictBoard(boardCode, deleteReason);
    loadBoards(1);
  }

  const handleRecover = async (boardCode: string) => {
    if(confirm("게시글을 복구하시겠습니까?"))
      await recoverBoard(boardCode);
    loadBoards(1);
  }
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const openDeleteModal = (code: string) => {
    setSelectedCode(code);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCode(null);
  };

  useEffect(() => {
    loadBoards(1);
  }, []);

  const row: { label: string; key: keyof MyPageBoardType }[] = [
    { label: "게시물 번호", key: "board_code" },
    { label: "제목", key: "title" },
    { label: "분류", key: "category" },
    { label: "날짜", key: "date" },
    { label: "관리", key: "manage" },
    { label: "사유", key: "deleteReason" },
  ];

  const filterOption: { label: string; key: string }[] = [row[0], row[1], row[2], row[3]];

  const initialFilter: { label: string; key: string }[] = [row[1]];

  const renderRow = (post: any) => (
    <React.Fragment key={post.board_code}>
      <tr className="hover:bg-gray-50 border-b">
        {row.map(({ key }) => {
          if (key === "board_code") {
            return (
              <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {post[key]}
              </td>
            );
          } else if(key === "title") {
            return (
              <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Link to={`/boardDetail/${post["board_code"]}`}>
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
                    { label: "복구", color: "green", onClick: () => handleRecover(post.board_code) },
                  ]}
                />
              :
                <MyPageManageRowButton
                  actions={[
                    { label: "삭제", color: "red", onClick: () => openDeleteModal(post.board_code) },
                  ]}
                />
              }
            </td>
            )
          } else if (key === "deleteReason") {
            return (
              post[key] && 
              (<td key={key} className="relative group overflow-visible flex items-center justify-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
              <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
    <div className="flex h-screen">
      {/* 사이드바 */}
      <MyPageSideBar />
      {/* 메인 컨텐츠 */}
      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            {/* 브레드크럼 */}
            <MyPageBreadCrumb major="커뮤니티" sub="게시글 관리" />
            {/* 테이블 */}
            <MyPageTable<PostSimpleInfo>
              posts={posts}
              row={row}
              initialFilter={initialFilter}
              filterOptions={filterOption}
              postKeys={postKeys}
              renderRow={renderRow}
            />
            {/* 페이지네이션 */}
            <Pagenation totalPages={totalPages} loadPageByPageNum={(num) => loadBoards(num)} />
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

export default MyPageCommunityBoard;
