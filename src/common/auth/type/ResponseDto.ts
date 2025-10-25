export interface ResponseDto<T> {
  code: number;
  msg: string;
  data: T;
}