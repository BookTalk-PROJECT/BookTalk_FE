import React, { useState, useEffect, useRef } from "react";
import Pagenation from "../../common/component/Pagination";
import MyPageSideBar from "../../mypage/component/MyPageSideBar";
import MyPageTable from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import MyPageManageRowButton from "../../mypage/component/button/MyPageManageRowButton";
import { getAllMember, updateMemberRole } from "../api/role";
import { Memberboard } from "../type/role";
import { AdminRoleColType } from "../type/AdminRole";
import { RowDef } from "../../common/type/common";

import {
  getMemberAdminAll,
  searchMemberAdminAll,
} from "../api/admin";
import { AuthorityType } from "../../common/auth/type/type";


const AdminRoleManage: React.FC = () => {
  const [memberList, setMemberList] = useState<Memberboard[]>([]);

  const manageButtonRef = useRef(null);

  const [forceUpdate, setForceUpdate] = useState(0);

  // useEffect(() => {
  //   getAllMember().then((res) => {
  //     setMemberList(res.data);
  //   });
  // }, []);

  const rowDef: RowDef<AdminRoleColType>[] = [
    { label: "번호", key: "id", isSortable: true, isSearchType: false },
    { label: "아이디", key: "email", isSortable: true, isSearchType: true },
    { label: "이름", key: "name", isSortable: true, isSearchType: true },
    { label: "가입 일자", key: "joinDate", isSortable: true, isSearchType: false },
    { label: "권한 상태", key: "authority", isSortable: true, isSearchType: false },
    { label: "관리", key: "manage", isSortable: true, isSearchType: false },
  ];

// 권한 변경 핸들러
  // 권한 변경 핸들러
  const handleRole = async (memberId: string, currentRole: string) => {
    // 2. targetRole 계산 (AuthorityType에 맞는 문자열이어야 함)
    const targetRole = currentRole === "ADMIN" ? "COMMON" : "ADMIN";
    const targetRoleName = targetRole === "ADMIN" ? "관리자" : "일반유저";

    if (confirm(`해당 회원을 '${targetRoleName}' 권한으로 변경하시겠습니까?`)) {
      try {
        // API 호출 (API가 number를 요구한다면 Number(memberId)로 변환 필요, string이면 그대로 전달)
        await updateMemberRole(Number(memberId), targetRole);
        // 만약 백엔드 API가 id를 string으로 받는다면: await updateMemberRole(memberId, targetRole);

        setMemberList((prev) =>
          prev.map((member) =>
            member.id === memberId
              ? {
                ...member,
                // 3. authority 타입을 명시적으로 단언 (as AuthorityType)
                authority: targetRole as AuthorityType
              } as Memberboard // 4. 최종 객체를 Memberboard 타입으로 단언하여 에러 해결
              : member
          )
        );
        alert(`성공적으로 ${targetRoleName}로 변경되었습니다.`);

        setForceUpdate((prev) => prev + 1);
      } catch (error) {
        console.error(error);
        alert("권한 변경 중 오류가 발생했습니다.");
      }
    }
  };

  const renderColumn = (row: Memberboard, key: Extract<keyof AdminRoleColType, string>) => {
    switch (key) {
      case "authority":
        // 4. 여기서도 문자열 "ADMIN"이 아니라 Enum 사용
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              row.authority === AuthorityType.ADMIN
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {row.authority === AuthorityType.ADMIN ? "관리자" : "일반유저"}
          </span>
        );
      case "manage":
        // 5. Enum 비교 및 함수 호출 시 Enum 전달
        return row.authority === AuthorityType.ADMIN ? (
          <MyPageManageRowButton
            actions={[
              {
                label: "일반유저로 변경",
                color: "blue",
                onClick: () => handleRole(row.id, row.authority)
              }
            ]}
          />
        ) : (
          <MyPageManageRowButton
            actions={[
              {
                label: "관리자로 변경",
                color: "red",
                onClick: () => handleRole(row.id, row.authority)
              }
            ]}
          />
        );
      default:
        return <>{row[key as keyof Memberboard]}</>;
    }
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
              rows={memberList}
              rowDef={rowDef}
              getRowKey={(member) => member.id}
              renderColumn={renderColumn}
              setRowData={setMemberList}
              loadRowData={getMemberAdminAll}
              searchRowData={searchMemberAdminAll}
              forceUpdate={forceUpdate}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminRoleManage;
