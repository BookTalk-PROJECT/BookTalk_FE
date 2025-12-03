import React, { useState, useEffect, useRef } from "react";
import Pagenation from "../../common/component/Pagination";
import MyPageSideBar from "../../mypage/component/MyPageSideBar";
import MyPageTable from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import MyPageManageRowButton from "../../mypage/component/button/MyPageManageRowButton";
import { getAllMember } from "../api/role";
import { Memberboard } from "../type/role";
import Button from "../../common/component/Button";

const AdminRoleManage: React.FC = () => {
  const [memberList, setMemberList] = useState<Memberboard[]>([]);

  const manageButtonRef = useRef(null);

  useEffect(() => {
    getAllMember().then((res) => {
      setMemberList(res.data);
    });
  }, []);

  const row: { label: string; key: keyof Memberboard }[] = [
    { label: "번호", key: "id" },
    { label: "아이디", key: "email" },
    { label: "이름", key: "name" },
    { label: "가입 일자", key: "joinDate" },
    { label: "권한 상태", key: "authority" },
    { label: "관리", key: "manage" },
  ];

  const filterOption: { label: string; key: string }[] = [row[0], row[1], row[2], row[3]];

  const initialFilter: { label: string; key: string }[] = [row[1]];

  const postKeys = memberList.length > 0 ? Object.keys(memberList[0]) : [];

  const handleClick = () => {
    console.log("Button clicked!");
  };

  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
      <MyPageSideBar />
      {/* 메인 컨텐츠 */}
      <div className="flex-1 bg-gray-50 py-8 px-6 overflow-auto">
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          <main className="space-y-6">
            {/* 브레드크럼 */}
            <BreadCrumb major="관리자" sub="권한 관리" />
            {/* 테이블 */}
            <MyPageTable
              posts={memberList}
              row={row}
              initialFilter={initialFilter}
              filterOptions={filterOption}
              manageOption={
                <MyPageManageRowButton actions={[{ label: "수정", color: "green", onClick: handleClick }]} />
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

export default AdminRoleManage;
