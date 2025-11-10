import { useEffect, useState } from "react";
import CreateBoard from "../../../common/component/Board/page/CreateBoard";
import { editBoard, postBoard } from "../api/boardApi";
import { useSearchParams } from "react-router";
import EditBoard from "../../../common/component/Board/page/EditBoard";
import { CommuPostRequest } from "../../../common/component/Board/type/BoardDetailTypes";

const BoardEdit: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [categoryId, setCategoryId] = useState<string>("");
  const [postCode, setPostCode] = useState<string>("");

  useEffect(() => {
    setCategoryId(searchParams.get('categoryId') ?? "");
    setPostCode(searchParams.get("postCode") ?? "");
  }, [searchParams])

  if(!categoryId || !postCode) {
    return null;
  }

  return (
    <EditBoard
      categoryId={categoryId}
      redirectUri={`/boardDetail/${postCode}?categoryId=${categoryId}`}
      postCode={postCode}
      editPost={(arg0:CommuPostRequest, postCode: string) => {
        editBoard(arg0, postCode);
      }}
      mainTopic="카테고리"
      subTopic="글수정"
    />
  );
};

export default BoardEdit;
