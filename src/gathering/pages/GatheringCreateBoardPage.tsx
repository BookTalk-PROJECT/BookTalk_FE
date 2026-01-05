import { useParams } from "react-router-dom";
import CreateBoard from "../../common/component/Board/page/CreateBoard";
import { gatheringCreatePost } from "../api/GatheringCreateBoardRequest";
import { CommuPostRequest } from "../../common/component/Board/type/BoardDetailTypes";

const GatheringCreateBoardPage: React.FC = () => {
  const { gatheringId } = useParams();

  const handleSubmit = (postData: CommuPostRequest, _categoryId?: string) => {
    return gatheringCreatePost(gatheringId!, postData);
  };

  return (
    <CreateBoard
      categoryId="__GATHERING__" // 더미값 필수
      redirectUri={`/gathering/detail/${gatheringId}`}
      mainTopic="모임"
      subTopic="게시판"
      createPost={handleSubmit}
    />
  );
};

export default GatheringCreateBoardPage;
