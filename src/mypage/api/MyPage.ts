import axios from "axios";
import { MyPageMemberDataType, MyPageModifyMemberDataType } from "../type/MyPageTable";
import { AdminBoardColType, AdminCommentColType } from "../../admin/type/AdminCommunity";
import { ApiResponse, PageResponse } from "../../common/type/ApiResponse";
import { PostSimpleInfo, ReplySimpleInfo } from "../../common/component/Board/type/BoardDetailTypes";
import { Member } from "../../common/auth/type/type";
import { SearchCondition } from "../../common/type/common";
import { MyGatheringSimpleInfo } from "../pages/MyPageMyGatherings";
import { MyGatheringBoardSimpleInfo } from "../pages/MyPageGatheringBoard";

//BASE URL import
const BASE_URL = import.meta.env.VITE_API_URL;

export const getMyInformation = async (): Promise<ApiResponse<MyPageMemberDataType>> => {
  const member = await axios.get<ApiResponse<MyPageMemberDataType>>(`${BASE_URL}/member/authentication`);
  return member.data;
};

export const modifyMember = async (memberData: MyPageModifyMemberDataType) => {
  const member = await axios.patch<ApiResponse<MyPageModifyMemberDataType>>(`${BASE_URL}/member/modify`, memberData);
  return member.data;
};

//마이페이지 book review board 요청 get 메서드
export async function getMyPageBookReviewBoard(userId: string) {
  return new Promise<AdminBoardColType>((resolve, reject) => {
    (async () => {
      try {
        const res = await axios.get<AdminBoardColType>(`/mypage/bookreview/board/${userId}`);
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
  return new Promise<AdminCommentColType>((resolve, reject) => {
    (async () => {
      try {
        const res = await axios.get<AdminCommentColType>(`/mypage/bookreview/comment/${userId}`);
        resolve(res.data);
      } catch (err) {
        reject(err);
        console.log("error occurs while to get MyPage Board Data :" + err);
      }
    })();
  });
}

export const getMyBoardAll = async (pageNum: number): Promise<ApiResponse<PageResponse<PostSimpleInfo>>> => {
  const response = await axios.get<ApiResponse<PageResponse<PostSimpleInfo>>>(
    `${BASE_URL}/community/board/mylist?pageNum=${pageNum}`
  );
  return response.data;
};

export const searchMyBoards = async (
  req: SearchCondition,
  pageNum: number
): Promise<ApiResponse<PageResponse<PostSimpleInfo>>> => {
  const response = await axios.post<ApiResponse<PageResponse<PostSimpleInfo>>>(
    `${BASE_URL}/community/board/mylist/search?pageNum=${pageNum}`,
    req
  );
  return response.data;
};

export const getMyCommentAll = async (pageNum: number): Promise<ApiResponse<PageResponse<ReplySimpleInfo>>> => {
  const response = await axios.get<ApiResponse<PageResponse<ReplySimpleInfo>>>(
    `${BASE_URL}/reply/mylist?pageNum=${pageNum}`
  );
  return response.data;
};

export const searchMyComments = async (
  req: SearchCondition,
  pageNum: number
): Promise<ApiResponse<PageResponse<ReplySimpleInfo>>> => {
  const response = await axios.post<ApiResponse<PageResponse<ReplySimpleInfo>>>(
    `${BASE_URL}/reply/mylist/search?pageNum=${pageNum}`,
    req
  );
  return response.data;
};

//========================================================================================

// mypage gathering API
export const getMyGatheringAll = async (
  pageNum: number
): Promise<ApiResponse<PageResponse<MyGatheringSimpleInfo>>> => {
  const response = await axios.get<ApiResponse<PageResponse<MyGatheringSimpleInfo>>>(
    `${BASE_URL}/gathering/myList?pageNum=${pageNum}`
  );
  return response.data;
};

export const searchMyGatherings = async (
  req: SearchCondition,
  pageNum: number
): Promise<ApiResponse<PageResponse<MyGatheringSimpleInfo>>> => {
  const response = await axios.post<ApiResponse<PageResponse<MyGatheringSimpleInfo>>>(
    `${BASE_URL}/gathering/myList/search?pageNum=${pageNum}`,
    req
  );
  return response.data;
};

export const restoreGathering = async (code: string, reason: string) => {
  const token = localStorage.getItem("accessToken");
  await axios.post(
    `${BASE_URL}/gathering/${code}/restore`,
    { reason },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getMyGatheringBoardAll = async (
  pageNum: number
): Promise<ApiResponse<PageResponse<MyGatheringBoardSimpleInfo>>> => {
  const response = await axios.get<ApiResponse<PageResponse<MyGatheringBoardSimpleInfo>>>(
    `${BASE_URL}/gathering/myBoardList?pageNum=${pageNum}`
  );
  return response.data;
};

export const searchMyGatheringBoards = async (
  req: SearchCondition,
  pageNum: number
): Promise<ApiResponse<PageResponse<MyGatheringBoardSimpleInfo>>> => {
  const response = await axios.post<ApiResponse<PageResponse<MyGatheringBoardSimpleInfo>>>(
    `${BASE_URL}/gathering/myBoardList/search?pageNum=${pageNum}`,
    req
  );
  return response.data;
};