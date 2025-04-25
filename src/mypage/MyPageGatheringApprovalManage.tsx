import React, { useState, useEffect } from "react";
import MyPageSideBar from "../common/component/MyPageSideBar";
import Pagenation from "../common/component/Pagination";

const MyPageGatheringApprovalManage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<string>("모임명");
  const [searchText, setSearchText] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<string>("asc");

  useEffect(() => {
    const sampleQuestions = [
      {
        question: "어떻게 책을 소개할건가요?",
        answer: "나를 책으로만 안 사람도 없답니다!!"
      },
      {
        question: "짬깐아 아빠를 속일 수 있니?",
        answer: "못 속여요 ㅎㅎ"
      },
      {
        question: "이 모임을 신청하게된 계기가 있습니까?",
        answer: "여자 친구와 함께 읽고 싶습니다."
      },
      {
        question: "이런 모임을 가져본 적이 있나요?",
        answer: "없습니다요"
      },
      {
        question: "개인적으로 활동중인 책이 있나요?",
        answer: "작년 책, 셋 있어요!"
      }
    ];

    const sampleData = [
      {
        id: 1,
        name: "그린빈즈",
        category: "소설",
        applyDate: "2025-03-24",
        status: "승인 대기",
        questions: sampleQuestions
      },
      {
        id: 2,
        name: "공부할때 먹으면 좋은 간식 추천",
        category: "IT",
        applyDate: "2025-03-23",
        status: "승인 대기",
        questions: sampleQuestions.slice(0, 2)
      },
      {
        id: 3,
        name: "이거 읽으면 이제 뭐 읽으면 좋을까요?",
        category: "예술",
        applyDate: "2025-03-22",
        status: "승인 대기",
        questions: sampleQuestions.slice(1, 4)
      }
    ];

    setRequests(sampleData);
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  const handleApprove = (id: number) => {
    alert(`ID ${id} 승인됨`);
  };

  const handleReject = (id: number) => {
    alert(`ID ${id} 거절됨`);
  };

  const handleSort = (field: string) => {
    const direction = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };

  const filtered = requests.filter(item => {
    if (searchType === "모임명") return item.name.includes(searchText);
    if (searchType === "분류") return item.category.includes(searchText);
    return true;
  });

  if (sortField) {
    filtered.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  const itemsPerPage = 10;
  const currentData = filtered.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="fixed top-6 left-0 w-60 h-full bg-blue-600 text-white p-6 space-y-8">
        <MyPageSideBar />
      </div>

      <div className="flex-1 ml-60 bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="text-lg font-medium text-gray-700">모임 &gt; 신청 승인 관리</div>
        </div>

        {/* 검색 필터 영역 */}
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
              onClick={() => setCurrentPage(0)}
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
              {[
                { field: "name", label: "모임명" },
                { field: "category", label: "분류" },
                { field: "applyDate", label: "신청 일시" },
              ].map(({ field, label }) => (
                <th
                  key={field}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort(field)}
                >
                  <div className="flex items-center">
                    <span>{label}</span>
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
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item) => (
              <React.Fragment key={item.id}>
                <tr onClick={() => toggleExpand(item.id)} className="cursor-pointer hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.applyDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button onClick={(e) => { e.stopPropagation(); handleApprove(item.id); }} className="bg-green-200 hover:bg-green-300 px-3 py-1 text-xs rounded mr-2">승인</button>
                    <button onClick={(e) => { e.stopPropagation(); handleReject(item.id); }} className="bg-red-200 hover:bg-red-300 px-3 py-1 text-xs rounded">거절</button>
                  </td>
                </tr>
                {expandedRow === item.id && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-2">
                        {item.questions.map((q: any, idx: number) => (
                          <div key={idx} className="text-sm">
                            <div className="font-medium">{q.question}</div>
                            <div className="ml-4 text-gray-700">=&gt; {q.answer}</div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            </tbody>
          </table>
        </div>

        <Pagenation totalPages={totalPages} loadPageByPageNum={setCurrentPage} />
      </div>
    </div>
  );
};

export default MyPageGatheringApprovalManage;
