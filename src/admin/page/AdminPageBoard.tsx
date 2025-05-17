import React, { useEffect, useState } from "react";
import MyPageSideBar from "../../mypage/component/MyPageSideBar";
import MyPageBreadCrumb from "../../mypage/component/MyPageBreadCrumb";
import MyPageTable from "../../mypage/component/MyPageTable";
import Pagenation from "../../common/component/Pagination";
import { adminBoardMockData } from "../../mypage/testdata/MyPageTestData"; // 예시 mock 데이터 import
import MyPageManageButton from "../../mypage/component/MyPageManageButton";

const AdminPageBoard: React.FC = () => {
  const row = [
    { label: "번호", key: "id" },
    { label: "글 제목", key: "title" },
    { label: "작성자", key: "author" },
    { label: "분류", key: "category" },
    { label: "작성일", key: "date" },
    { label: "관리", key: "manage" },
  ];

  const filterOptions = [row[1], row[2], row[3], row[4]];
  const initialFilter = [row[1]];

  const postKeys = adminBoardMockData.length > 0 ? Object.keys(adminBoardMockData[0]) : [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MyPageSideBar />

      <div className="flex-1 px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <MyPageBreadCrumb major="관리자" sub="게시물 관리" />
          <MyPageTable
            posts={adminBoardMockData}
            row={row}
            filterOptions={filterOptions}
            initialFilter={initialFilter}
            manageOption={
              <MyPageManageButton actions={[{ label: "복구", color: "blue", onClick: () => alert("복구") }]} />
            }
            postKeys={postKeys}
          />

          <Pagenation totalPages={10} loadPageByPageNum={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default AdminPageBoard;
