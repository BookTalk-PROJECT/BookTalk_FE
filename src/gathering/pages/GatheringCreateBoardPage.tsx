import '@toast-ui/editor/dist/toastui-editor.css';
import { gatheringCreatePost, } from '../api/GatheringCreateBoardPage.mock';
import CreateBoard from '../../common/component/Board/page/CreateBoard';
import { Post } from '../../common/type/BoardTable';
import { GatheringPostRequest } from '../../community/board/type/boardList';

const GatheringCreateBoardPage: React.FC = () => {

  const handleSubmit = async (gatheringPost: GatheringPostRequest) => {

    try {
      const result = await gatheringCreatePost(gatheringPost);
      console.log('등록 완료:', result);
      alert('글이 성공적으로 등록되었습니다.');
      window.history.back(); // 또는 등록 성공 후 원하는 페이지로 이동
    } catch (error) {
      console.error('글 등록 실패:', error);
      alert('글 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <CreateBoard createPost={handleSubmit} />
  );
};

export default GatheringCreateBoardPage;
