type ApiResponse<T> = {
    msg: string;
    code: number;
    data: T;
}