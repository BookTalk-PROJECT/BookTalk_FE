import { useNavigate, useSearchParams } from "react-router";
import DetailBaord from "../../../common/component/Board/page/DetailBoard";
import { deleteBoard, getBoardDetail, queryNextBoardCode, queryPrevBoardCode, setLikePost, resetLikePost } from "../api/boardApi";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const BoardDetail: React.FC = () => {
  const navigate = useNavigate();
  const { postCode } = useParams<string>();
  const [searchParams] = useSearchParams();
  const [categoryId, setCategoryId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const categoryIdFromUrl = searchParams.get("categoryId");
    if (categoryIdFromUrl) {
      setCategoryId(categoryIdFromUrl);
      setIsLoading(false);
    } else if (postCode) {
      // URL에 categoryId가 없으면 게시글 상세에서 가져옴
      getBoardDetail(postCode)
        .then((response) => {
          if (response.data?.post?.category_id) {
            setCategoryId(response.data.post.category_id);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch board detail:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [searchParams, postCode]);

  const navigateToPrevBoard = async () => {
    if (postCode) {
      const nextBoardCode = (await queryPrevBoardCode(postCode, categoryId)).data;
      if (nextBoardCode === null) {
        alert("마지막 게시글입니다.");
        return;
      }
      navigate(`/boardDetail/${nextBoardCode}?categoryId=${categoryId}`);
    }
  };

  const navigateToNextBoard = async () => {
    if (postCode) {
      const nextBoardCode = (await queryNextBoardCode(postCode, categoryId)).data;
      if (nextBoardCode === null) {
        alert("마지막 게시글입니다.");
        return;
      }
      navigate(`/boardDetail/${nextBoardCode}?categoryId=${categoryId}`);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!postCode) {
    return null;
  }

  return (
    <DetailBaord
      mainTopic="커뮤니티"
      subTopic="게시글"
      postCode={postCode!}
      editPageUri={`/boardEdit?postCode=${postCode}&categoryId=${categoryId}`}
      listPageUri={categoryId ? `/boardList?categoryId=${categoryId}` : `/boardList`}
      GetBoardDetail={getBoardDetail}
      DeleteBoard={deleteBoard}
      SetLikePost={async (postId) => { await setLikePost(postId); }}
      ResetLikePost={async (postId) => { await resetLikePost(postId); }}
      NavigateToNextPost={categoryId ? navigateToNextBoard : undefined}
      NavigateToPrevPost={categoryId ? navigateToPrevBoard : undefined}
    />
  );
};

export default BoardDetail;
