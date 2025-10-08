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