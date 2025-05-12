import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Pagenation from "../../common/component/Pagination";
import BoardTable from "../../common/component/BoardTable";
import GatheringHeader from "../component/GatheringHeader";
import CustomButton from "../../common/component/CustomButton";
import { posts } from "../api/GatheringDetailPage.mock";

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

  const totalPages = Math.ceil(posts.length / 10); // 보여줄 페이지 수

  const loadPageByPageNum = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  const paginatedPosts = posts.slice((currentPage - 1) * 10, currentPage * 10);

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
                <BoardTable posts={paginatedPosts} requestUrl={`gatheringlist/${gatheringId}/gatheringboard`} />
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
