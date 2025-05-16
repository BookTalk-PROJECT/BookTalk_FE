import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import GatheringHeader from "../component/GatheringHeader";
import DetailBoard from "../../common/component/Board/page/DetailBoard";
import { createReply, fetchGatheringBoardDetail, toggleLikePost } from "../api/GatheringBoardDetailRequest";

const GatheringBoardDetailPage: React.FC = () => {
  //GatheringDetail to BoardTable props
  const { postId, gatheringId } = useParams<{ postId: string; gatheringId: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-t">
            <GatheringHeader gatheringId={gatheringId!} /> {/* 모임 헤더 불러오기 모임을 아이디를 props로 보냄 */}
            <DetailBoard
              postId={postId!}
              GetBoardDetail={fetchGatheringBoardDetail}
              ToggleLikePost={toggleLikePost}
              CreateReply={createReply}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default GatheringBoardDetailPage;
