import { useEffect, useState } from "react";
import { Reply } from "../../../common/component/Board/type/BoardDetailTypes";
import { deleteReply, editReply, getReplies, postReply } from "../api/replyApi";
import axios from "axios";
import CustomButton from "../../../common/component/CustomButton";

type ReplyListProps = {
    postCode: string;
}

export default function ReplyList({
    postCode,
}: ReplyListProps) {
    const [replies, setReplies] = useState<Reply[]>([]);
    const [parentCommentContent, setParentCommentContent] = useState<string>(""); // 부모 댓글 입력
    const [reReply_yn, setReReply_yn] = useState<string | null>(null); // 부모 댓글 여부(대댓글 or 댓글 판단)
    const [replyContent, setReplyContent] = useState<string>(""); // 댓글/대댓글 공통 입력
    const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState<string>(""); // 수정 중인 글 내용

    const loadReplies = async () => {
        const response = await getReplies(postCode);
        setReplies(response.data);
    }

    const handleReplySubmit = async () => {
        if (!postCode) 
            return;

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
            reply_code: Date.now().toString(), // 임시 코드 (고유값)
            member_name: "현재 사용자", // TODO 실제 사용자 정보로 변경 필요
            content,
            replies: [],
            create_at: new Date().toISOString().slice(0, 10),
            likes: 0,
        };

        setNewReply(newReply);

        try {
            postReply({
                postCode: postCode,
                content: content,
                parentReplyCode: reReply_yn
            }).then((res) => {
                loadReplies();
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

    
  const setNewReply = (newReply: Reply) => {
    setReplies((prev) => {
        if (!prev) return prev;
        // 일반 댓글 추가
        if (reReply_yn === null) {
        return [
            ...prev,
            newReply,
        ];
        }
        // 대댓글(=부모 reply_code가 reReply_yn인 것)에 추가
        return prev.map((parentReply) => {
        if (parentReply.reply_code === reReply_yn) {
            // parentReply.replies(대댓글 배열)가 있다고 가정
            return {
            ...parentReply,
            replies: [
                ...(parentReply.replies ?? []),
                newReply,
            ],
            };
        }
        return parentReply;
        });
    });
    }

  const rollbackReply = (newReply: Reply) => {
    setReplies((prev) => {
        if (!prev) return prev;
        if (reReply_yn === null) {
        // 일반 댓글 삭제
        return prev.filter((reply) => reply.reply_code !== newReply.reply_code);
        }
        // 대댓글 삭제
        return prev.map((parentReply) => {
        if (parentReply.reply_code === reReply_yn) {
            return {
            ...parentReply,
            replies: (parentReply.replies ?? []).filter(
                (reReply) => reReply.reply_code !== newReply.reply_code
            ),
            };
        }
        return parentReply;
        });
    });
    };


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

  const handleEditOn = (replyCode: string, currentContent: string) => {
    setEditingReplyId(replyCode);
    setEditContent(currentContent);
  };

  const handleEditReply = (replyCode: string, content: string) => {
    handleEditOn(replyCode, content);
  }

  const handleDeleteReply = async (replyCode: string) => {
    if(confirm("댓글을 삭제하시겠습니까?")) {
      await deleteReply(replyCode);
      loadReplies();
    }
  }

    useEffect(() => {
        loadReplies();
    }, [])

    return (
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">
            댓글 
            {/* TODO: 무한스크롤 구현 후 카운트 로직 삭제 */}
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
              })(replies)}
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
          {replies.map((parentReply) => (
            <div key={parentReply.reply_code} className="border-b pb-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{parentReply.member_name}</span>
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
                <>
                <textarea
                  className="w-full p-2 border rounded"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                />
                <div className="mt-2 space-x-2 flex justify-end">
                  <button
                    onClick={ async () => {
                      await editReply(editingReplyId!, editContent);
                      loadReplies();
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
                </>
              ) : (
                <p className="text-gray-800">{parentReply.content}</p>
              )}
              {/* 대댓글 렌더링 (있는 경우만) */}
              {parentReply.replies && parentReply.replies.length > 0 && (
                <div className="ml-6 mt-4 space-y-4">
                  {parentReply.replies.map((reReply) => (
                    <div key={reReply.reply_code} className="border-l-2 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{reReply.member_name}</span>
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
                        <>
                        <textarea
                          className="w-full p-2 border rounded"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={4}
                        />
                        <div className="mt-2 space-x-2 flex justify-end">
                          <button
                            onClick={ async () => {
                              await editReply(editingReplyId!, editContent);
                              loadReplies();
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
                        </>
                      ) : (
                        <p className="text-gray-800">{reReply.content}</p>
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
        </div>
      </div>
    )
}