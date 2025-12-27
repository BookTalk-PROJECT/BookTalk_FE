import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Pagenation from "../../common/component/Pagination";
import GatheringHeader from "../component/GatheringHeader";
import CustomButton from "../../common/component/CustomButton";
import { fetchGatheringBoardList } from "../api/GatheringDetailRequest";
import { Post } from "../../common/type/BoardTable";

const PAGE_SIZE = 10;

type BoardTableNoCategoryProps = {
  posts: Post[];
  requestUrl: string;
};

const BoardTableNoCategory: React.FC<BoardTableNoCategoryProps> = ({ posts, requestUrl }) => {
  if (!posts || posts.length === 0) {
    return <div className="p-6 text-sm text-gray-500 bg-white">게시글이 없습니다.</div>;
  }

  return (
    <div className="w-full bg-white">
      <table className="w-full table-auto">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-sm text-gray-600">
            <th className="px-4 py-3 w-[120px]">번호</th>
            <th className="px-4 py-3">제목</th>
            <th className="px-4 py-3 w-[160px]">작성자</th>
            <th className="px-4 py-3 w-[160px]">날짜</th>
            <th className="px-4 py-3 w-[120px]">조회수</th>
          </tr>
        </thead>

        <tbody>
          {posts.map((p: any, idx) => {
            const boardCode = p.board_code ?? p.boardCode ?? p.id ?? String(idx);
            const title = p.title ?? p.name ?? "(제목 없음)";
            const author = p.author ?? p.writer ?? p.nickname ?? "-";
            const date = p.date ?? p.createdAt ?? p.created_at ?? "-";
            const views = p.views ?? p.viewCount ?? p.hit ?? 0;

            return (
              <tr key={boardCode} className="border-b hover:bg-gray-50 text-sm">
                <td className="px-4 py-3 text-gray-700">{boardCode}</td>
                <td className="px-4 py-3">
                  <Link to={`/${requestUrl}/${boardCode}`} className="text-gray-900 hover:underline">
                    {title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-700">{author}</td>
                <td className="px-4 py-3 text-gray-700">{date}</td>
                <td className="px-4 py-3 text-gray-700">{views}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const GatheringDetailPage: React.FC = () => {
  const { gatheringId } = useParams();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postList, setPostList] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const requestUrl = `gathering/${gatheringId}/gatheringboard`;

  // gatheringId 바뀌면 페이지/상태 리셋
  useEffect(() => {
    if (!gatheringId) return;
    setCurrentPage(1);
    setErrorMsg("");
  }, [gatheringId]);

  useEffect(() => {
    if (!gatheringId) return;

    (async () => {
      try {
        setErrorMsg("");
        const page = await fetchGatheringBoardList(gatheringId, currentPage, PAGE_SIZE);
        setPostList(page.content ?? []);
        setTotalPages(page.totalPages ?? 0);
      } catch (e) {
        console.error("게시글 리스트 불러오기 실패:", e);
        setPostList([]);
        setTotalPages(0);
        setErrorMsg("게시글 목록을 불러오지 못했습니다.");
      }
    })();
  }, [gatheringId, currentPage]);

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
                  onClick={() => navigate(`/gathering/${gatheringId}/gatheringboard/create`)}
                  color="black"
                >
                  <>
                    <i className="fas fa-pen mr-2"></i> 글쓰기
                  </>
                </CustomButton>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 text-sm rounded bg-red-50 text-red-700 border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="overflow-hidden rounded-lg border">
                <BoardTableNoCategory posts={postList} requestUrl={requestUrl} />
              </div>

              {totalPages > 0 && (
                <Pagenation
                  key={gatheringId}
                  totalPages={totalPages}
                  loadPageByPageNum={(pageNum) => setCurrentPage(pageNum)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GatheringDetailPage;
