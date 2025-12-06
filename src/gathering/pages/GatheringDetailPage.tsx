import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Pagenation from "../../common/component/Pagination";
import GatheringHeader from "../component/GatheringHeader";
import CustomButton from "../../common/component/CustomButton";
import { fetchGatheringBoardList, posts } from "../api/GatheringDetailRequest";
// import BoardTable from "../../common/component/Board/page/BoardTable";
import { Post } from "../../common/type/BoardTable";

const GatheringDetailPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [postList, setPostList] = useState<Post[]>([]);
  const { gatheringId } = useParams();
  const navigate = useNavigate();

  const totalPages = Math.ceil(postList.length / 10); // 보여줄 페이지 수

  const loadPageByPageNum = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  const fetchPostList = async () => {
    try {
      const res = await fetchGatheringBoardList(gatheringId!);
      setPostList(res);
    } catch (error) {
      console.error("게시글 리스트 불러오기 실패! 더미 넣는데이 :", error);
      setPostList(posts); // 실패 시 더미 데이터 사용
    }
  };

  useEffect(() => {
    if (gatheringId) {
      fetchPostList();
    }
  }, [gatheringId]);

  const paginatedPosts = postList.slice(currentPage * 10, (currentPage + 1) * 10);

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <GatheringHeader gatheringId={gatheringId!} />

            <div className="p-6 border-t">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">게시판</h2>

                <CustomButton
                  onClick={() => navigate(`/gatheringlist/${gatheringId}/gatheringboard/create`)}
                  color="black">
                  <>
                    <i className="fas fa-pen mr-2"></i> 글쓰기
                  </>
                </CustomButton>
              </div>
              <div className="overflow-hidden rounded-lg border">
                {/* <BoardTable posts={paginatedPosts} requestUrl={`gatheringlist/${gatheringId}/gatheringboard`} /> */}
              </div>

              {/* <Pagenation totalPages={totalPages} loadPageByPageNum={loadPageByPageNum} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GatheringDetailPage;
