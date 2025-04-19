import { useEffect, useState } from "react";
import { getHelloMsg } from "../api/dashboard";

const DashBoardPage = () => {
  const [hello, setHello] = useState("");

  // useEffect(() => {
  //     getHelloMsg().then((res) => setHello(res.msg));
  // }, [])

  return (
    <div>
      <div className="min-h-screen">
        <nav className="bg-white shadow">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="h-8 w-auto"
                    src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
                    alt="Logo"
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-8xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex" aria-label="Tabs">
                  <button className="w-1/2 py-4 px-1 text-center border-b-2 border-custom text-custom font-medium text-sm">
                    게시글 관리
                  </button>
                  <button className="w-1/2 py-4 px-1 text-center border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                    댓글 관리
                  </button>
                </nav>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700">기간</label>
                      <input
                        type="date"
                        className="mt-1 block w-full border-gray-300 !rounded-button shadow-sm focus:border-custom focus:ring-custom"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700">카테고리</label>
                      <select className="mt-1 block w-full border-gray-300 !rounded-button shadow-sm focus:border-custom focus:ring-custom">
                        <option>전체</option>
                        <option>공지사항</option>
                        <option>자유게시판</option>
                        <option>질문과답변</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">검색어</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="text"
                          className="block w-full border-gray-300 !rounded-button pr-10 focus:border-custom focus:ring-custom"
                          placeholder="검색어를 입력하세요"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button className="text-gray-400 hover:text-gray-500">
                            <i className="fas fa-search"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 !rounded-button bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <i className="fas fa-trash-alt mr-2"></i>
                        선택 삭제
                      </button>
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 !rounded-button bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <i className="fas fa-eye-slash mr-2"></i>
                        선택 숨김
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input type="checkbox" className="rounded border-gray-300 text-custom focus:ring-custom" />
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            번호
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            제목
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            작성자
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            작성일
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            조회수
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            상태
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            관리
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input type="checkbox" className="rounded border-gray-300 text-custom focus:ring-custom" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            2024년 서비스 업데이트 안내
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">관리자</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-15</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">245</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              공개
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-custom hover:text-custom-dark">수정</button>
                            <span className="mx-1">|</span>
                            <button className="text-red-600 hover:text-red-900">삭제</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input type="checkbox" className="rounded border-gray-300 text-custom focus:ring-custom" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">이벤트 참여 방법 안내</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">운영자</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-14</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">189</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              공개
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-custom hover:text-custom-dark">수정</button>
                            <span className="mx-1">|</span>
                            <button className="text-red-600 hover:text-red-900">삭제</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium !rounded-button bg-white text-gray-700 hover:bg-gray-50">
                        이전
                      </button>
                      <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium !rounded-button bg-white text-gray-700 hover:bg-gray-50">
                        다음
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          총 <span className="font-medium">20</span> 개 중 <span className="font-medium">1</span> -{" "}
                          <span className="font-medium">10</span>
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex !rounded-button shadow-sm -space-x-px"
                          aria-label="Pagination">
                          <button className="relative inline-flex items-center px-2 py-2 !rounded-l-button border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">이전</span>
                            <i className="fas fa-chevron-left"></i>
                          </button>
                          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                            1
                          </button>
                          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                            2
                          </button>
                          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                            3
                          </button>
                          <button className="relative inline-flex items-center px-2 py-2 !rounded-r-button border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">다음</span>
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashBoardPage;
