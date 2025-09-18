import { useEffect, useState } from "react";
import CreateBoard from "../../../common/component/Board/page/CreateBoard";
import { editBoard, postBoard } from "../api/boardApi";
import { useSearchParams } from "react-router";
import EditBoard from "../../../common/component/Board/page/EditBoard";
import { CommuPostRequest } from "../type/board";

const BoardEdit: React.FC = () => {
  const [searchParams] = useSearchParams();


  return (
    <EditBoard
      categoryId={parseInt(searchParams.get('categoryId')!)}
      postCode={searchParams.get('postCode')!}
      editPost={ async (arg0:CommuPostRequest, postCode: string) => {
        await editBoard(arg0, postCode!);
      }}
    />
  );
};

export default BoardEdit;
