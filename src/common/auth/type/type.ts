export interface Member {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  birth: string;
  gender: string;
  authType: string;
}

export interface Login {
  username: string,
  password: string,
}

export interface ValidationEmail {
  email: string,
}

export enum AuthType {
  OWN = "자체 유저",
  KAKAO = "카카오 소셜 유저",
  NAVER = "네이버 소셜 유저"
}

export enum AuthorityType {
  ADMIN = "관리자",
  COMMON = "일반 사용자"
}