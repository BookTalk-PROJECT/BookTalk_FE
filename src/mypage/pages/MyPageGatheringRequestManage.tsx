import React, { useState, useEffect, useMemo } from "react";
import MyPageSideBar from "../component/MyPageSideBar";
import Pagenation from "../../common/component/Pagination";
import MyPageTable from "../component/MyPageTable";
import MyPageBreadCrumb from "../component/MyPageBreadCrumb";
import { myGatheringPostMockData } from "../testdata/MyPageTestData";
import MyPageManageButton from "../component/MyPageManageButton";
import { MyPageMyGatheringType } from "../type/MyPageBoardTable";

const MyPageGatheringBoard: React.FC = () => {

  const row: { label: string; key: keyof MyPageMyGatheringType }[] = [
    { label: "게시물 번호", key: "id" },
    { label: "모임명", key:"gathering"},
    { label: "분류", key:"category"},
    { label: "신청 일시", key: "date" },
    { label: "상태", key:"status"},
    { label: "관리", key: "manage" }
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

  const postKeys = myGatheringPostMockData.length > 0 ? Object.keys(myGatheringPostMockData[0]) : [];

  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
        <MyPageSideBar />
      {/* 메인 컨텐츠 */}
      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            {/* 브레드크럼 */}
            <MyPageBreadCrumb major="모임" sub="모임 신청 관리" />
            {/* 테이블 */}
            <MyPageTable
              posts={myGatheringPostMockData}
              row={row}
              initialFilter={initialFilter}
              filterOptions={filterOption}
              manageOption={<MyPageManageButton actions={[{ label: "신청 철회", color: "gray", onClick: () => alert("신청 철회")}]} />}
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



export default MyPageGatheringBoard;