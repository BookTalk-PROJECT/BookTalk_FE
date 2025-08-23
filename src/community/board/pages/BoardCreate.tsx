import { useEffect, useState } from "react";
import CreateBoard from "../../../common/component/Board/page/CreateBoard";
import { postBoard } from "../api/boardDetail";
import { CommuPostRequest } from "../type/boardList";
import { useSearchParams } from "react-router";

const BoardCreate: React.FC = () => {
  const [categoryId, setCategoryId] = useState<number>();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const param = searchParams.get('categoryId');
    if(param != null) {
      setCategoryId(parseInt(param));
    }
  }, [searchParams])

  return (
    <CreateBoard
      categoryId={categoryId ?? 0}
      createPost={(arg0:CommuPostRequest, categoryId:number) => {
        postBoard(arg0, categoryId);
      }}
    />
  );
};

export default BoardCreate;
