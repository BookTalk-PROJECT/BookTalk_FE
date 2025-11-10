import { useNavigate, useSearchParams } from "react-router";
import DetailBaord from "../../../common/component/Board/page/DetailBoard";
import { deleteBoard, getBoardDetail, queryNextBoardCode, queryPrevBoardCode, toggleLikePost } from "../api/boardApi";
import { postReply } from "../../reply/api/replyApi";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const BoardDetail: React.FC = () => {
  const navigate = useNavigate();
  const { postCode } = useParams<string>();
  const [searchParams] = useSearchParams();
  const [categoryId, setCategoryId] = useState<string>("");

  useEffect(() => {
    setCategoryId(searchParams.get('categoryId') ?? "");
  }, [searchParams])

  const navigateToPrevBoard = async () => {
    if(postCode) {
      const nextBoardCode = (await queryPrevBoardCode(postCode, categoryId)).data;
      if(nextBoardCode===null) {
        alert("마지막 게시글입니다.");
        return;
      }
      navigate(`/boardDetail/${nextBoardCode}?categoryId=${categoryId}`)
    }
  }
  
  const navigateToNextBoard = async () => {
    if(postCode) {
      const nextBoardCode = (await queryNextBoardCode(postCode, categoryId)).data;
      if(nextBoardCode===null) {
        alert("마지막 게시글입니다.");
        return;
      }
      navigate(`/boardDetail/${nextBoardCode}?categoryId=${categoryId}`)
    }
  }

  if(!categoryId || !postCode) {
    return null;
  }


  return (
    <DetailBaord
      mainTopic="커뮤니티"
      subTopic="게시글"
      postCode={postCode!}
      editPageUri={`/boardEdit?postCode=${postCode}&categoryId=${categoryId}`}
      listPageUri={`/boardList?categoryId=${categoryId}`}
      GetBoardDetail={getBoardDetail}
      DeleteBoard={deleteBoard}
      ToggleLikePost={toggleLikePost}
      NavigateToNextPost={navigateToNextBoard}
      NavigateToPrevPost={navigateToPrevBoard}
    />
  );
};

export default BoardDetail;
