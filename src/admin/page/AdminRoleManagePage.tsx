import React, { useCallback } from "react";
import MyPageSideBar from "../../mypage/component/MyPageSideBar";
import DataTableCustom from "../../common/component/DataTableCustom";
import BreadCrumb from "../../common/component/BreadCrumb";
import MyPageManageRowButton from "../../mypage/component/button/MyPageManageRowButton";
import { updateMemberRole } from "../api/role";
import { Memberboard } from "../type/role";
import { AdminRoleColType } from "../type/AdminRole";
import { RowDef } from "../../common/type/common";

import { getMemberAdminAll, searchMemberAdminAll } from "../api/admin";
import { AuthorityType } from "../../common/auth/type/type";
import { usePaginatedData } from "../../common/hooks/usePaginatedData";

const AdminRoleManage: React.FC = () => {
  const rowDef: RowDef<AdminRoleColType>[] = [
    { label: "번호", key: "id", isSortable: true, isSearchType: false },
    { label: "아이디", key: "email", isSortable: true, isSearchType: true },
    { label: "이름", key: "name", isSortable: true, isSearchType: true },
    { label: "가입 일자", key: "joinDate", isSortable: true, isSearchType: false },
    { label: "권한 상태", key: "authority", isSortable: true, isSearchType: false },
    { label: "관리", key: "manage", isSortable: true, isSearchType: false },
  ];

  // 커스텀 훅 사용
  const {
    data: memberList,
    totalPages,
    currentPage,
    isLoading,
    error,
    goToPage,
    search,
    resetSearch,
    refresh,
  } = usePaginatedData<Memberboard>({
    fetchData: getMemberAdminAll,
    searchData: searchMemberAdminAll,
  });

  // 권한 변경 핸들러
  const handleRole = useCallback(async (memberId: string, currentRole: string) => {
    const targetRole = currentRole === "ADMIN" ? "COMMON" : "ADMIN";
    const targetRoleName = targetRole === "ADMIN" ? "관리자" : "일반유저";

    if (confirm(`해당 회원을 '${targetRoleName}' 권한으로 변경하시겠습니까?`)) {
      try {
        await updateMemberRole(Number(memberId), targetRole);
        alert(`성공적으로 ${targetRoleName}로 변경되었습니다.`);
        refresh();
      } catch (error) {
        console.error(error);
        alert("권한 변경 중 오류가 발생했습니다.");
      }
    }
  }, [refresh]);

  const renderColumn = useCallback((row: Memberboard, key: Extract<keyof AdminRoleColType, string>) => {
    switch (key) {
      case "authority":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              row.authority === AuthorityType.ADMIN ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
            }`}>
            {row.authority === AuthorityType.ADMIN ? "관리자" : "일반유저"}
          </span>
        );
      case "manage":
        return row.authority === AuthorityType.ADMIN ? (
          <MyPageManageRowButton
            actions={[
              {
                label: "일반유저로 변경",
                color: "blue",
                onClick: () => handleRole(row.id, row.authority),
              },
            ]}
          />
        ) : (
          <MyPageManageRowButton
            actions={[
              {
                label: "관리자로 변경",
                color: "red",
                onClick: () => handleRole(row.id, row.authority),
              },
            ]}
          />
        );
      default:
        return <>{row[key as keyof Memberboard]}</>;
    }
  }, [handleRole]);

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
            <DataTableCustom<Memberboard, AdminRoleColType>
              rows={memberList}
              rowDef={rowDef}
              getRowKey={(member) => member.id}
              renderColumn={renderColumn}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={goToPage}
              isLoading={isLoading}
              error={error}
              searchEnabled={true}
              onSearch={search}
              onResetSearch={resetSearch}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminRoleManage;
