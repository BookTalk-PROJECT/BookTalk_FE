import axios from "axios";


//BASE URL import
const BASE_URL = process.env.VITE_BASE_URL;

//마이페이지 board 요청 get 메서드
const getMyPageBoard = async (userId: string) => {
  try {
    const response = await axios.get(`/mypage/board/${userId}`);
    return response.data;
  } catch (e) {
    console.log("error occurs while to get MyPage Board Data :"+e);
  }
};
