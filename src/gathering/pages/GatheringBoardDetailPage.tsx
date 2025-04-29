import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GatheringHeader from "../component/GatheringHeader";
import CustomButton from "../../common/component/CustomButton";


const GatheringBoardDetailPage: React.FC = () => {
  const { gatheringId, boardId } = useParams<{ gatheringId: string; boardId: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-t">

            <GatheringHeader gatheringId={gatheringId!} /> {/* 모임 헤더 불러오기 모임을 아이디를 props로 보냄 */}

            <div className="p-6 border-t">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">독서모임 후기 1</h1>
                  <div className="flex items-center space-x-4">
                    <CustomButton onClick={() => alert("모임 게시글 상세 수정 버튼 클릭릭")} color="white">
                      <>
                        <i className="fas fa-edit mr-2"></i>수정
                      </>
                    </CustomButton>
                    <CustomButton onClick={() => alert("모임 게시글 상세 수정 버튼 클릭릭")} color="red">
                      <>
                        <i className="fas fa-trash-alt mr-2"></i>삭제
                      </>
                    </CustomButton>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 pb-4 border-b">
                  <span className="mr-4 flex items-center">
                    <i className="fas fa-user mr-2"></i>이름님
                  </span>
                  <span className="mr-4 flex items-center">
                    <i className="fas fa-eye mr-2"></i>조회 33
                  </span>
                  <span className="mr-4 flex items-center">
                    <i className="fas fa-heart mr-2"></i>좋아요 15
                  </span>

                  <span className="ml-auto flex items-center">
                    <i className="fas fa-calendar mr-2"></i>2023-02-24
                  </span>
                </div>

              </div>
            </div>

            <div className="mb-8">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-6">
                <img
                  src="https://readdy.ai/api/search-image?query=modern%20book%20club%20meeting%20with%20people%20discussing%20literature%20in%20a%20contemporary%20minimalist%20setting%20with%20warm%20lighting%20and%20comfortable%20seating%20arrangement&width=1200&height=675&seq=1&orientation=landscape"
                  alt="독서모임 사진"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-800 leading-relaxed">
                  오늘 진행된 독서모임에서는 '책이름1'을 가지고 깊이 있는 토론을 진행했습니다. 참여하신 모든 분들이
                  각자의 관점에서 책을 해석하고 의견을 나누는 시간을 가졌습니다. 특히 작가가 전달하고자 했던 메시지에
                  대해 다양한 해석이 오갔으며, 현대 사회에서 이 책이 가지는 의미에 대해서도 깊이 있게 이야기를
                  나눴습니다.
                </p>
                <p className="text-gray-800 leading-relaxed mt-4">
                  다음 모임에서는 '책이름2'를 읽고 토론할 예정입니다. 관심 있는 분들의 많은 참여 부탁드립니다.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-8">
              <button className="px-6 py-3 bg-gray-100 rounded-button whitespace-nowrap cursor-pointer hover:bg-gray-200 flex items-center">
                <i className="fas fa-heart mr-2 text-red-500"></i>
                <span>좋아요</span>
                <span className="ml-2 text-gray-600">15</span>
              </button>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  댓글 <span className="text-gray-500">3</span>
                </h3>
              </div>

              <div className="mb-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-grow">
                    <textarea
                      className="w-full h-[90px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="댓글을 작성해주세요."></textarea>
                  </div>
                  <CustomButton
                    onClick={() => alert("댓글 등록 버튼 클릭함")}
                    color="black"
                    customClassName="h-[90px] px-6">
                    <>
                      등록
                    </>
                  </CustomButton>
                </div>
              </div>
              <div className="space-y-6">
                {[
                  {
                    author: "김독서",
                    content: "좋은 후기 감사합니다. 다음 모임이 기대되네요!",
                    date: "2023-02-24",
                    likes: 5,
                  },
                  {
                    author: "박책읽기",
                    content: "저도 참여했었는데, 정말 유익한 시간이었습니다.",
                    date: "2023-02-24",
                    likes: 3,
                  },
                  { author: "이독후감", content: "다음 모임에는 꼭 참여하고 싶네요!", date: "2023-02-23", likes: 2 },
                ].map((comment, index) => (
                  <div key={index} className="border-b pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{comment.author}</span>
                        <span className="text-sm text-gray-500">{comment.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomButton
                          onClick={() => alert("답글 버튼을 클릭함")}
                          color="none">
                          <>
                            <i className="fas fa-heart mr-1 text-red-500"></i>
                            {comment.likes}
                          </>
                        </CustomButton>
                        <CustomButton
                          onClick={() => alert("답글 버튼을 클릭함")}
                          color="none">
                          <>
                            <i className="fas fa-reply mr-1"></i>답글
                          </>
                        </CustomButton>
                      </div>
                    </div>
                    <p className="text-gray-800">{comment.content}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-6">
                <CustomButton
                  onClick={() => alert("이전 게시글글 버튼 클릭함")}
                  color="white"
                  customClassName="px-4 py-2">
                  <>
                    <i className="fas fa-arrow-left mr-2"></i>이전 글
                  </>
                </CustomButton>
                <CustomButton
                  onClick={() => alert("다음음 게시글 버튼 클릭함")}
                  color="black"
                  customClassName="px-4 py-2">
                  <>
                    <i className="fas fa-list mr-2"></i>목록
                  </>
                </CustomButton>
                <CustomButton
                  onClick={() => alert("다음음 게시글 버튼 클릭함")}
                  color="white"
                  customClassName="px-4 py-2">
                  <>
                    다음 글<i className="fas fa-arrow-right ml-2"></i>
                  </>
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GatheringBoardDetailPage;
