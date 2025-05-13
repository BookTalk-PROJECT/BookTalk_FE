import React, { useState, useEffect, useMemo } from "react";
import MyPageSideBar from "../component/MyPageSideBar";
import Pagenation from "../../common/component/Pagination";
import MyPageTable from "../component/MyPageTable";
import MyPageBreadCrumb from "../component/MyPageBreadCrumb";
import { bookPostMockData } from "../testdata/MyPageTestData";
import MyPageManageRowButton from "../component/button/MyPageManageRowButton";
import { MyPageBoardType } from "../type/MyPageBoardTable";

const MyPageBookReviewBoard: React.FC = () => {

  const row: { label: string; key: keyof MyPageBoardType }[] = [
    { label: "게시물 번호", key: "id" },
    { label: "제목", key: "title" },
    { label: "분류", key: "category" },
    { label: "날짜", key: "date" },
    { label: "관리", key: "manage" },
  ];

  {/* 초기 검색 필터*/}
  const filterOption: { label: string; key: string}[] = [
    row[0],
    row[1],
    row[2],
    row[3],
  ];

  const initialFilter: { label: string; key: string}[] = [
    row[1]
  ];

  const postKeys = bookPostMockData.length > 0 ? Object.keys(bookPostMockData[0]) : [];

  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
        <MyPageSideBar />
      {/* 메인 컨텐츠 */}
      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            {/* 브레드크럼 */}
            <MyPageBreadCrumb major="북리뷰" sub="게시글 관리" />
            {/* 테이블 */}
            <MyPageTable
              posts={bookPostMockData}
              row={row}
              initialFilter={initialFilter}
              filterOptions={filterOption}
              manageOption={<MyPageManageRowButton actions={[{ label: "수정", color: "green", onClick: () => alert("수정") },
                { label: "삭제", color: "red", onClick: () => alert("삭제") }]} />}
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



export default MyPageBookReviewBoard;
