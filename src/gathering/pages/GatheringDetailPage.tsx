import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Pagenation from "../../common/component/Pagination";
import BoardTable from "../../common/component/BoardTable";
import GatheringHeader from "../component/GatheringHeader";
import CustomButton from "../../common/component/CustomButton";

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
  const { gatheringId } = useParams();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            <GatheringHeader gatheringId={gatheringId!} />

            <div className="p-6 border-t">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">게시판</h2>

                <CustomButton onClick={() => navigate(`/gatheringlist/${gatheringId}/gatheringboard/create`)} color="black">
                  <>
                    <i className="fas fa-pen mr-2"></i> 글쓰기
                  </>
                </CustomButton>
              </div>
              <div className="overflow-hidden rounded-lg border">
                <BoardTable posts={posts} requestUrl={`gatheringlist/${gatheringId}/gatheringboard`} />
              </div>

              <Pagenation totalPages={totalPages} loadPageByPageNum={loadPageByPageNum} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GatheringDetailPage;
