import React, { useState } from "react";
import { RowDef } from "../type/common";
import { SearchType } from "../type/common";
import Pagination from "./Pagination";

interface SearchCondition {
  keywordType: SearchType;
  keyword: string;
  startDate: string;
  endDate: string;
}

type DataTableCustomProps<T, K> = {
  // 데이터
  rows: T[];
  rowDef: RowDef<K>[];
  getRowKey: (row: T) => string;
  renderColumn: (row: T, key: Extract<keyof K, string>) => React.JSX.Element;

  // 페이지네이션
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;

  // 상태
  isLoading?: boolean;
  error?: string | null;

  // 검색 (선택적)
  searchEnabled?: boolean;
  onSearch?: (cond: SearchCondition) => void;
  onResetSearch?: () => void;
};

const DataTableCustom = <T, K>({
  rows,
  rowDef,
  getRowKey,
  renderColumn,
  totalPages,
  currentPage,
  onPageChange,
  isLoading = false,
  error = null,
  searchEnabled = false,
  onSearch,
  onResetSearch,
}: DataTableCustomProps<T, K>) => {
  // 검색 UI 상태만 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedFilter, setSelectedFilter] = useState(
    rowDef.find((def) => def.isSearchType) || rowDef[0]
  );
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // 정렬 상태
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSearchClick = () => {
    onSearch?.({
      keywordType: selectedFilter.key as SearchType,
      keyword: searchTerm,
      startDate: dateRange.start,
      endDate: dateRange.end,
    });
  };

  const handleResetClick = () => {
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    onResetSearch?.();
  };

  const renderHeader = () => {
    return (
      <tr>
        {rowDef.map(({ label, key, isSortable }) => {
          return isSortable ? (
            <th
              key={key}
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
          ) : (
            <th key={key} className="px-4 py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap cursor-pointer">
              <span>{label}</span>
            </th>
          );
        })}
      </tr>
    );
  };

  const renderSearchBar = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 mt-6 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-3">
          {/* 필터 + 검색어 그룹 */}
          <div className="flex items-stretch">
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="h-full px-3 py-2 rounded-l-lg flex items-center gap-2 border border-r-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                <span>{selectedFilter.label}</span>
                <i className={`fas fa-chevron-${isFilterDropdownOpen ? "up" : "down"} text-xs`}></i>
              </button>
              {isFilterDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                  {rowDef.map(
                    (def) =>
                      def.isSearchType && (
                        <button
                          key={def.key}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${
                            selectedFilter.key === def.key ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-700"
                          }`}
                          onClick={() => {
                            setSelectedFilter(def);
                            setIsFilterDropdownOpen(false);
                          }}>
                          {def.label}
                        </button>
                      )
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색어를 입력하세요"
                className="h-full pl-9 pr-4 py-2 border border-gray-300 rounded-r-lg text-sm w-full sm:w-44 focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 outline-none"
              />
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-200 hidden sm:block" />

          {/* 날짜 범위 그룹 */}
          <div className="flex items-center gap-2">
            <i className="fas fa-calendar-alt text-gray-400 text-xs"></i>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 outline-none"
            />
            <span className="text-xs text-gray-400">~</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 outline-none"
            />
          </div>
          </div>

          {/* 액션 버튼 그룹 */}
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={handleResetClick}>
              <i className="fas fa-undo text-xs mr-1.5"></i>초기화
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
              onClick={handleSearchClick}>
              <i className="fas fa-search text-xs mr-1.5"></i>검색
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRow = (row: T) => (
    <React.Fragment key={getRowKey(row)}>
      <tr className="hover:bg-gray-50 border-b">
        {rowDef.map(({ key }) => (
          <td key={key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">{renderColumn(row, key)}</td>
        ))}
      </tr>
    </React.Fragment>
  );

  return (
    <>
      <div>
        {searchEnabled && renderSearchBar()}
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        )}
        {/* 에러 상태 */}
        {error && <div className="text-red-500 text-center py-4">{error}</div>}
        {/* 테이블 구조 */}
        {!isLoading && !error && (
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full w-full table-auto text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">{renderHeader()}</thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={rowDef.length} className="text-center py-8 text-gray-500">
                      데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => renderRow(row))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* 페이지네이션 */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default DataTableCustom;
