import { useParams } from "react-router";
import DetailBaord from "../../../common/component/Board/page/DetailBoard";
import { createReply, GetBoardDetailRequest } from "../../../common/component/Board/type/BoardDetail.types";
import { getBoardDetail, postReply, toggleLikePost } from "../api/boardDetail";

const BoardDetail: React.FC = () => {
  const { postId } = useParams<string>();

  return (
    <DetailBaord
      postId={postId!}
      GetBoardDetail={getBoardDetail}
      ToggleLikePost={toggleLikePost}
      CreateReply={postReply}
    />
  );
};

export default BoardDetail;
