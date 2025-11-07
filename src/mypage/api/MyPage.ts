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
import { SearchCondition } from "../../community/board/type/board";

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

export const getMyBoardAll = async (pageNum: number): Promise<ApiResponse<PageResponse<PostSimpleInfo>>> => {
  const response = await axios.get<ApiResponse<PageResponse<PostSimpleInfo>>>(`${BASE_URL}/community/board/mylist?pageNum=${pageNum}`);
  return response.data;
}

export const searchMyBoards = async (req: SearchCondition, pageNum: number): Promise<ApiResponse<PageResponse<PostSimpleInfo>>> => {
  const response = await axios.post<ApiResponse<PageResponse<PostSimpleInfo>>>(`${BASE_URL}/community/board/mylist/search?pageNum=${pageNum}`, req);
  return response.data;
}

export const getMyCommentAll = async (pageNum: number): Promise<ApiResponse<PageResponse<ReplySimpleInfo>>> => {
  const response = await axios.get<ApiResponse<PageResponse<ReplySimpleInfo>>>(`${BASE_URL}/reply/mylist?pageNum=${pageNum}`);
  return response.data;
}

export const searchMyComments = async (req: SearchCondition, pageNum: number): Promise<ApiResponse<PageResponse<ReplySimpleInfo>>> => {
  const response = await axios.post<ApiResponse<PageResponse<ReplySimpleInfo>>>(`${BASE_URL}/reply/mylist/search?pageNum=${pageNum}`, req);
  return response.data;
}
