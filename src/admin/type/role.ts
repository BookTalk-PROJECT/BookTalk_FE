import { Member } from "../../common/auth/type/type";

export interface Memberboard extends Member{
  id : number;
  joinDate : string;
  manage: string
}