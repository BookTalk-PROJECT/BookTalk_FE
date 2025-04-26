import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Pagenation from "../../common/component/Pagination";
import ButtonWrapper from "../../common/component/Button";

interface Book {
  id: number;
  title: string;
  author: string;
  status: string;
  date: string;
}
interface Post {
  id: number;
  title: string;
  date: string;
  author: string;
  views: number;
}
const GatheringDetailPage: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const books = [
    { id: 1, title: "책이름1", author: "저자명", status: "완료", date: "2023-02-24" },
    { id: 2, title: "책이름2", author: "저자명", status: "읽는중", date: "2023-03-15" },
    { id: 3, title: "책이름3", author: "저자명", status: "예정", date: "2023-04-01" },
  ];
  const posts = [
    { id: 32, title: "독서모임 후기 1", date: "2023-02-24", author: "이름님", views: 33 },
    { id: 31, title: "독서모임 리뷰 1", date: "2023-03-04", author: "이름님", views: 1511 },
    { id: 30, title: "독서모임 후기 1", date: "2023-02-24", author: "박이름", views: 2 },
    { id: 29, title: "독서모임 후기 1", date: "2023-02-24", author: "김이름", views: 7 },
    { id: 28, title: "독서모임 후기 1", date: "2023-02-24", author: "박이름", views: 32 },
    { id: 27, title: "독서모임 후기 1", date: "2023-02-23", author: "박이름", views: 1 },
    { id: 26, title: "독서모임 후기 1", date: "2023-02-23", author: "황이름", views: 5 },
    { id: 25, title: "독서 1", date: "2023-02-23", author: "박이름", views: 134 },
  ];

  const totalPages = Math.ceil(posts.length / 10); // 보여줄 페이지 수

  const loadPageByPageNum = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행중":
        return "bg-yellow-500";
      case "모집중":
        return "bg-green-500";
      case "완료":
        return "bg-blue-500";
      case "예정":
        return "bg-red-500";
      case "읽는중":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">즐거운 독서</h1>
                <div className="flex space-x-3">
                  <ButtonWrapper onClick={() => alert("공유하기 클릭됨")}>
                    <span className="px-4 py-2 text-sm bg-gray-100 rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-200">
                      <i className="fas fa-share-alt mr-2"></i>공유하기
                    </span>
                  </ButtonWrapper>

                  <ButtonWrapper onClick={() => alert("가입하기 클릭됨")}>
                    <span className="px-4 py-2 text-sm bg-gray-800 text-white rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-900">
                      <i className="fas fa-user-plus mr-2"></i>가입하기
                    </span>
                  </ButtonWrapper>

                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span>
                  <i className="fas fa-users mr-2"></i>멤버 32명
                </span>
                <span>
                  <i className="fas fa-book mr-2"></i>진행중인 책 2권
                </span>
                <span>
                  <i className="fas fa-calendar mr-2"></i>매주 화요일
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">독서 목록</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const container = document.querySelector(".books-container") as HTMLElement;

                      if (container) {
                        container.scrollLeft -= container.offsetWidth;
                      }
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200">
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={() => {
                      const container = document.querySelector(".books-container") as HTMLElement;
                      if (container) {
                        container.scrollLeft += container.offsetWidth;
                      }
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              <div
                className="books-container overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}>
                <div className="inline-flex gap-6 min-w-max pb-4">
                  {[...books, ...books, ...books].map((book, index) => (
                    <div key={`${book.id}-${index}`} className="w-[300px] relative group cursor-pointer">
                      <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden mb-4">
                          <img
                            src={`https://readdy.ai/api/search-image?query=modern%20minimalist%20book%20cover%20design%20with%20abstract%20geometric%20patterns%20and%20sophisticated%20typography%20on%20clean%20background%20professional%20publishing%20quality&width=400&height=400&seq=${book.id}&orientation=squarish`}
                            alt={book.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-white text-xs ${getStatusColor(book.status)}`}>
                              {book.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <p className="text-gray-600">{book.author}</p>
                            <div className="flex items-center text-gray-500">
                              <i className="fas fa-calendar mr-2"></i>
                              <span>{book.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">게시판</h2>
                <ButtonWrapper
                  onClick={() => navigate(`/gatheringlist/${id}/gatheringboard/create`)}>
                  <span className="px-4 py-2 bg-gray-800 text-white rounded-button whitespace-nowrap hover:bg-gray-900">
                    <i className="fas fa-pen mr-2"></i>글쓰기
                  </span>
                </ButtonWrapper>
              </div>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-sm">
                      <th className="px-6 py-3 text-left">제목</th>
                      <th className="px-6 py-3 text-center w-32">작성자</th>
                      <th className="px-6 py-3 text-center w-32">작성일</th>
                      <th className="px-6 py-3 text-center w-24">조회</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <a
                            href={`/gatheringlist/${id}/gatheringboard/${post.id}`}
                            className="text-gray-900 hover:text-blue-600">
                            {post.title}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">{post.author}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">{post.date}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">{post.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


              <Pagenation totalPages={totalPages} loadPageByPageNum={loadPageByPageNum} />


            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};
export default GatheringDetailPage;
