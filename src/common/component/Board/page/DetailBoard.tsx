import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomButton from "../../CustomButton";
import { PostDetail } from "../type/BoardDetailTypes";
import { ApiResponse } from "../../../type/ApiResponse";
import { useNavigate } from "react-router";
import BreadCrumb from "../../BreadCrumb";
import ReplyList from "../../../../community/reply/page/ReplyList";
import { Viewer } from "@toast-ui/react-editor";
import { useAuthStore } from "../../../../store";

interface DetailBoardProps {
  mainTopic: string;
  subTopic: string;
  postCode: string;
  editPageUri: string;
  listPageUri: string;
  GetBoardDetail: (postId: string) => Promise<ApiResponse<PostDetail>>;
  DeleteBoard: (postId: string) => void;
  SetLikePost?: (postId: string) => Promise<void>;
  ResetLikePost?: (postId: string) => Promise<void>;
  NavigateToNextPost?: () => void;
  NavigateToPrevPost?: () => void;
}

//postId는 커뮤Id or 모임Id
const DetailBaord: React.FC<DetailBoardProps> = ({
  mainTopic,
  subTopic,
  postCode,
  editPageUri,
  listPageUri,
  GetBoardDetail,
  DeleteBoard,
  SetLikePost,
  ResetLikePost,
  NavigateToNextPost,
  NavigateToPrevPost,
}) => {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const [detailData, setDetailData] = useState<PostDetail>();
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string>("");

  // 댓글 데이터 불러오기
  useEffect(() => {
    loadDetailData();
  }, [postCode]);

  const loadDetailData = async () => {
    try {
      const data = await GetBoardDetail(postCode);
      setDetailData(data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setIsDeleted(true);
        setDeleteMessage(error.response.data?.msg || "");
      }
    }
  };

  const handleDeleteBoard = () => {
    if (confirm("게시글을 삭제하시겠습니까?")) {
      DeleteBoard(postCode);
      navigate(listPageUri);
    }
  };

  const PostDetails = () => {
    return (
      <div className="p-6 border-t">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{detailData?.post.title}</h1>
            {userInfo?.id != null && detailData?.post.member_id === userInfo.id && (
              <div className="flex items-center space-x-4">
                <CustomButton onClick={() => navigate(editPageUri)} color="white">
                  <>
                    <i className="fas fa-edit mr-2"></i>수정
                  </>
                </CustomButton>
                <CustomButton onClick={() => handleDeleteBoard()} color="red">
                  <>
                    <i className="fas fa-trash-alt mr-2"></i>삭제
                  </>
                </CustomButton>
              </div>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500 pb-4 border-b">
            <span className="mr-4 flex items-center">
              <i className="fas fa-user mr-2"></i>
              {detailData?.post.author}
            </span>
            <span className="mr-4 flex items-center">
              <i className="fas fa-eye mr-2"></i>
              {detailData?.post.views}
            </span>
            <span className="mr-4 flex items-center">
              <i className="fas fa-heart mr-2"></i>
              {detailData?.post.likes_cnt}
            </span>

            <span className="ml-auto flex items-center">
              <i className="fas fa-calendar mr-2"></i>
              {detailData?.post.reg_date}
            </span>
          </div>
        </div>
        <div className="mb-8">
          <div className="prose max-w-none">
            {detailData && <Viewer initialValue={detailData.post.content} />}
          </div>
        </div>
      </div>
    );
  };

  const LikeButton = () => {
    // 좋아요 토글 상태관리 (Optimistic UI with race condition 방지)
    const handleLikeToggle = async () => {
      if (!postCode || isLikeLoading) return;
      setIsLikeLoading(true);

      const wasLiked = detailData?.post.is_liked;

      // Optimistic UI 업데이트
      setDetailData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          post: {
            ...prev.post,
            is_liked: !wasLiked,
            likes_cnt: wasLiked ? prev.post.likes_cnt - 1 : prev.post.likes_cnt + 1,
          },
        };
      });

      try {
        if (wasLiked && ResetLikePost) {
          await ResetLikePost(postCode);
        } else if (!wasLiked && SetLikePost) {
          await SetLikePost(postCode);
        }
      } catch (error) {
        console.error("좋아요 처리 중 오류:", error);
        // 오류 발생 시 UI 롤백
        setDetailData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            post: {
              ...prev.post,
              is_liked: wasLiked,
              likes_cnt: wasLiked ? prev.post.likes_cnt + 1 : prev.post.likes_cnt - 1,
            },
          };
        });
      } finally {
        setIsLikeLoading(false);
      }
    };

    return (
      <button
        onClick={handleLikeToggle}
        disabled={isLikeLoading}
        className={
          "px-6 py-3 bg-gray-100 rounded-lg whitespace-nowrap cursor-pointer hover:bg-gray-200 flex items-center disabled:opacity-50"
        }>
        <i className={`fas fa-heart mr-2 ${detailData?.post.is_liked ? "text-red-500" : "text-gray-500"}`}></i>
        <span>좋아요</span>
        <span className="ml-2 text-gray-600">{detailData?.post.likes_cnt}</span>
      </button>
    );
  };

  const PostNavigateBar = () => {
    return (
      <div className="flex justify-between items-center mt-6">
        {NavigateToNextPost && (
          <CustomButton onClick={() => NavigateToNextPost()} color="white" customClassName="px-4 py-2">
            <>
              <i className="fas fa-arrow-left mr-2"></i>다음 글
            </>
          </CustomButton>
        )}
        <CustomButton onClick={() => navigate(listPageUri)} color="black" customClassName="px-4 py-2">
          <>
            <i className="fas fa-list mr-2"></i>목록
          </>
        </CustomButton>
        {NavigateToPrevPost && (
          <CustomButton onClick={() => NavigateToPrevPost()} color="white" customClassName="px-4 py-2">
            <>
              이전 글<i className="fas fa-arrow-right ml-2"></i>
            </>
          </CustomButton>
        )}
      </div>
    );
  };

  if (!postCode) {
    return <div>잘못된 접근입니다.</div>;
  }

  if (isDeleted) {
    return (
      <div>
        <BreadCrumb major={mainTopic} sub={subTopic} />
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <i className="fas fa-ban text-5xl mb-4 text-gray-400"></i>
          <p className="text-xl font-semibold mb-2">삭제된 게시글입니다.</p>
          {deleteMessage && (
            <p className="text-sm text-gray-400 mb-6">{deleteMessage}</p>
          )}
          <CustomButton onClick={() => navigate(listPageUri)} color="black" customClassName="px-6 py-2 mt-4">
            <>
              <i className="fas fa-list mr-2"></i>목록으로
            </>
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BreadCrumb major={mainTopic} sub={subTopic} />
      {PostDetails()}
      <div className="flex items-center justify-center space-x-2 mb-8">{(SetLikePost || ResetLikePost) && LikeButton()}</div>
      <ReplyList postCode={postCode} />
      {PostNavigateBar()}
    </div>
  );
};

export default DetailBaord;
