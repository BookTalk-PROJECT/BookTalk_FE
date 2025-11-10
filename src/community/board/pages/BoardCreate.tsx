import { useEffect, useState } from "react";
import CreateBoard from "../../../common/component/Board/page/CreateBoard";
import { postBoard } from "../api/boardApi";
import { useSearchParams } from "react-router";
import { CommuPostRequest } from "../../../common/component/Board/type/BoardDetailTypes";

const BoardCreate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [categoryId, setCategoryId] = useState<string>("");

  useEffect(() => {
    setCategoryId(searchParams.get('categoryId') ?? "");
  }, [searchParams])

  if(!categoryId) {
    return null;
  }

  return (
    <CreateBoard
      categoryId={categoryId}
      redirectUri={`/boardList?categoryId=${categoryId}`}
      createPost={ async (arg0: CommuPostRequest, categoryId: string | undefined) => {
        if(categoryId)
          await postBoard(arg0, categoryId);
      }}
      mainTopic="카테고리"
      subTopic="글쓰기"
    />
  );
};

export default BoardCreate;
