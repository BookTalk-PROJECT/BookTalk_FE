import CreateBoard from "../../../common/component/Board/page/CreateBoard";
import { postBoard } from "../api/boardDetail";
import { CommuPostRequest } from "../type/boardList";

const BoardCreate: React.FC = () => {
  return (
    <CreateBoard
      createPost={(arg0:CommuPostRequest, categoryId) => {
        postBoard(arg0, categoryId);
      }}
    />
  );
};

export default BoardCreate;
