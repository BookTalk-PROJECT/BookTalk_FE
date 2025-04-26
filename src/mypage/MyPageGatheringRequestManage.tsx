import React, { useState, useEffect } from "react";
import MyPageSideBar from "../common/component/MyPageSideBar";
import Pagenation from "../common/component/Pagination";

const MyPageGatheringRequest: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<string>("모임명");
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<string>("asc");

  useEffect(() => {
    const categories = ["IT", "소설", "예술"];
    const statuses = ["승인 대기", "거절", "승인 완료"];
    const names = [
      "트레킹의 취미 모임", "그린빈즈", "나랏말싸미 뒷풀이", "짬깐아 여행좀 갈까", "반갑습니다",
      "어떻게 쉬는건가요?", "공부력 모임 추천", "이거 외면하면 섭섭"
    ];

    const generateDate = (index: number) => {
      const date = new Date("2025-03-27");
      date.setDate(date.getDate() - index);
      return date.toISOString().split("T")[0];
    };

    const mockData = Array.from({ length: 20 }, (_, i) => ({
      id: 1000 - i,
      name: names[i % names.length],
      category: categories[i % categories.length],
      applyDate: generateDate(i),
      status: statuses[i % statuses.length]
    }));

    setRequests(mockData);
    filterData(mockData, searchType, searchText, sortField, sortDirection);
  }, []);

  const filterData = (
    data: any[],
    searchType: string,
    searchText: string,
    sortField: string,
    sortDirection: string
  ) => {
    let filtered = [...data];

    if (searchText) {
      filtered = filtered.filter((item) => {
        if (searchType === "모임명") return item.name.includes(searchText);
        if (searchType === "분류") return item.category.includes(searchText);
        return true;
      });
    }

    if (sortField) {
      filtered.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    filterData(requests, searchType, searchText, sortField, sortDirection);
  };

  const handleSort = (field: string) => {
    const direction = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    filterData(filteredRequests, searchType, searchText, field, direction);
  };

  const itemsPerPage = 10;
  const currentData = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="fixed top-6 left-0 w-60 h-full bg-blue-600 text-white p-6 space-y-8">
        <MyPageSideBar />
      </div>

      <div className="flex-1 ml-60 bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="text-lg font-medium text-gray-700">
            모임 &gt; 모임 신청 관리
          </div>
        </div>

        <div className="p-6 flex flex-wrap justify-between items-center">
          <div className="flex w-full sm:w-auto">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="pl-3 pr-2 py-2 text-sm border border-gray-300 rounded-l-lg bg-gray-100"
            >
              <option value="모임명">모임명</option>
              <option value="분류">분류</option>
            </select>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="border-y border-gray-300 py-2 px-4 text-sm"
            />
            <button
              onClick={handleSearch}
              className="bg-gray-800 text-white px-4 py-2 text-sm font-medium rounded-r-lg hover:bg-gray-700"
            >
              검색
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              {["name", "category", "applyDate", "status"].map((field) => {
                const fieldLabel: Record<string, string> = {
                  name: "모임명",
                  category: "분류",
                  applyDate: "신청 일시",
                  status: "상태",
                };
                return (
                  <th
                    key={field}
                    onClick={() => handleSort(field)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span>{fieldLabel[field]}</span>
                      <span className="ml-1">
                          {sortField === field ? (
                            sortDirection === "asc" ? (
                              <i className="fas fa-sort-up"></i>
                            ) : (
                              <i className="fas fa-sort-down"></i>
                            )
                          ) : (
                            <i className="fas fa-sort text-gray-300"></i>
                          )}
                        </span>
                    </div>
                  </th>
                );
              })}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.applyDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-xs rounded mr-2">신청 철회</button>
                </td>
              </tr>
            ))}
            {currentData.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-sm text-gray-500 py-4">데이터가 없습니다.</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>

        <Pagenation totalPages={1} loadPageByPageNum={() => {}} />
      </div>
    </div>
  );
};

export default MyPageGatheringRequest;
