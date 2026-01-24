import axios from "axios";
import { MyPageMemberDataType, MyPageModifyMemberDataType } from "../type/MyPageTable";
import { AdminBoardColType, AdminCommentColType } from "../../admin/type/AdminCommunity";
import { ApiResponse, PageResponse } from "../../common/type/ApiResponse";
import { PostSimpleInfo, ReplySimpleInfo } from "../../common/component/Board/type/BoardDetailTypes";
import { Member } from "../../common/auth/type/type";
import { SearchCondition } from "../../common/type/common";
import { MyGatheringSimpleInfo } from "../pages/MyPageMyGatherings";
import { MyGatheringBoardSimpleInfo } from "../pages/MyPageGatheringBoard";
import { MyGatheringCommentSimpleInfo } from "../pages/MyPageGatheringComment";
import { MyGatheringRequestRow } from "../pages/MyPageGatheringRequestManage";
import { ApprovalRow, ApproveReq, RejectReq } from "../pages/MyPageGatheringApprovalManage";

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

// mypage gathering API(All)
export const getMyGatheringAll = async (pageNum: number): Promise<ApiResponse<PageResponse<MyGatheringSimpleInfo>>> => {
  const response = await axios.get<ApiResponse<PageResponse<MyGatheringSimpleInfo>>>(
    `${BASE_URL}/gathering/myList?pageNum=${pageNum}`
  );
  return response.data;
};
// mypage gathering API(Search)
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

// mypage gathering BoardAPI(All)
export const getMyGatheringBoardAll = async (
  pageNum: number
): Promise<ApiResponse<PageResponse<MyGatheringBoardSimpleInfo>>> => {
  const response = await axios.get<ApiResponse<PageResponse<MyGatheringBoardSimpleInfo>>>(
    `${BASE_URL}/gathering/myBoardList?pageNum=${pageNum}`
  );
  return response.data;
};

// mypage gathering BoardAPI(Search)
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

// mypage gathering reply API(All)
export const getMyGatheringCommentAll = async (
  pageNum: number
): Promise<ApiResponse<PageResponse<MyGatheringCommentSimpleInfo>>> => {
  const response = await axios.get<ApiResponse<PageResponse<MyGatheringCommentSimpleInfo>>>(
    `${BASE_URL}/reply/gathering/myList?pageNum=${pageNum}`
  );
  return response.data;
};

// mypage gathering reply API(Search)
export const searchMyGatheringComments = async (
  req: SearchCondition,
  pageNum: number
): Promise<ApiResponse<PageResponse<MyGatheringCommentSimpleInfo>>> => {
  const response = await axios.post<ApiResponse<PageResponse<MyGatheringCommentSimpleInfo>>>(
    `${BASE_URL}/reply/gathering/myList/search?pageNum=${pageNum}`,
    req
  );
  return response.data;
};

// mypage gathering recruit request API(All)
export const getMyGatheringRequestAll = async (
  pageNum: number
): Promise<ApiResponse<PageResponse<MyGatheringRequestRow>>> => {
  const response = await axios.get<ApiResponse<PageResponse<MyGatheringRequestRow>>>(
    `${BASE_URL}/gathering/myRecruitList?pageNum=${pageNum}`
  );
  return response.data;
};

export const getGatheringApprovalList = async (pageNum: number): Promise<ApiResponse<PageResponse<ApprovalRow>>> => {
  const response = await axios.get<ApiResponse<PageResponse<ApprovalRow>>>(
    `${BASE_URL}/gathering/requestMyList?pageNum=${pageNum}`
  );
  return response.data;
};

export const approveGatheringRequest = async (req: ApproveReq) => {
  // TODO: 백엔드 연결되면 실제 응답 타입에 맞춰 변경
  const response = await axios.post(`${BASE_URL}/gathering/approve`, req);
  return response.data;
};

export const rejectGatheringRequest = async (req: RejectReq) => {
  const response = await axios.post(`${BASE_URL}/gathering/reject`, req);
  return response.data;
};
