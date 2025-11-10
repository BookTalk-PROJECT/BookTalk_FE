import React, { useState, useEffect, useMemo } from "react";
import MyPageSideBar from "../component/MyPageSideBar";
import Pagenation from "../../common/component/Pagination";
import MyPageTable from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import { myGatheringRequestMockData } from "../testdata/MyPageTestData";
import MyPageManageRowButton from "../component/button/MyPageManageRowButton";
import { MyPageGatheringRequestManageType } from "../type/MyPageTable";

const MyPageBookGatheringApprovalManage: React.FC = () => {
  const row: { label: string; key: keyof MyPageGatheringRequestManageType }[] = [
    { label: "번호", key: "id" },
    { label: "모임명", key: "gathering" },
    { label: "분류", key: "category" },
    { label: "신청 일시", key: "date" },
    { label: "상태", key: "status" },
    { label: "관리", key: "manage" },
  ];

  {
    /* 초기 검색 필터*/
  }
  const filterOption: { label: string; key: string }[] = [row[0], row[1], row[2]];

  const initialFilter: { label: string; key: string }[] = [row[1]];

  const postKeys = myGatheringRequestMockData.length > 0 ? Object.keys(myGatheringRequestMockData[0]) : [];

  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
      <MyPageSideBar />
      {/* 메인 컨텐츠 */}
      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            {/* 브레드크럼 */}
            <BreadCrumb major="모임" sub="신청 승인 관리" />
            {/* 테이블 */}
            <MyPageTable
              posts={myGatheringRequestMockData}
              row={row}
              isExpandableRow={true}
              initialFilter={initialFilter}
              filterOptions={filterOption}
              manageOption={
                <MyPageManageRowButton
                  actions={[
                    { label: "승인", color: "green", onClick: () => alert("승인") },
                    { label: "거절", color: "red", onClick: () => alert("거절") },
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

export default MyPageBookGatheringApprovalManage;
