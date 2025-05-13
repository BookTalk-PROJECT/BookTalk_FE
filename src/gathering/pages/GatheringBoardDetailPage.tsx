import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import GatheringHeader from "../component/GatheringHeader";
import { fetchGatheringBoardDetail, createReply, toggleLikePost } from "../api/GatheringBoardDetailPage.mock";
import DetailBaord from "../../common/component/Board/page/DetailBoard";


const GatheringBoardDetailPage: React.FC = () => {
  //GatheringDetail to BoardTable props
  const { gatheringId, postId } = useParams<{ gatheringId: string; postId: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-t">

            <GatheringHeader gatheringId={gatheringId!} /> {/* 모임 헤더 불러오기 모임을 아이디를 props로 보냄 */}

            <DetailBaord
              GetBoardDetail={() =>
                fetchGatheringBoardDetail(postId!, gatheringId!)
              }

              ToggleLikePost={() => {
                toggleLikePost(postId!, gatheringId!); // 좋아요 상태 반전
              }}

              CreateReply={(postId, content, parentReplyCode, gatheringId) => {
                if (!gatheringId) return;
                createReply(gatheringId, postId, content, parentReplyCode);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default GatheringBoardDetailPage;
