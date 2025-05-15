import React, { useEffect, useState } from "react";
import MyPageSideBar from "../../mypage/component/MyPageSideBar";
import MyPageBreadCrumb from "../../mypage/component/MyPageBreadCrumb";
import MyPageTable from "../../mypage/component/MyPageTable";
import Pagenation from "../../common/component/Pagination";
import { adminBoardMockData } from "../../mypage/testdata/MyPageTestData"; // 예시 mock 데이터 import
import MyPageManageRowButton from "../../mypage/component/button/MyPageManageRowButton";
import MyPageActiveTabButton from "../../mypage/component/button/MyPageActiveTabButton";

const AdminPageBoard: React.FC = () => {

  const row = [
    { label: "번호", key: "id" },
    { label: "글 제목", key: "title" },
    { label: "작성자", key: "author" },
    { label: "분류", key: "category" },
    { label: "작성일", key: "date" },
    { label: "관리", key: "manage" },
    { label: "삭제사유", key: "deleteReason" },
  ];

  const filterOptions = [row[1], row[2], row[3], row[4]];
  const initialFilter = [row[1]];

  const postKeys = adminBoardMockData.length > 0 ? Object.keys(adminBoardMockData[0]) : [];

  const [activeTab, setActiveTab] = useState("전체");

  console.log(activeTab);

  // 탭 필터링 로직
  var filteredPosts =
    activeTab === "전체"
      ? adminBoardMockData
      : adminBoardMockData.filter((post) => post.category === activeTab);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MyPageSideBar />

      <div className="flex-1 px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <MyPageBreadCrumb major="관리자" sub="게시물 관리" />
          <MyPageActiveTabButton actions={[
            { label: "전체", color: "blue", onClick: () => alert("전체") },
            { label: "커뮤니티", color: "yellow", onClick: () => alert("커뮤니티") },
            { label: "북리뷰", color: "red", onClick: () => alert("북리뷰") },
            { label: "모임", color: "green", onClick: () => alert("모임") }
          ]} setActiveTab={setActiveTab} />

          <MyPageTable
            posts={filteredPosts}
            row={row}
            isExpandableRow={false}
            filterOptions={filterOptions}
            initialFilter={initialFilter}
            manageOption={
              <MyPageManageRowButton
                actions={[
                  { label: "복구", color: "blue", onClick: () => alert("복구") },
                ]}
              />
            }
            postKeys={postKeys}
            activeTab = {activeTab}
          />

          <Pagenation totalPages={10} loadPageByPageNum={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default AdminPageBoard;
