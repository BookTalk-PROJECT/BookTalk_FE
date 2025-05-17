import axios from "axios";
import { MyPageBoardType, MyPageBookCommentType } from "../type/MyPageBoardTable";

//BASE URL import
const BASE_URL = process.env.VITE_BASE_URL;

//마이페이지 book review board 요청 get 메서드
export async function getMyPageBookReviewBoard(userId: string) {
  return new Promise<MyPageBoardType>((resolve, reject) => {
    (async () => {
      try {
        const res = await axios.get<MyPageBoardType>(`/mypage/bookreview/board/${userId}`);
        resolve(res.data);
      } catch (err) {
        reject(err);
        console.log("error occurs while to get MyPage Board Data :"+err);
      }
    })();
  });
}

//마이페이지 book review board comment 요청 get 메서드
export async function getMyPageBookReviewComment(userId: string) {
  return new Promise<MyPageBookCommentType>((resolve, reject) => {
    (async () => {
      try {
        const res = await axios.get<MyPageBookCommentType>(`/mypage/bookreview/comment/${userId}`);
        resolve(res.data);
      } catch (err) {
        reject(err);
        console.log("error occurs while to get MyPage Board Data :"+err);
      }
    })();
  });
}

//마이페이지 community board 요청 get 메서드
export async function getMyPageCommunityBoard(userId: string) {
  return new Promise<MyPageBoardType>((resolve, reject) => {
    (async () => {
      try {
        const res = await axios.get<MyPageBoardType>(`/mypage/community/board/${userId}`);
        resolve(res.data);
      } catch (err) {
        reject(err);
        console.log("error occurs while to get MyPage Board Data :"+err);
      }
    })();
  });
}

//마이페이지 community comment 요청 get 메서드
export async function getMyPageCommunityComment(userId: string) {
  return new Promise<MyPageBookCommentType>((resolve, reject) => {
    (async () => {
      try {
        const res = await axios.get<MyPageBookCommentType>(`/mypage/community/comment/${userId}`);
        resolve(res.data);
      } catch (err) {
        reject(err);
        console.log("error occurs while to get MyPage Board Data :"+err);
      }
    })();
  });
}

