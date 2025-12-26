import React from "react";
import { useParams } from "react-router-dom";
import DetailBoard from "../../common/component/Board/page/DetailBoard";
import {
  fetchGatheringBoardDetail,
  deleteGatheringBoard,
  toggleLikeGatheringBoard,
} from "../api/GatheringBoardDetailRequest";

const GatheringBoardDetailPage: React.FC = () => {
  const { postId, gatheringId } = useParams<{ postId: string; gatheringId: string }>();

  const listPageUri = `/gathering/detail/${gatheringId}`;
  const editPageUri = `/gathering/${gatheringId}/gatheringboard/${postId}/edit`;

  return (
    <DetailBoard
      mainTopic="모임"
      subTopic="게시판"
      postCode={postId!}
      editPageUri={editPageUri}
      listPageUri={listPageUri}
      GetBoardDetail={fetchGatheringBoardDetail}
      DeleteBoard={deleteGatheringBoard}
      ToggleLikePost={toggleLikeGatheringBoard /* 원하면 */}
    />
  );
};

export default GatheringBoardDetailPage;
