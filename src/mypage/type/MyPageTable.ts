import { AdminTableColType } from "../../admin/type/common";

export interface MyPageGatheringBoardType extends AdminTableColType {
  title: string;
  gathering: string;
}

export interface MyPageMyGatheringType extends AdminTableColType {
  category: string;
  status: string;
  gathering: string;
}

export interface MyPageGatheringRequestManageType extends MyPageMyGatheringType {
  questions: GatheringRequestQuestion[];
}

export interface GatheringRequestQuestion {
  question: string;
  answer: string;
}

export interface MyPageMemberDataType {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  birth: string;
  gender: string;
  authType: string;
}

export interface MyPageModifyMemberDataType {
  phoneNumber: string;
  password: string;
  address: string;
}
