import { useParams } from "react-router";
import DetailBaord from "../../../common/component/Board/page/DetailBoard";
import { createReply, GetBoardDetailRequest } from "../../../common/component/Board/type/BoardDetail.types";
import { deleteBoard, getBoardDetail, postReply, toggleLikePost } from "../api/boardDetail";

const BoardDetail: React.FC = () => {
  const { postId } = useParams<string>();

  return (
    <DetailBaord
      postCode={postId!}
      GetBoardDetail={getBoardDetail}
      DeleteBoard={deleteBoard}
      ToggleLikePost={toggleLikePost}
      CreateReply={postReply}
    />
  );
};

export default BoardDetail;
