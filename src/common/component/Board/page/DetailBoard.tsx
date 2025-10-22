import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomButton from "../../CustomButton";
import { ReplyRequest } from "../../../../community/reply/type/reply";
import { deleteReply, editReply } from "../../../../community/reply/api/replyApi";
import { PostDetail } from "../type/BoardDetail.types";
import { ApiResponse } from "../../../type/ApiResponse";
import axios, { AxiosError } from "axios";

interface DetailBoardProps {
  postCode: string;
  GetBoardDetail: (postId: string) => Promise<ApiResponse<PostDetail>>;
  DeleteBoard: (postId: string) => void;
  //게시글 좋아요 props arg1 : 게시글 아이디, arg2: 모임 여부
  ToggleLikePost: (postId: string) => void;
  CreateReply: (req: ReplyRequest) => Promise<ApiResponse<string>>;
}

//postId는 커뮤Id or 모임Id
const DetailBaord: React.FC<DetailBoardProps> = ({ postCode, GetBoardDetail, DeleteBoard, ToggleLikePost, CreateReply }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [detailData, setDetailData] = useState<PostDetail>();
  const [parentCommentContent, setParentCommentContent] = useState<string>(""); // 부모 댓글 입력
  const [replyContent, setReplyContent] = useState<string>(""); // 댓글/대댓글 공통 입력
  const [reReply_yn, setReReply_yn] = useState<string | null>(null); // 부모 댓글 여부(대댓글 or 댓글 판단)
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>(""); // 수정 중인 글 내용

  const handleEditOn = (replyCode: string, currentContent: string) => {
    setEditingReplyId(replyCode);
    setEditContent(currentContent);
  };

  // 댓글 데이터 불러오기
  useEffect(() => {
    loadDetailData();
  }, [postCode]);

  const loadDetailData = async () => {
    if (!postCode) {
      return;
    }
    try {
      const data = await GetBoardDetail(postCode);
      setDetailData(data.data);
    } catch (error) {
      //삭제된 게시글 일 경우 네비게이트
      if(axios.isAxiosError(error) && error.response?.data.code === 400) {
        alert(error.response.data.data);
        navigate(-1);
      }
    }
  };

  const handleDeleteBoard = async (postId: string) => {
    if(confirm("게시글을 삭제하시겠습니까?")) {
      await DeleteBoard(postId);
      navigate(-1)
    }
  }

  // 좋아요 토글 상태관리 (Optimistic UI)
  const handleLikeToggle = async () => {
    if (!postCode) {
      return;
    }
    const newLikeState = !detailData?.post.is_liked;
    // Optimistic UI 업데이트
    setDetailData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        post: {
          ...prev.post,
          isLike: newLikeState,
          likes: newLikeState ? prev.post.likes_cnt + 1 : prev.post.likes_cnt - 1,
        },
      };
    });

    try {
      await ToggleLikePost(postCode);
    } catch (error) {
      console.error("좋아요 토글 중 오류:", error);
      // 오류 발생 시 UI 롤백
      setDetailData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          post: {
            ...prev.post,
            isLike: !newLikeState,
            likes: !newLikeState ? prev.post.likes_cnt + 1 : prev.post.likes_cnt - 1,
          },
        };
      });
    }
  };

  const handleEditReply = async (replyCode: string, content: string) => {
    // editReply(replyCode, content);
    await handleEditOn(replyCode, content);
  }

  const handleDeleteReply = async (replyCode: string) => {
    if(confirm("댓글을 삭제하시겠습니까?")) {
      await deleteReply(replyCode);
      loadDetailData();
    }
  }

  const handleReplySubmit = async () => {
    if (!postCode) {
      return;
    }

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

    const newReply = {
      reply_code: Date.now().toString(), // 임시 코드 (고유값)
      member_id: "현재 사용자", // TODO 실제 사용자 정보로 변경 필요
      content,
      date: new Date().toISOString().slice(0, 10),
      likes: 0,
      reReply: [],
    };

    setNewReply(newReply);

    try {
      CreateReply({
        postCode: postCode,
        content: content,
        parentReplyCode: reReply_yn
      }).then((res) => {
        loadDetailData();
      }) 
    } catch (error) {
      if(axios.isAxiosError(error)) {
        alert(error.response?.data.data);
      }
      rollbackReply(newReply);
    } finally {
      setReReply_yn(null);
    }
  };

  const rollbackReply = (newReply: any) => {
    setDetailData((prev) => {
      if (!prev) return prev;
      if (reReply_yn === null) {
        return {
          ...prev,
          replies: prev.replies?.filter((reply) => reply.reply_code !== newReply.reply_code),
        };
      }
      return {
        ...prev,
        replies: prev.replies?.map((parentReply) =>
          parentReply.reply_code === reReply_yn
            ? {
                ...parentReply,
                reReply: parentReply.replies?.filter((reReply) => reReply.reply_code !== newReply.reply_code),
              }
            : parentReply
        ),
      };
    });
  }

  const setNewReply = (newReply: any) => {
    setDetailData((prev) => {
      if (!prev) return prev
      if (reReply_yn === null) {
        return {
          ...prev,
          replys: [
            ...(prev.replies ?? []),
            newReply,
          ],
        }
      }
      return {
        ...prev,
        replys: (prev.replies ?? []).map((parentReply) => {
          if (parentReply.reply_code === reReply_yn) {
            return {
              ...parentReply,
              reReply: [
                ...(parentReply.replies ?? []),
                newReply,
              ],
            };
          }
          return parentReply;
        }),
      }
    });
  }

  // 답글 클릭 로직 수정 (부모 댓글 / 대댓글 공통)
  const handleReplyClick = (replyCode: string) => {
    // 이미 열려있는 경우 클릭 시 닫힘 (토글)
    if (reReply_yn === replyCode) {
      setReReply_yn(null);
      setReplyContent(""); // 초기화
    } else {
      setReReply_yn(replyCode);
      setReplyContent(""); // 초기화
    }
    console.log(reReply_yn);
  };

  if (!postCode) {
    return <div>잘못된 접근입니다.</div>;
  }

  return (
    <div>
      <div className="p-6 border-t">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{detailData?.post.title}</h1>
            <div className="flex items-center space-x-4">
              <CustomButton onClick={() => navigate(`/boardEdit?postCode=${postCode}&categoryId=${searchParams.get('categoryId')}`)} color="white">
                <>
                  <i className="fas fa-edit mr-2"></i>수정
                </>
              </CustomButton>
              <CustomButton onClick={() => handleDeleteBoard(postCode)} color="red">
                <>
                  <i className="fas fa-trash-alt mr-2"></i>삭제
                </>
              </CustomButton>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500 pb-4 border-b">
            <span className="mr-4 flex items-center">
              <i className="fas fa-user mr-2"></i>
              {detailData?.post.member_id}
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
            <p className="text-gray-800 leading-relaxed">{detailData?.post.content}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-2 mb-8">
        <button
          onClick={handleLikeToggle}
          className={`px-6 py-3 bg-gray-100 rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-200 flex items-center`}>
          <i className={`fas fa-heart mr-2 ${detailData?.post.is_liked ? "text-red-500" : "text-gray-500"}`}></i>
          <span>좋아요</span>
          <span className="ml-2 text-gray-600">{detailData?.post.likes_cnt}</span>
        </button>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">
            댓글 
            <span className="text-gray-500">{
              (function countReplies(replies = []) {
                let count = 0;
                for (const reply of replies) {
                  count += 1;
                  if (Array.isArray(reply.replies) && reply.replies.length > 0) {
                    count += countReplies(reply.replies);
                  }
                }
                return count;
              })(detailData?.replies)}
            </span>
          </h3>
        </div>
        <div className="mb-6">
          {" "}
          {/* start create reply */}
          <div className="flex items-start space-x-4">
            <div className="flex-grow">
              <textarea
                className="w-full h-[90px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="댓글을 작성해주세요."
                value={parentCommentContent}
                onChange={(e) => setParentCommentContent(e.target.value)} // 부모 댓글 상태 반영
              ></textarea>
            </div>
            <CustomButton onClick={handleReplySubmit} color="black" customClassName="h-[90px] px-6">
              <>등록</>
            </CustomButton>
          </div>
        </div>{" "}
        {/* end create reply */}
        <div className="space-y-6">
          {" "}
          {/* start reply rereply */}
          {detailData?.replies?.map((parentReply) => (
            <div key={parentReply.reply_code} className="border-b pb-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{parentReply.member_id}</span>
                  <span className="text-sm text-gray-500">{parentReply.create_at}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {/* 좋아요 버튼 (부모 댓글) */}
                  <CustomButton
                    onClick={() => alert(`좋아요 버튼 클릭됨 (좋아요 수: ${parentReply.likes})`)}
                    color="none">
                    <i className="fas fa-heart mr-1 text-red-500"></i>
                    {parentReply.likes}
                  </CustomButton>
                  {/* 답글 버튼 */}
                  <CustomButton onClick={() => handleReplyClick(parentReply.reply_code)} color="none">
                    <i className="fas fa-reply mr-1"></i>답글
                  </CustomButton>
                  <CustomButton onClick={() => handleEditReply(parentReply.reply_code, parentReply.content)} color="none">
                    <i className="fas fa-pencil"></i>수정
                  </CustomButton>
                  <CustomButton onClick={() => handleDeleteReply(parentReply.reply_code)} color="none">
                    <i className="fas fa-trash mr-1"></i>삭제
                  </CustomButton>
                </div>
              </div>
              {editingReplyId === parentReply.reply_code ? (
                <textarea
                  className="w-full p-2 border rounded"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                />
              ) : (
                <p className="text-gray-800">{parentReply.content}</p>
              )}
              {editingReplyId === parentReply.reply_code && (
                <div className="mt-2 space-x-2 flex justify-end">
                  <button
                    onClick={ async () => {
                      await editReply(editingReplyId!, editContent);
                      loadDetailData();
                      setEditingReplyId(null);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow transition"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingReplyId(null)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                  >
                    취소
                  </button>
                </div>
              )}

              {/* 대댓글 렌더링 (있는 경우만) */}
              {parentReply.replies && parentReply.replies.length > 0 && (
                <div className="ml-6 mt-4 space-y-4">
                  {parentReply.replies.map((reReply) => (
                    <div key={reReply.reply_code} className="border-l-2 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{reReply.member_id}</span>
                          <span className="text-sm text-gray-500">{reReply.create_at}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* 좋아요 버튼 (대댓글) */}
                          <CustomButton
                            onClick={() => alert(`대댓글 좋아요 버튼 클릭됨 (좋아요 수: ${reReply.likes})`)}
                            color="none">
                            <i className="fas fa-heart mr-1 text-red-500"></i>
                            {reReply.likes}
                          </CustomButton>
                          <CustomButton onClick={() => handleEditReply(reReply.reply_code, reReply.content)} color="none">
                            <i className="fas fa-pencil"></i>수정
                          </CustomButton>
                          <CustomButton onClick={() => handleDeleteReply(reReply.reply_code)} color="none">
                            <i className="fas fa-trash mr-1"></i>삭제
                          </CustomButton>
                        </div>
                      </div>
                      {editingReplyId === reReply.reply_code ? (
                        <textarea
                          className="w-full p-2 border rounded"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={4}
                        />
                      ) : (
                        <p className="text-gray-800">{reReply.content}</p>
                      )}
                      {editingReplyId === reReply.reply_code && (
                        <div className="mt-2 space-x-2 flex justify-end">
                          <button
                            onClick={ async () => {
                              await editReply(editingReplyId!, editContent);
                              loadDetailData();
                              setEditingReplyId(null);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow transition"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => setEditingReplyId(null)}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                          >
                            취소
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 대댓글 입력 폼 (항상 렌더링, 조건부) */}
              {reReply_yn === parentReply.reply_code && (
                <div className="flex items-start space-x-4 mt-2">
                  <textarea
                    className="w-full h-[60px] p-2 border rounded-lg resize-none focus:outline-none"
                    placeholder="답글을 작성해주세요."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)} // 상태값 정상 반영
                  ></textarea>
                  <CustomButton onClick={handleReplySubmit} color="black" customClassName="h-[60px] px-6">
                    등록
                  </CustomButton>
                </div>
              )}
            </div>
          ))}
        </div>{" "}
        {/* end reply rereply */}
        <div className="flex justify-between items-center mt-6">
          <CustomButton onClick={() => alert("이전 게시글 버튼 클릭함")} color="white" customClassName="px-4 py-2">
            <>
              <i className="fas fa-arrow-left mr-2"></i>이전 글
            </>
          </CustomButton>
          <CustomButton onClick={() => navigate(`/boardList?categoryId=${searchParams.get("categoryId")}`)} color="black" customClassName="px-4 py-2">
            <>
              <i className="fas fa-list mr-2"></i>목록
            </>
          </CustomButton>
          <CustomButton onClick={() => alert("다음 게시글 버튼 클릭함")} color="white" customClassName="px-4 py-2">
            <>
              다음 글<i className="fas fa-arrow-right ml-2"></i>
            </>
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default DetailBaord;
