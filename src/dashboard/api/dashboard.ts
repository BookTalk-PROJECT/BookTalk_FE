import axios from "axios";
import { HelloTestResponse } from "../type/HelloTest";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/*Hello 데이터 받아오기*/
export const getHelloMsg = async (): Promise<HelloTestResponse> => {
    const response = await axios.get<HelloTestResponse>(`${BASE_URL}/dashboard/hello`);
    return response.data;
}