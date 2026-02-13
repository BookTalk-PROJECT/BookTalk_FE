import { useEffect, useState, useCallback } from "react";
import { Reply } from "../../../common/component/Board/type/BoardDetailTypes";
import { deleteReply, editReply, getRepliesPaginated, postReply, setLikeReply, resetLikeReply } from "../api/replyApi";
import axios from "axios";
import CustomButton from "../../../common/component/CustomButton";
import { useAuthStore } from "../../../store";

type ReplyListProps = {
  postCode: string;
};

type ReplyItemProps = {
  reply: Reply;
  depth: number;
  reReply_yn: string | null;
  replyContent: string;
  editingReplyId: string | null;
  editContent: string;
  isAuthenticated: boolean;
  currentMemberId?: number;
  onReplyClick: (replyCode: string) => void;
  onEditReply: (replyCode: string, content: string) => void;
  onDeleteReply: (replyCode: string) => void;
  onLikeToggle: (replyCode: string, isCurrentlyLiked: boolean) => void;
  onEditContentChange: (content: string) => void;
  onEditSave: (replyCode: string) => void;
  onEditCancel: () => void;
  onReplyContentChange: (content: string) => void;
  onReplySubmit: () => void;
};

function ReplyItem({
  reply,
  depth,
  reReply_yn,
  replyContent,
  editingReplyId,
  editContent,
  isAuthenticated,
  currentMemberId,
  onReplyClick,
  onEditReply,
  onDeleteReply,
  onLikeToggle,
  onEditContentChange,
  onEditSave,
  onEditCancel,
  onReplyContentChange,
  onReplySubmit,
}: ReplyItemProps) {
  const isRoot = depth === 0;
  const maxReplyDepth = 2; // depth 2까지만 답글 버튼 표시

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }
    onLikeToggle(reply.reply_code, !!reply.is_liked);
  };

  return (
    <div className={isRoot ? "border-b pb-6" : "border-l-2 pl-4"}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{reply.member_name}</span>
          <span className="text-sm text-gray-500">{reply.create_at}</span>
        </div>
        <div className="flex items-center space-x-2">
          <CustomButton
            onClick={handleLikeClick}
            color="none">
            <i className={`fas fa-heart mr-1 ${reply.is_liked ? "text-red-500" : "text-gray-400"}`}></i>
            {reply.likes}
          </CustomButton>
          {depth < maxReplyDepth && (
            <CustomButton onClick={() => onReplyClick(reply.reply_code)} color="none">
              <i className="fas fa-reply mr-1"></i>답글
            </CustomButton>
          )}
          {currentMemberId != null && reply.member_id === currentMemberId && (
            <>
              <CustomButton onClick={() => onEditReply(reply.reply_code, reply.content)} color="none">
                <i className="fas fa-pencil"></i>수정
              </CustomButton>
              <CustomButton onClick={() => onDeleteReply(reply.reply_code)} color="none">
                <i className="fas fa-trash mr-1"></i>삭제
              </CustomButton>
            </>
          )}
        </div>
      </div>
      {editingReplyId === reply.reply_code ? (
        <>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 outline-none"
            value={editContent}
            onChange={(e) => onEditContentChange(e.target.value)}
            rows={4}
          />
          <div className="mt-2 space-x-2 flex justify-end">
            <button
              onClick={() => onEditSave(reply.reply_code)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shadow transition">
              저장
            </button>
            <button
              onClick={onEditCancel}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
              취소
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-800">{reply.content}</p>
      )}

      {/* 대댓글 재귀 렌더링 */}
      {reply.replies && reply.replies.length > 0 && (
        <div className="ml-6 mt-4 space-y-4">
          {reply.replies.map((childReply) => (
            <ReplyItem
              key={childReply.reply_code}
              reply={childReply}
              depth={depth + 1}
              reReply_yn={reReply_yn}
              replyContent={replyContent}
              editingReplyId={editingReplyId}
              editContent={editContent}
              isAuthenticated={isAuthenticated}
              currentMemberId={currentMemberId}
              onReplyClick={onReplyClick}
              onEditReply={onEditReply}
              onDeleteReply={onDeleteReply}
              onLikeToggle={onLikeToggle}
              onEditContentChange={onEditContentChange}
              onEditSave={onEditSave}
              onEditCancel={onEditCancel}
              onReplyContentChange={onReplyContentChange}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      )}

      {/* 답글 입력 폼 */}
      {reReply_yn === reply.reply_code && (
        <div className="flex items-start space-x-4 mt-2">
          <textarea
            className="w-full h-[60px] p-2 border rounded-lg resize-none focus:outline-none"
            placeholder="답글을 작성해주세요."
            value={replyContent}
            onChange={(e) => onReplyContentChange(e.target.value)}
          ></textarea>
          <CustomButton onClick={onReplySubmit} color="black" customClassName="h-[60px] px-6">
            등록
          </CustomButton>
        </div>
      )}
    </div>
  );
}

export default function ReplyList({ postCode }: ReplyListProps) {
  const { userInfo, isAuthenticated } = useAuthStore();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [parentCommentContent, setParentCommentContent] = useState<string>("");
  const [reReply_yn, setReReply_yn] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  // Pagination state
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const loadReplies = useCallback(async (page: number, reset: boolean = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await getRepliesPaginated(postCode, page, 10);
      const newReplies = response.data.content || [];
      const totalPages = response.data.totalPages || 0;
      const totalElements = response.data.totalElements || 0;

      if (reset) {
        setReplies(newReplies);
      } else {
        setReplies((prev) => [...prev, ...newReplies]);
      }

      setTotalCount(totalElements);
      setHasMore(page < totalPages);
      setPageNum(page);
    } catch (error) {
      console.error("Failed to load replies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postCode, isLoading]);

  const handleReplySubmit = async () => {
    if (!postCode) return;

    const content = reReply_yn === null ? parentCommentContent.trim() : replyContent.trim();
    if (!content) {
      alert(reReply_yn === null ? "댓글 내용을 입력하세요." : "대댓글 내용을 입력하세요.");
      return;
    }

    if (reReply_yn === null) {
      setParentCommentContent("");
    } else {
      setReplyContent("");
    }

    const newReply: Reply = {
      reply_code: Date.now().toString(),
      member_name: userInfo?.name || "사용자",
      content,
      replies: [],
      create_at: new Date().toISOString().slice(0, 10),
      likes: 0,
    };

    setNewReply(newReply);

    try {
      await postReply({
        postCode: postCode,
        content: content,
        parentReplyCode: reReply_yn,
      });
      // Reload first page to get the updated list
      loadReplies(1, true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.data);
      }
      rollbackReply(newReply);
    } finally {
      setReReply_yn(null);
    }
  };

  // 재귀적으로 대댓글에 새 댓글 추가
  const addReplyToTree = (replies: Reply[], parentCode: string, newReply: Reply): Reply[] => {
    return replies.map((reply) => {
      if (reply.reply_code === parentCode) {
        return {
          ...reply,
          replies: [...(reply.replies ?? []), newReply],
        };
      }
      if (reply.replies && reply.replies.length > 0) {
        return {
          ...reply,
          replies: addReplyToTree(reply.replies, parentCode, newReply),
        };
      }
      return reply;
    });
  };

  const setNewReply = (newReply: Reply) => {
    setReplies((prev) => {
      if (!prev) return prev;
      if (reReply_yn === null) {
        return [...prev, newReply];
      }
      return addReplyToTree(prev, reReply_yn, newReply);
    });
  };

  // 재귀적으로 대댓글에서 댓글 제거
  const removeReplyFromTree = (replies: Reply[], replyCode: string): Reply[] => {
    return replies
      .filter((reply) => reply.reply_code !== replyCode)
      .map((reply) => {
        if (reply.replies && reply.replies.length > 0) {
          return {
            ...reply,
            replies: removeReplyFromTree(reply.replies, replyCode),
          };
        }
        return reply;
      });
  };

  const rollbackReply = (newReply: Reply) => {
    setReplies((prev) => {
      if (!prev) return prev;
      return removeReplyFromTree(prev, newReply.reply_code);
    });
  };

  const handleReplyClick = (replyCode: string) => {
    if (reReply_yn === replyCode) {
      setReReply_yn(null);
      setReplyContent("");
    } else {
      setReReply_yn(replyCode);
      setReplyContent("");
    }
  };

  const handleEditOn = (replyCode: string, currentContent: string) => {
    setEditingReplyId(replyCode);
    setEditContent(currentContent);
  };

  const handleEditReply = (replyCode: string, content: string) => {
    handleEditOn(replyCode, content);
  };

  const handleDeleteReply = async (replyCode: string) => {
    if (confirm("댓글을 삭제하시겠습니까?")) {
      await deleteReply(replyCode);
      loadReplies(1, true);
    }
  };

  const handleEditSave = async (replyCode: string) => {
    await editReply(replyCode, editContent);
    loadReplies(1, true);
    setEditingReplyId(null);
  };

  const handleEditCancel = () => {
    setEditingReplyId(null);
  };

  // 재귀적으로 좋아요 토글
  const updateLikeInTree = (replies: Reply[], replyCode: string, isCurrentlyLiked: boolean): Reply[] => {
    return replies.map((reply) => {
      if (reply.reply_code === replyCode) {
        return {
          ...reply,
          likes: isCurrentlyLiked ? reply.likes - 1 : reply.likes + 1,
          is_liked: !isCurrentlyLiked,
        };
      }
      if (reply.replies && reply.replies.length > 0) {
        return {
          ...reply,
          replies: updateLikeInTree(reply.replies, replyCode, isCurrentlyLiked),
        };
      }
      return reply;
    });
  };

  // Like toggle handler with Optimistic UI
  const handleLikeToggle = async (replyCode: string, isCurrentlyLiked: boolean) => {
    // Optimistic UI update
    setReplies((prev) => updateLikeInTree(prev, replyCode, isCurrentlyLiked));

    try {
      if (isCurrentlyLiked) {
        await resetLikeReply(replyCode);
      } else {
        await setLikeReply(replyCode);
      }
    } catch (error) {
      // Rollback on error
      setReplies((prev) => updateLikeInTree(prev, replyCode, !isCurrentlyLiked));
      console.error("Failed to toggle like:", error);
    }
  };

  useEffect(() => {
    loadReplies(1, true);
  }, [postCode]);

  return (
    <div className="border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">
          댓글
          <span className="text-gray-500 ml-2">{totalCount}</span>
        </h3>
      </div>
      <div className="mb-6">
        <div className="flex items-start space-x-4">
          <div className="flex-grow">
            <textarea
              className="w-full h-[90px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="댓글을 작성해주세요."
              value={parentCommentContent}
              onChange={(e) => setParentCommentContent(e.target.value)}
            ></textarea>
          </div>
          <CustomButton onClick={handleReplySubmit} color="black" customClassName="h-[90px] px-6">
            <>등록</>
          </CustomButton>
        </div>
      </div>
      <div className="space-y-6">
        {replies.map((parentReply) => (
          <ReplyItem
            key={parentReply.reply_code}
            reply={parentReply}
            depth={0}
            reReply_yn={reReply_yn}
            replyContent={replyContent}
            editingReplyId={editingReplyId}
            editContent={editContent}
            isAuthenticated={isAuthenticated}
            currentMemberId={userInfo?.id}
            onReplyClick={handleReplyClick}
            onEditReply={handleEditReply}
            onDeleteReply={handleDeleteReply}
            onLikeToggle={handleLikeToggle}
            onEditContentChange={setEditContent}
            onEditSave={handleEditSave}
            onEditCancel={handleEditCancel}
            onReplyContentChange={setReplyContent}
            onReplySubmit={handleReplySubmit}
          />
        ))}

        {/* 더보기 버튼 */}
        {hasMore && !isLoading && (
          <div className="flex justify-center py-4">
            <button
              onClick={() => loadReplies(pageNum + 1)}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
            >
              댓글 더보기
            </button>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* End of comments indicator */}
        {!hasMore && replies.length > 0 && (
          <div className="text-center text-gray-500 py-4">마지막 댓글입니다</div>
        )}

        {/* No comments indicator */}
        {!isLoading && replies.length === 0 && (
          <div className="text-center text-gray-500 py-4">댓글이 없습니다. 첫 댓글을 작성해보세요!</div>
        )}
      </div>
    </div>
  );
}
