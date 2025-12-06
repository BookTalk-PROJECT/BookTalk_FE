import React, { useEffect, useMemo, useState } from "react";
import { RowDef } from "../type/common";
import { AdminTableColType } from "../../admin/type/common";
import { SearchType } from "../type/common";
import Pagenation from "./Pagination";
import { ApiResponse, PageResponse } from "../type/ApiResponse";

type MyPageTableProps<T, K> = {
  rows: T[];
  rowDef: RowDef<K>[];
  getRowKey: (row: T) => string;
  renderColumn: (row: T, key: Extract<keyof K, string>) => React.JSX.Element;
  setRowData: (rowData: T[]) => void;
  loadRowData: (pageNum: number) => Promise<ApiResponse<PageResponse<T>>>;
  searchRowData?: (cond: any, pageNum: number) => Promise<ApiResponse<PageResponse<T>>>;
  forceUpdate?: number;
};

const MyPageTable = <T, K>({
  rows,
  rowDef,
  getRowKey,
  renderColumn,
  setRowData,
  loadRowData,
  searchRowData,
  forceUpdate,
}: MyPageTableProps<T, K>) => {
  {
    /* init */
  }
  const [totalPages, setTotalPages] = useState<number>(0);

  const loadContents = (pageNum: number) => {
    loadRowData(pageNum).then((res) => {
      setRowData(res.data.content);
      setTotalPages(res.data.totalPages);
      resetSearch();
    });
  };

  useEffect(() => {
    loadContents(1);
  }, [forceUpdate]);

  {
    /* header */
  }
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      //이미 해당 필드일 시 정렬만 해줌
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderHeader = () => {
    return (
      <tr>
        {rowDef.map(({ label, key, isSortable }) => {
          return isSortable ? (
            <th
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
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap cursor-pointer">
              <span>{label}</span>
            </th>
          );
        })}
      </tr>
    );
  };

  {
    /* searchBar */
  }
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedFilter, setSelectedFilter] = useState(rowDef[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (pageNum: number) => {
    if (searchRowData) {
      searchRowData(
        {
          keywordType: selectedFilter.key as SearchType,
          keyword: searchTerm,
          startDate: dateRange.start,
          endDate: dateRange.end,
        },
        pageNum
      ).then((res) => {
        setRowData(res.data.content);
        setTotalPages(res.data.totalPages);
        setIsSearching(true);
      });
    }
  };

  const resetSearch = () => {
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setIsSearching(false);
    handleSearch(1);
  };

  const renderSearchBar = () => {
    return (
      <div className="flex justify-end items-center gap-5 mt-6 mb-6 pr-5">
        <div style={{ display: "none" }}>{forceUpdate}</div>
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
                {rowDef.map(
                  (def) =>
                    def.isSearchType && (
                      <li
                        key={def.key}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedFilter(def);
                          setIsFilterDropdownOpen(false);
                        }}>
                        {def.label}
                      </li>
                    )
                )}
              </ul>
            </div>
          )}
        </div>
        <>
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
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="border rounded-button px-3 py-1.5 text-sm"
            />
            <span className="text-sm text-gray-600">~</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="border rounded-button px-3 py-1.5 text-sm"
            />
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => resetSearch()}>
            초기화
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => handleSearch(1)}>
            검색
          </button>
        </>
      </div>
    );
  };

  const renderRow = (row: T) => (
    <React.Fragment key={getRowKey(row)}>
      <tr className="hover:bg-gray-50 border-b">
        {rowDef.map(({ key }) => (
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{renderColumn(row, key)}</td>
        ))}
      </tr>
    </React.Fragment>
  );

  return (
    <>
      <div>
        {searchRowData && renderSearchBar()}
        {/* 테이블 구조 */}
        <div className="bg-white rounded-lg shadow-sm ">
          <table className="min-w-full w-full table-auto text-sm ">
            <thead className="bg-gray-50 border-b border-gray-200">{renderHeader()}</thead>
            <tbody>{rows.map((row) => renderRow(row))}</tbody>
          </table>
        </div>
      </div>
      {/* 페이지네이션 */}
      <Pagenation
        totalPages={totalPages}
        loadPageByPageNum={(pageNum) => (isSearching ? handleSearch(pageNum) : loadContents(pageNum))}
      />
    </>
  );
};

export default MyPageTable;
