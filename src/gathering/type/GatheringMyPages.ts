
// 내 모임
export type MyGatheringSimpleInfo = {
  gathering_code: string;
  name: string;
  leader_name: string;
  master_yn: number;
  del_yn?: boolean;
  reg_date: string;
};

// 내 모임 게시글
export type MyGatheringBoardSimpleInfo = {
  board_code: string;
  gathering_name: string;
  title: string;
  author: string;
  del_yn: number | boolean;
  reg_date: string;
};