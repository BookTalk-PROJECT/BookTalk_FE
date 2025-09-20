import { useParams } from "react-router";
import DetailBaord from "../../../common/component/Board/page/DetailBoard";
import { deleteBoard, getBoardDetail, toggleLikePost } from "../api/boardApi";
import { postReply } from "../../reply/api/replyApi";

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
