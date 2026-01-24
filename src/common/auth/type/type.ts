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
  username: string;
  password: string;
}

export interface ValidationEmail {
  email: string;
}

export enum AuthType {
  OWN = "자체 유저",
  KAKAO = "카카오 소셜 유저",
  NAVER = "네이버 소셜 유저",
}

export enum AuthorityType {
  // 백엔드에서 "ADMIN" 문자열을 보내므로 값을 "ADMIN"으로 지정해야 합니다.
  ADMIN = "ADMIN",

  // 백엔드에서 일반 유저를 "COMMON"으로 보낸다면 값도 "COMMON"이어야 합니다.
  COMMON = "COMMON",
}
