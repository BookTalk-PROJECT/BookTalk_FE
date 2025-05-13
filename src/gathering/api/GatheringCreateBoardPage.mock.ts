// src/api/youtube.ts
import axios from 'axios';
import { GatheringPost } from '../../community/board/type/boardList';

const apiKey = import.meta.env.BASE_URL;

//게시글 등록 api
export const gatheringCreatePost = async (postData: GatheringPost) => { //CommuPost : 커뮤니티 Post : 모임 게시글
    console.log("게시글 등록 요청 데이터:", postData);

    const response = await axios.post(apiKey + "/api/gatherings", postData);
    return response.data;
};
