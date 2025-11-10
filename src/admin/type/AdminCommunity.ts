import { AdminTableColType } from "./common";


export interface AdminBoardColType extends AdminTableColType {
    board_code: string;
    title: string;
    category: string;
    author: string;
}

export interface AdminCommentColType extends AdminTableColType {
    reply_code: string;
    post_code: string;
    title: string;
    author: string;
    content: string;
}
