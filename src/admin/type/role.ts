import { AuthorityType, Member } from "../../common/auth/type/type";

export interface Memberboard extends Member {
  id: string;
  joinDate: string;
  authority: AuthorityType;
  manage: string;
}
