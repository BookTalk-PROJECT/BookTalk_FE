import axios from "axios";
import {
  MyPageBoardType,
  MyPageBookCommentType,
  MyPageMemberDataType,
  MyPageModifyMemberDataType,
} from "../type/MyPageBoardTable";
import { ApiResponse, PageResponse } from "../../common/type/ApiResponse";
import { PostSimpleInfo, ReplySimpleInfo } from "../../common/component/Board/type/BoardDetail.types";
import { Member } from "../../common/auth/type/type";

//BASE URL import
const BASE_URL = import.meta.env.VITE_API_URL;

export const getMyInformation = async (): Promise<ApiResponse<MyPageMemberDataType>> => {
  const member = await axios.get<ApiResponse<MyPageMemberDataType>>(`${BASE_URL}/member/authentication`);
  return member.data;
}

export const modifyMember = async (memberData: MyPageModifyMemberDataType) => {
  const member = await axios.patch<ApiResponse<MyPageModifyMemberDataType>>(`${BASE_URL}/member/modify`, memberData);
  return member.data;
};

//마이페이지 book review board 요청 get 메서드
export async function getMyPageBookReviewBoard(userId: string) {
  return new Promise<MyPageBoardType>((resolve, reject) => {
    (async () => {
      try {
        const res = await axios.get<MyPageBoardType>(`/mypage/bookreview/board/${userId}`);
        resolve(res.data);
      } catch (err) {
        reject(err);
        console.log("error occurs while to get MyPage Board Data :" + err);
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
        console.log("error occurs while to get MyPage Board Data :" + err);
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
        console.log("error occurs while to get MyPage Board Data :" + err);
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
        console.log("error occurs while to get MyPage Board Data :" + err);
      }
    })();
  });
}
export const getMyBoardAll = async (pageNum: number): Promise<ApiResponse<PageResponse<PostSimpleInfo>>> => {
  const posts = await axios.get<ApiResponse<PageResponse<PostSimpleInfo>>>(`${BASE_URL}/community/board/mylist?pageNum=${pageNum}`);
  return posts.data;
}

export const getMyCommentAll = async (pageNum: number): Promise<ApiResponse<PageResponse<ReplySimpleInfo>>> => {
  const posts = await axios.get<ApiResponse<PageResponse<ReplySimpleInfo>>>(`${BASE_URL}/reply/mylist?pageNum=${pageNum}`);
  return posts.data;
}

export const getBoardAdminAll = async (pageNum: number): Promise<ApiResponse<PageResponse<PostSimpleInfo>>> => {
  const posts = await axios.get<ApiResponse<PageResponse<PostSimpleInfo>>>(`${BASE_URL}/community/board/admin/all?pageNum=${pageNum}`);
  return posts.data;
}

export const restrictBoard = async (boardCode: string, del_reason: string): Promise<ApiResponse<string>> => {
  const posts = await axios.patch<Promise<ApiResponse<string>>>(`${BASE_URL}/community/board/restrict`, {targetCode: boardCode, delReason: del_reason});
  return posts.data;
}

export const recoverBoard = async (boardCode: string): Promise<ApiResponse<string>> => {
  const posts = await axios.patch<Promise<ApiResponse<string>>>(`${BASE_URL}/community/board/recover/${boardCode}`);
  return posts.data;
}

export const getCommentAdminAll = async (pageNum: number): Promise<ApiResponse<PageResponse<ReplySimpleInfo>>> => {
  const posts = await axios.get<ApiResponse<PageResponse<ReplySimpleInfo>>>(`${BASE_URL}/reply/admin/all?pageNum=${pageNum}`);
  return posts.data;
}

export const restrictComment = async (boardCode: string, del_reason: string): Promise<ApiResponse<string>> => {
  const posts = await axios.patch<Promise<ApiResponse<string>>>(`${BASE_URL}/reply/restrict`, {targetCode: boardCode, delReason: del_reason});
  return posts.data;
}

export const recoverComment = async (boardCode: string): Promise<ApiResponse<string>> => {
  const posts = await axios.patch<Promise<ApiResponse<string>>>(`${BASE_URL}/reply/recover/${boardCode}`);
  return posts.data;
}
