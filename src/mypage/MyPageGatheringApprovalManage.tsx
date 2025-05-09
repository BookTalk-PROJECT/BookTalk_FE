import React, { useState, useEffect, useMemo } from "react";
import MyPageSideBar from "../common/component/MyPageSideBar";
import Pagenation from "../common/component/Pagination";
import MyPageTable from "../common/component/MyPageTable";
import MyPageBreadCrumb from "../common/component/MyPageBreadCrumb";
import { myGatheringRequestMockData } from "../common/testdata/MyPageTestData";
import { MyPageGatheringRequestManageType } from "../common/type/MyPageBoardTable";

const MyPageGatheringApprovalManage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("모임명");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof MyPageGatheringRequestManageType>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const colCount = 5;
  const filterOption = ["모임명", "분류"];

  const toggleExpand = (id: number) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handleSort = (field: keyof MyPageGatheringRequestManageType) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = myGatheringRequestMockData.filter((item) => {
      if (selectedFilter === "모임명") return item.gathering.includes(searchTerm);
      if (selectedFilter === "분류") return item.category.includes(searchTerm);
      return true;
    });

    return [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // 날짜 필드는 Date로 파싱
      if (sortField === "date") {
        return sortOrder === "asc"
          ? new Date(aValue as string).getTime() - new Date(bValue as string).getTime()
          : new Date(bValue as string).getTime() - new Date(aValue as string).getTime();
      }

      // 숫자 비교
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      // 문자열 비교
      return sortOrder === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [searchTerm, selectedFilter, sortField, sortOrder]);

  const renderHeader = () => (
    <tr>
      {["gathering", "category", "date"].map((key) => {
        const labelMap: Record<string, string> = {
          gathering: "모임명",
          category: "분류",
          date: "신청 일시",
        };
        return (
          <th
            key={key}
            onClick={() => handleSort(key as keyof MyPageGatheringRequestManageType)}
            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer"
          >
            <span className="inline-flex items-center gap-1">
              {labelMap[key]}
              {sortField === key ? (
                sortOrder === "asc" ? (
                  <i className="fas fa-sort-up" />
                ) : (
                  <i className="fas fa-sort-down" />
                )
              ) : (
                <i className="fas fa-sort text-gray-300" />
              )}
            </span>
          </th>
        );
      })}
      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">상태</th>
      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">관리</th>
    </tr>
  );

  const renderRow = (item: MyPageGatheringRequestManageType) => (
    <React.Fragment key={item.id}>
      <tr
        onClick={() => toggleExpand(item.id)}
        className="hover:bg-gray-50 border-b cursor-pointer"
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.gathering}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.status}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <button className="text-green-500 hover:text-green-700 mr-2">승인</button>
          <span className="text-gray-500">┆</span>
          <button className="text-red-500 hover:text-red-700 ml-2">거절</button>
        </td>
      </tr>
      {expandedRow === item.id && (
        <tr>
          <td colSpan={6} className="px-6 py-4 bg-gray-50">
            <div className="space-y-2">
              {item.questions.map((q, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-medium">{q.question}</div>
                  <div className="ml-4 text-gray-700">⇒ {q.answer}</div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <MyPageSideBar />
      <div className="ml-60 flex-1 flex flex-col bg-white rounded-lg shadow-md">
        <main>
          <div className="w-full max-w-none mx-auto">
            <MyPageBreadCrumb major="모임" sub="신청 승인 관리" />
            <MyPageTable
              posts={filteredAndSortedPosts}
              filterOptions={filterOption}
              selectedFilter={selectedFilter}
              onChangeFilter={setSelectedFilter}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              onSearchClick={() => {}}
              renderHeader={renderHeader}
              renderRow={renderRow}
              colCount={colCount}
            />
            <Pagenation totalPages={1} loadPageByPageNum={() => {}} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPageGatheringApprovalManage;
