import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomButton from "../../CustomButton";
import { GetBoardDetailRequest } from "../type/BoardDetail.types";
import { exampleData } from "../api/DetailBoardRequest";
import { ReplyRequest } from "../../../../community/board/type/reply";

interface DetailBoardProps {
  postCode: string;
  //모임 조회 props
  GetBoardDetail: (postId: string) => Promise<GetBoardDetailRequest>;
  DeleteBoard: (postId: string) => void;
  //게시글 좋아요 props arg1 : 게시글 아이디, arg2: 모임 여부
  ToggleLikePost: (postId: string) => void;
  CreateReply: (req: ReplyRequest) => void;
}

//postId는 커뮤Id or 모임Id
const DetailBaord: React.FC<DetailBoardProps> = ({ postCode, GetBoardDetail, DeleteBoard, ToggleLikePost, CreateReply }) => {
  //상세 조회 상태 관리
  const [detailData, setDetailData] = useState<GetBoardDetailRequest>();
  // 댓글 상태 관리
  const [parentCommentContent, setParentCommentContent] = useState<string>(""); // 부모 댓글 입력
  const [replyContent, setReplyContent] = useState<string>(""); // 댓글/대댓글 공통 입력
  const [reReply_yn, setReReply_yn] = useState<string | null>(null); // 부모 댓글 여부(대댓글 or 댓글 판단)

  // 댓글 데이터 불러오기
  useEffect(() => {
    loadDetailData();
  }, [postCode]);

  const loadDetailData = async () => {
    if (!postCode) {
      console.log("postId: " + postCode + "가 이상함");
      return;
    }

    try {
      const data = await GetBoardDetail(postCode);
      setDetailData(data.data);
    } catch (error) {
      console.error("API 요청 오류:", error);
      setDetailData(exampleData);
    }
  };

  // 좋아요 토글 상태관리 (Optimistic UI)
  const handleLikeToggle = async () => {
    if (!postCode) {
      console.log("또는 postId: " + postCode + "가 이상함");
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

  // 댓글 등록 로직 (간결한 구조)
  const handleReplySubmit = async () => {
    if (!postCode) {
      console.error("모임 ID 또는 게시글 ID가 누락되었습니다.");
      return;
    }

    // 댓글 또는 대댓글 내용 확인
    const content = reReply_yn === null ? parentCommentContent.trim() : replyContent.trim();
    if (!content) {
      console.error(reReply_yn === null ? "댓글 내용을 입력하세요." : "대댓글 내용을 입력하세요.");
      return;
    }

    // UI 필드 초기화 (즉시 반영)
    if (reReply_yn === null) {
      setParentCommentContent("");
    } else {
      setReplyContent("");
    }

    // Optimistic UI: 즉시 댓글 UI에 추가
    const newReply = {
      reply_code: Date.now().toString(), // 임시 코드 (고유값)
      member_id: "현재 사용자", // 실제 사용자 정보로 변경 필요
      content,
      date: new Date().toISOString().slice(0, 10),
      likes: 0,
      reReply: [],
    };

    // 댓글 추가 (Optimistic UI) - 안전한 타입 처리
    setDetailData((prev) => {
      if (!prev) return prev as unknown as GetBoardDetailRequest; // prev가 undefined일 경우 안전하게 반환

      // 부모 댓글 추가
      if (reReply_yn === null) {
        return {
          ...prev,
          replys: [
            ...(prev.replies ?? []), // replys가 undefined일 경우 빈 배열로 처리
            newReply,
          ],
        } as GetBoardDetailRequest; // 명시적 타입 지정
      }

      // 대댓글 추가
      return {
        ...prev,
        replys: (prev.replies ?? []).map((parentReply) => {
          if (parentReply.reply_code === reReply_yn) {
            return {
              ...parentReply,
              reReply: [
                ...(parentReply.reReply ?? []), // reReply가 undefined일 경우 빈 배열로 처리
                newReply,
              ],
            };
          }
          return parentReply;
        }),
      } as GetBoardDetailRequest; // 명시적 타입 지정
    });

    try {
      // 서버 API 요청 (댓글 등록)
      console.log(reReply_yn);
      await CreateReply({
        postCode: postCode,
        content: content,
        parentReplyCode: reReply_yn
      }); //타입에서 파라미터를 넘기지 않을 시 undifined
      await loadDetailData(); // 서버 데이터로 새로고침 (정상 등록 확인)
    } catch (error) {
      console.error("댓글 등록 중 오류 발생:", error);

      // 실패 시 댓글 롤백 (UI에서 제거)
      setDetailData((prev) => {
        if (!prev) return prev;

        // 부모 댓글 롤백
        if (reReply_yn === null) {
          return {
            ...prev,
            replies: prev.replies?.filter((reply) => reply.reply_code !== newReply.reply_code),
          };
        }

        // 대댓글 롤백
        return {
          ...prev,
          replies: prev.replies?.map((parentReply) =>
            parentReply.reply_code === reReply_yn
              ? {
                  ...parentReply,
                  reReply: parentReply.reRepies?.filter((reReply) => reReply.reply_code !== newReply.reply_code),
                }
              : parentReply
          ),
        };
      });
    } finally {
      setReReply_yn(null); // 항상 초기화
    }
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

  if (!postCode) {
    return <div>잘못된 접근입니다.</div>; // 또는 LoadingBar 반환
  }
  return (
    <div>
      <div className="p-6 border-t">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{detailData?.post.title}</h1>
            <div className="flex items-center space-x-4">
              <CustomButton onClick={() => alert("모임 게시글 상세 수정 버튼 클릭릭")} color="white">
                <>
                  <i className="fas fa-edit mr-2"></i>수정
                </>
              </CustomButton>
              <CustomButton onClick={() => DeleteBoard(postCode)} color="red">
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
      </div>

      <div className="mb-8">
        {/* <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-6">
          <img src={detailData?.post.imageUrl} alt="독서모임 사진" className="w-full h-full object-cover" />
        </div> */}
        <div className="prose max-w-none">
          <p className="text-gray-800 leading-relaxed">{detailData?.post.content}</p>
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
            댓글 <span className="text-gray-500">{detailData?.replies?.length}</span>
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
                </div>
              </div>
              <p className="text-gray-800">{parentReply.content}</p>

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
                        </div>
                      </div>
                      <p className="text-gray-800">{reReply.content}</p>
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
          <CustomButton onClick={() => alert("다음 게시글 버튼 클릭함")} color="black" customClassName="px-4 py-2">
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
