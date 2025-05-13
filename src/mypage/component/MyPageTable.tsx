import React, { useMemo, useState } from "react";
import { MyPageTableProps } from "../type/MyPageBoardTable";

const MyPageTable = <T extends { [key: string]: any }>({
  posts,
  row,
  filterOptions,
  initialFilter,
  manageOption,
  postKeys,
  activeTab,
}: MyPageTableProps<T>) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  {
    /* 선택된 검색 필터*/
  }
  const [selectedFilter, setSelectedFilter] = useState(initialFilter[0]);

  {
    /* 검색어 */
  }
  const [searchTerm, setSearchTerm] = useState("");
  {
    /* 정렬 기준 컬럼 */
  }
  const [sortField, setSortField] = useState<keyof T>("date");
  {
    /* 오름차순, 내림차순 */
  }
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  {
    /* 정렬 필드 설정 함수 */
  }
  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      //이미 해당 필드일 시 정렬만 해줌
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      //현재 정렬 필드와 다른 필드일시 셋 해주고 오름차순
      setSortField(field);
      setSortOrder("asc");
    }
  };

  {
    /* 테이블 행 데이터 정렬 후 출력 값 */
  }
  const filteredAndSortedPosts = useMemo(() => {
    // 1. 검색 필터 적용
    const filtered = posts.filter((post) => {
      const targetValue = (() => {
        if (postKeys.includes(selectedFilter.key)) {
          if (typeof post[selectedFilter.key] === "string") {
            return post[selectedFilter.key];
          } else if (typeof post[selectedFilter.key] === "number") {
            return String(post[selectedFilter.key]);
          } else {
            return "";
          }
        }
      })();

      return targetValue.includes(searchTerm);
    });
    console.log(posts);
    // 2. 정렬 적용
    return [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortField === "date") {
        return sortOrder === "asc"
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortOrder === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [sortField, sortOrder, searchTerm, selectedFilter, activeTab]);

  const renderHeader = () => (
    <tr>
      {row.map(({ label, key }) => {
        if (key === "manage" || key === "deleteReason") {
          return (
            <th
              key="manage"
              onClick={() => handleSort("manage")}
              className="px-4 py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap cursor-pointer">
              <span>{label}</span>
            </th>
          );
        } else {
          return (
            <th
              key={String(key)}
              onClick={() => handleSort(key)}
              className="px-4 py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap cursor-pointer">
              <span className="inline-flex items-center gap-1">
                <span>{label}</span>
                {sortField === key ? (
                  sortOrder === "asc" ? (
                    <i className="fas fa-sort-up"></i>
                  ) : (
                    <i className="fas fa-sort-down"></i>
                  )
                ) : (
                  <i className="fas fa-sort text-gray-300"></i>
                )}
              </span>
            </th>
          );
        }
      })}
    </tr>
  );

  const renderRow = (post: any) => (
    <tr key={post.id} className="hover:bg-gray-50 border-b">
      {row.map(({ key }) => {
        if (key === "id") {
          return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post[key]}</td>;
        } else if (key === "manage") {
          return manageOption;
        } else if (key === "deleteReason") {
          return (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative group ">
              <div className="w-4 h-4 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                i
              </div>
              <div className="absolute z-10 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg left-6 top-0">
                삭제 사유: {post[key]}
              </div>
            </td>
          );
        } else {
          return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post[key]}</td>;
        }
      })}
    </tr>
  );
  return (
    <div>
      <div className="flex justify-end items-center gap-2 mt-6 mb-6 pr-5">
        <div className="relative">
          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="bg-white px-4 py-2 rounded-md shadow-sm flex items-center gap-2 border border-gray-300 hover:bg-gray-100">
            <span>{selectedFilter.label}</span>
            <i className={`fas fa-chevron-${isFilterDropdownOpen ? "up" : "down"}`}></i>
          </button>
          {isFilterDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-md shadow-lg z-50">
              <ul className="py-1">
                {filterOptions.map((option) => (
                  <li
                    key={option.key}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedFilter(option);
                      setIsFilterDropdownOpen(false);
                    }}>
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
          />
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => console.log("검색 실행:", selectedFilter, searchTerm)}>
          검색
        </button>
      </div>
      {/* 테이블 구조 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full w-full table-auto text-sm ">
          <thead className="bg-gray-50 border-b border-gray-200">{renderHeader()}</thead>
          <tbody>{filteredAndSortedPosts.map((post) => renderRow(post))}</tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPageTable;
