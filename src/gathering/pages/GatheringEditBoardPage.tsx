import { useParams } from "react-router-dom";
import EditBoard from "../../common/component/Board/page/EditBoard";
import { editGatheringBoard } from "../api/GatheringBoardEditRequest";
import { CommuPostRequest } from "../../common/component/Board/type/BoardDetailTypes";

const GatheringEditBoardPage: React.FC = () => {
  const { gatheringId, postId } = useParams<{ gatheringId: string; postId: string }>();

  const handleEdit = (postData: CommuPostRequest, postCode: string) => {
    return editGatheringBoard(postCode, {
      ...postData,
      gatheringCode: gatheringId!,
    } as any);
  };

  return (
    <EditBoard
      redirectUri={`/gathering/${gatheringId}/gatheringboard/${postId}`}
      postCode={postId!}
      editPost={handleEdit}
      mainTopic="모임"
      subTopic="게시판"
    />
  );
};

export default GatheringEditBoardPage;
