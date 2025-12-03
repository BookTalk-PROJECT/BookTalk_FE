export type ApiResponse<T> = {
  msg: string;
  code: number;
  data: T;
};

export type PageResponse<T> = {
  content: T[];
  totalPages: number;
};
