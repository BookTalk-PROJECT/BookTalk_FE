import React from "react";
import { useParams } from "react-router-dom";
import DetailBoard from "../../common/component/Board/page/DetailBoard";
import GatheringHeader from "../component/GatheringHeader";
import {
  fetchGatheringBoardDetail,
  deleteGatheringBoard,
  setLikePost,
  resetLikePost,
} from "../api/GatheringBoardDetailRequest";

const GatheringBoardDetailPage: React.FC = () => {
  const { postId, gatheringId } = useParams<{ postId: string; gatheringId: string }>();

  const listPageUri = `/gathering/detail/${gatheringId}`;
  const editPageUri = `/gathering/${gatheringId}/gatheringboard/${postId}/edit`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-t">
            <GatheringHeader gatheringId={gatheringId!} />
            <DetailBoard
              mainTopic="모임"
              subTopic="게시글"
              postCode={postId!}
              editPageUri={editPageUri}
              listPageUri={listPageUri}
              GetBoardDetail={fetchGatheringBoardDetail}
              DeleteBoard={deleteGatheringBoard}
              SetLikePost={setLikePost}
              ResetLikePost={resetLikePost}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GatheringBoardDetailPage;
