import React, { useState, useEffect, useMemo } from "react";
import MyPageSideBar from "../component/MyPageSideBar";
import Pagenation from "../../common/component/Pagination";
import MyPageTable from "../component/MyPageTable";
import MyPageBreadCrumb from "../component/MyPageBreadCrumb";
import { myBookCommentMockData } from "../testdata/MyPageTestData";
import MyPageManageButton from "../component/MyPageManageButton";
import { MyPageBookCommentType } from "../type/MyPageBoardTable";

const MyPageBookReviewComment: React.FC = () => {
  const row: { label: string; key: keyof MyPageBookCommentType }[] = [
    { label: "번호", key: "id" },
    { label: "글 제목", key: "title" },
    { label: "작성자", key: "author" },
    { label: "내용", key: "content" },
    { label: "작성일", key: "date" },
    { label: "관리", key: "manage" },
  ];

  {
    /* 초기 검색 필터*/
  }
  const filterOption: { label: string; key: string }[] = [row[0], row[1], row[2], row[3]];

  const initialFilter: { label: string; key: string }[] = [row[1]];

  const postKeys = myBookCommentMockData.length > 0 ? Object.keys(myBookCommentMockData[0]) : [];

  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
      <MyPageSideBar />
      {/* 메인 컨텐츠 */}
      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            {/* 브레드크럼 */}
            <MyPageBreadCrumb major="모임" sub="내 모임" />
            {/* 테이블 */}
            <MyPageTable
              posts={myBookCommentMockData}
              row={row}
              initialFilter={initialFilter}
              filterOptions={filterOption}
              manageOption={
                <MyPageManageButton
                  actions={[
                    { label: "수정", color: "green", onClick: () => alert("수정") },
                    { label: "삭제", color: "red", onClick: () => alert("삭제") },
                  ]}
                />
              }
              postKeys={postKeys}
            />
            {/* 페이지네이션 */}
            <Pagenation totalPages={10} loadPageByPageNum={() => {}} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyPageBookReviewComment;
