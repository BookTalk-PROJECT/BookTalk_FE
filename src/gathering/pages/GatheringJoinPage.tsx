// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import axios from "axios";
import React, { useState, useEffect, use } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { RecruitQuestion } from "../type/GatheringJoin.types";
import { GatheringJoinRequest, GetRecruitQuestion, sampleQuestions } from "../api/GatheringJoinRequest";

const GatheringJoin: React.FC = () => {
  const navigate = useNavigate();
  const { gatheringId } = useParams<{ gatheringId: string }>();
  const [questions, setQuestions] = useState<RecruitQuestion[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  // 질문 목록 API 요청
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await GetRecruitQuestion(gatheringId!);
        setQuestions(res);
      } catch (error) {
        console.error("질문 목록 API실패 더미 데이터 가져온데이? :", error);
        setQuestions(sampleQuestions);
      }
    };

    if (gatheringId) {
      fetchQuestions();
    }
  }, [gatheringId]);

  // 유효성 검사
  useEffect(() => {
    const requiredQuestions = questions.filter((q) => q.required);
    const allRequiredAnswered = requiredQuestions.every((q) => answers[q.id] && answers[q.id].trim() !== "");
    setIsFormValid(allRequiredAnswered);
  }, [answers, questions]);

  // 자동 저장
  useEffect(() => {
    if (unsavedChanges) {
      const saveTimeout = setTimeout(() => {
        localStorage.setItem("groupJoinAnswers", JSON.stringify(answers));
        setUnsavedChanges(false);
      }, 2000);

      return () => clearTimeout(saveTimeout);
    }
  }, [answers, unsavedChanges]);

  // 저장된 답변 불러오기
  useEffect(() => {
    const savedAnswers = localStorage.getItem("groupJoinAnswers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  // 이탈 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsavedChanges]);

  // 입력 핸들러
  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setUnsavedChanges(true);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    // 답변 형태를 API용으로 가공
    const answerArray = Object.entries(answers).map(([questionId, answer]) => ({
      questionId: Number(questionId),
      answer: answer,
    }));

    try {
      await GatheringJoinRequest(gatheringId!, answerArray);
      alert("모임 가입 신청이 완료되었습니다.");
      localStorage.removeItem("groupJoinAnswers");
      setAnswers({});
    } catch (err) {
      console.error("가입 신청 실패:", err);
      alert("가입 신청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <button
            className="mr-4 text-gray-600 hover:text-gray-900 cursor-pointer !rounded-button whitespace-nowrap"
            aria-label="뒤로 가기"
            onClick={() => navigate(-1)} // 이전 페이지로 이동
          >
            <i className="fas fa-arrow-left text-lg"></i>
          </button>
          <h1 className="text-xl font-bold">모임 가입하기</h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {/* 모임 정보 요약 */}
        {/* <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                        <img
                            src={groupInfo.image}
                            alt={groupInfo.name}
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">{groupInfo.name}</h2>
                        <p className="text-sm text-gray-600">{groupInfo.description}</p>
                    </div>
                </div> */}

        {/* 안내 메시지 */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">
            모임 개설자가 등록한 질문에 답변해 주세요. <span className="text-red-500">*</span> 표시는 필수 항목입니다.
          </p>
          <p className="text-sm text-gray-600">
            답변은 자동으로 저장되며, 모든 필수 항목을 작성해야 가입 신청이 가능합니다.
          </p>
        </div>

        {/* 질문 리스트 */}
        <div className="space-y-6 mb-24">
          {questions.map((question) => {
            const currentAnswer = answers[question.id] || "";
            const remainingChars = question.maxLength - (currentAnswer.length || 0);

            return (
              <div key={question.id} className="bg-white rounded-lg shadow-sm p-5">
                <div className="mb-3 flex items-start">
                  <span className="bg-gray-100 text-gray-600 rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0 text-sm">
                    {question.id}
                  </span>
                  <h3 className="font-medium text-gray-800">
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                </div>

                <div className="ml-10">
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    rows={4}
                    placeholder="답변을 입력해주세요..."
                    maxLength={question.maxLength}
                    value={currentAnswer}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  />

                  <div className="flex justify-end mt-2">
                    <span className={`text-sm ${remainingChars < 50 ? "text-orange-500" : "text-gray-500"}`}>
                      {remainingChars}/{question.maxLength}자
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 하단 제출 영역 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {unsavedChanges && (
              <span className="flex items-center">
                <i className="fas fa-sync-alt fa-spin mr-2"></i>
                저장 중...
              </span>
            )}
          </div>
          <button
            className={`px-6 py-3 rounded-lg font-medium text-white ${
              isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            } transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer`}
            disabled={!isFormValid}
            onClick={handleSubmit}>
            가입 신청하기
          </button>
        </div>
      </footer>
    </div>
  );
};

export default GatheringJoin;
