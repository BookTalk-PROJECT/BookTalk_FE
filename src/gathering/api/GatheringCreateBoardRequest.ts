// src/api/youtube.ts
import axios from "axios";
import { GatheringPostRequest } from "../../community/board/type/boardList";

const apiKey = import.meta.env.VITE_API_URL;

//게시글 등록 api
export const gatheringCreatePost = async (postData: GatheringPostRequest) => {
  //CommuPostRequest : 커뮤니티 GatheringPostRequest : 모임 게시글
  console.log("게시글 등록 요청 데이터:", postData);

  const response = await axios.post(apiKey + "/api/gatherings", postData);
  return response.data;
};
