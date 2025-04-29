import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Pagenation from "../../common/component/Pagination";
import BoardTable from "../../common/component/BoardTable";
import BookCardList from "../component/GatheringDetailCards";
import CustomButton from "../../common/component/CustomButton";

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
                  <CustomButton onClick={() => alert("공유하기 클릭됨")} color="white">
                    <>
                      <i className="fas fa-share-alt mr-2"></i>공유하기
                    </>
                  </CustomButton>
                  <CustomButton onClick={() => alert("가입하기 클릭됨")} color="black">
                    <>
                      <i className="fas fa-user-plus mr-2"></i>가입하기
                    </>
                  </CustomButton>
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
              <BookCardList books={books} />
            </div>
            <div className="p-6 border-t">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">게시판</h2>
                <CustomButton onClick={() => navigate(`/gatheringlist/${id}/gatheringboard/create`)} color="black">
                  <>
                    <i className="fas fa-pen mr-2"></i> 글쓰기
                  </>
                </CustomButton>
              </div>
              <div className="overflow-hidden rounded-lg border">
                <BoardTable posts={posts} />
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
