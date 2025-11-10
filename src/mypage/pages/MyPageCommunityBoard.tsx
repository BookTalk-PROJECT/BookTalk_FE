import React, { useState } from "react";
import MyPageSideBar from "../component/MyPageSideBar";
import MyPageTable from "../../common/component/DataTableCustom";
import MyPageBreadCrumb from "../component/MyPageBreadCrumb";
import { MyPageBoardType, RowDef } from "../type/MyPageTable";
import { PostSimpleInfo } from "../../common/component/Board/type/BoardDetail.types";
import { getMyBoardAll, searchMyBoards } from "../api/MyPage";
import { Link } from "react-router-dom";

const MyPageCommunityBoard: React.FC = () => {
  const rowDef: RowDef<MyPageBoardType>[] = [
    { label: "게시물 번호", key: "board_code", isSortable: true, isSearchType: true },
    { label: "제목", key: "title", isSortable: true, isSearchType: true },
    { label: "분류", key: "category", isSortable: true, isSearchType: true },
    { label: "날짜", key: "date", isSortable: true, isSearchType: false }
  ];

  const [posts, setPosts] = useState<PostSimpleInfo[]>([]);

  const renderColumn = (row: any, key: Extract<keyof MyPageBoardType, string>) => {
    switch (key) {
      case "title":
      return (
        <Link to={`/boardDetail/${row["board_code"]}`}>{row[key]}</Link>
      );
      default:
      return (
        <>{row[key]}</>
      );
    }
  }

  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
      <MyPageSideBar />
      {/* 메인 컨텐츠 */}
      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            <MyPageBreadCrumb major="커뮤니티" sub="게시글 관리" />
            <MyPageTable<PostSimpleInfo, MyPageBoardType>
              rows={posts}
              rowDef={rowDef}
              getRowKey={(post) => post.board_code}
              renderColumn={renderColumn}
              setRowData={setPosts}
              loadRowData={getMyBoardAll}
              searchRowData={searchMyBoards}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyPageCommunityBoard;
