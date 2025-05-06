import React, { useState } from "react";

interface MyPageTableProps<T> {
  posts: T[];
  filterOptions: string[];
  selectedFilter: string;
  onChangeFilter: (val: string) => void;
  searchTerm: string;
  onSearchTermChange: (val: string) => void;
  onSearchClick: () => void;
  renderHeader: () => React.ReactNode;
  renderRow: (row: T) => React.ReactNode;
  colCount: number;
}

const MyPageTable = <T,>({
                           posts,
                           filterOptions,
                           selectedFilter,
                           onChangeFilter,
                           searchTerm,
                           onSearchTermChange,
                           onSearchClick,
                           renderHeader,
                           renderRow,
                           colCount,
                         }: MyPageTableProps<T>) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  return (
      <div>
        <div className="flex justify-end items-center gap-2 mb-6">
          <div className="relative">
            <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="bg-white px-4 py-2 rounded-md shadow-sm flex items-center gap-2 border border-gray-300 hover:bg-gray-100"
            >
              <span>{selectedFilter}</span>
              <i className={`fas fa-chevron-${isFilterDropdownOpen ? "up" : "down"}`}></i>
            </button>
            {isFilterDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-md shadow-lg z-50">
                  <ul className="py-1">
                    {filterOptions.map((option) => (
                        <li
                            key={option}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              onChangeFilter(option);
                              setIsFilterDropdownOpen(false);
                            }}
                        >
                          {option}
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
                onChange={(e) => onSearchTermChange(e.target.value)}
                placeholder="검색어를 입력하세요"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
            />
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={onSearchClick}
          >
            검색
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className={`grid grid-cols-${colCount} bg-gray-50 py-3 px-4 border-b border-gray-200`}>
            {renderHeader()}
          </div>

          {posts.map((post) => renderRow(post))}
        </div>
      </div>
  );
};

export default MyPageTable;
