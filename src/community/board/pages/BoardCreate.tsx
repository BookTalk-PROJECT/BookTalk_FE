import { useEffect, useState } from "react";
import CreateBoard from "../../../common/component/Board/page/CreateBoard";
import { postBoard } from "../api/boardApi";
import { useSearchParams } from "react-router";
import { CommuPostRequest } from "../type/board";

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
      createPost={ async (arg0:CommuPostRequest, categoryId:number) => {
        await postBoard(arg0, categoryId);
      }}
    />
  );
};

export default BoardCreate;
