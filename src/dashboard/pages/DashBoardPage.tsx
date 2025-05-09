// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import { BookClub, BookReview, CardData, recencyReply } from "../type/DashBoardPage.type";
import { mockBookClubs, mockBookReviews, mockCardData, mockChartData, mockDiscussions } from "../api/DashBoardPage.mock";


const DashBoardPage: React.FC = () => {
  const [userChartInstance, setUserChartInstance] =
    useState<echarts.ECharts | null>(null);
  const [postChartInstance, setPostChartInstance] =
    useState<echarts.ECharts | null>(null);
  const [commentChartInstance, setCommentChartInstance] =
    useState<echarts.ECharts | null>(null);
  const [likeChartInstance, setLikeChartInstance] =
    useState<echarts.ECharts | null>(null);

  const { userChartData, postChartData, commentChartData, likeChartData } = mockChartData;

  const [cardData, setCardData] = useState(mockCardData);
  const [bookClubs, setBookClubs] = useState(mockBookClubs);
  const [bookReviews, setBookReviews] = useState(mockBookReviews);
  const [discussions, setDiscussions] = useState(mockDiscussions);

  useEffect(() => {
    // Initialize charts
    const userChart = echarts.init(document.getElementById("userChart"));
    const postChart = echarts.init(document.getElementById("postChart"));
    const commentChart = echarts.init(document.getElementById("commentChart"));
    const likeChart = echarts.init(document.getElementById("likeChart"));
    setUserChartInstance(userChart);
    setPostChartInstance(postChart);
    setCommentChartInstance(commentChart);
    setLikeChartInstance(likeChart);
    // User chart options
    const userOption = {
      animation: false,
      title: {
        text: "일별 사용자 가입 추이",
        left: "center",
        textStyle: {
          fontSize: 14,
          fontWeight: "normal",
        },
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: userChartData.labels,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: userChartData.values,
          type: "line",
          smooth: true,
          lineStyle: {
            color: "#3B82F6",
          },
          itemStyle: {
            color: "#3B82F6",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(59, 130, 246, 0.5)",
                },
                {
                  offset: 1,
                  color: "rgba(59, 130, 246, 0.1)",
                },
              ],
            },
          },
        },
      ],
    };
    // Post chart options
    const postOption = {
      animation: false,
      title: {
        text: "일별 게시글 작성 추이",
        left: "center",
        textStyle: {
          fontSize: 14,
          fontWeight: "normal",
        },
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: postChartData.labels,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: postChartData.values,
          type: "line",
          smooth: true,
          lineStyle: {
            color: "#10B981",
          },
          itemStyle: {
            color: "#10B981",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(16, 185, 129, 0.5)",
                },
                {
                  offset: 1,
                  color: "rgba(16, 185, 129, 0.1)",
                },
              ],
            },
          },
        },
      ],
    };
    // Comment chart options
    const commentOption = {
      animation: false,
      title: {
        text: "일별 댓글 작성 추이",
        left: "center",
        textStyle: {
          fontSize: 14,
          fontWeight: "normal",
        },
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: commentChartData.labels,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: commentChartData.values,
          type: "line",
          smooth: true,
          lineStyle: {
            color: "#6366F1",
          },
          itemStyle: {
            color: "#6366F1",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(99, 102, 241, 0.5)",
                },
                {
                  offset: 1,
                  color: "rgba(99, 102, 241, 0.1)",
                },
              ],
            },
          },
        },
      ],
    };
    // Like chart options
    const likeOption = {
      animation: false,
      title: {
        text: "일별 좋아요 수 추이",
        left: "center",
        textStyle: {
          fontSize: 14,
          fontWeight: "normal",
        },
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: likeChartData.labels,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: likeChartData.values,
          type: "line",
          smooth: true,
          lineStyle: {
            color: "#EC4899",
          },
          itemStyle: {
            color: "#EC4899",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(236, 72, 153, 0.5)",
                },
                {
                  offset: 1,
                  color: "rgba(236, 72, 153, 0.1)",
                },
              ],
            },
          },
        },
      ],
    };
    // Set chart options
    userChart.setOption(userOption);
    postChart.setOption(postOption);
    commentChart.setOption(commentOption);
    likeChart.setOption(likeOption);
    // Handle resize
    const handleResize = () => {
      userChart.resize();
      postChart.resize();
      commentChart.resize();
      likeChart.resize();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      userChart.dispose();
      postChart.dispose();
      commentChart.dispose();
      likeChart.dispose();
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            함께 읽는 즐거움
          </h1>
          <p className="text-gray-600">
            다양한 독서 모임에서 새로운 친구들과 함께 독서의 즐거움을 나누세요
          </p>
        </div>
        {/* 상단 하이라이트 카드 섹션 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 활성화 모임 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105 cursor-pointer !rounded-button">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-semibold text-gray-800">
                활성화 모임
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-book-reader text-blue-500 text-xl"></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600">256개</div>
            <div className="text-sm mt-2 text-gray-600">
              다양한 주제의 독서 모임
            </div>
          </div>
          {/* 이번 주 신규 모임 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105 cursor-pointer !rounded-button">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-semibold text-gray-800">
                신규 모임
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-star text-green-500 text-xl"></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600">23개</div>
            <div className="text-sm mt-2 text-gray-600">
              이번 주 새로 생긴 모임
            </div>
          </div>
          {/* 이달의 추천 도서 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105 cursor-pointer !rounded-button">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-semibold text-gray-800">
                추천 도서
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <i className="fas fa-bookmark text-indigo-500 text-xl"></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-indigo-600">42권</div>
            <div className="text-sm mt-2 text-gray-600">
              이달의 회원 추천 도서
            </div>
          </div>
          {/* 활발한 토론 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105 cursor-pointer !rounded-button">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-semibold text-gray-800">
                활발한 토론
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <i className="fas fa-comments text-pink-500 text-xl"></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-pink-600">128개</div>
            <div className="text-sm mt-2 text-gray-600">
              진행 중인 도서 토론
            </div>
          </div>
        </div>
        {/* 중앙 최신 활동 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 최신 모임 목록 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                인기 독서 모임
              </h2>
              <button className="text-blue-500 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap !rounded-button">
                모임 찾아보기 <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {/* 모임 항목 1 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-gray-900 mb-1">
                  현대 문학의 이해
                </h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>생성일: 2025-05-09</span>
                  <span>멤버: 24명</span>
                </div>
              </div>
              {/* 모임 항목 2 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-gray-900 mb-1">
                  고전 소설 탐구
                </h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>생성일: 2025-05-08</span>
                  <span>멤버: 18명</span>
                </div>
              </div>
              {/* 모임 항목 3 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-gray-900 mb-1">
                  과학 도서 클럽
                </h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>생성일: 2025-05-07</span>
                  <span>멤버: 31명</span>
                </div>
              </div>
              {/* 모임 항목 4 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-gray-900 mb-1">
                  철학 독서 모임
                </h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>생성일: 2025-05-06</span>
                  <span>멤버: 15명</span>
                </div>
              </div>
              {/* 모임 항목 5 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-gray-900 mb-1">
                  역사 탐험가들
                </h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>생성일: 2025-05-05</span>
                  <span>멤버: 22명</span>
                </div>
              </div>
            </div>
          </div>
          {/* 최신 게시글 목록 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                추천 도서 리뷰
              </h2>
              <button className="text-blue-500 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap !rounded-button">
                더 많은 리뷰 <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {/* 게시글 항목 1 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-gray-900 mb-1">
                  5월 독서 모임 일정 안내
                </h3>
                <p className="text-gray-600 text-sm mb-2 truncate">
                  다음 주 토요일 오후 3시에 카페에서 만나요...
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>김지민</span>
                  <div className="flex space-x-3">
                    <span>
                      <i className="fas fa-comment text-gray-400 mr-1"></i> 12
                    </span>
                    <span>
                      <i className="fas fa-heart text-gray-400 mr-1"></i> 24
                    </span>
                  </div>
                </div>
              </div>
              {/* 게시글 항목 2 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-gray-900 mb-1">
                  소설 '데미안' 독후감
                </h3>
                <p className="text-gray-600 text-sm mb-2 truncate">
                  헤르만 헤세의 대표작 데미안을 읽고...
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>이서연</span>
                  <div className="flex space-x-3">
                    <span>
                      <i className="fas fa-comment text-gray-400 mr-1"></i> 8
                    </span>
                    <span>
                      <i className="fas fa-heart text-gray-400 mr-1"></i> 17
                    </span>
                  </div>
                </div>
              </div>
              {/* 게시글 항목 3 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-gray-900 mb-1">
                  추천 도서: 사피엔스
                </h3>
                <p className="text-gray-600 text-sm mb-2 truncate">
                  유발 하라리의 사피엔스는 인류의 역사를...
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>박준호</span>
                  <div className="flex space-x-3">
                    <span>
                      <i className="fas fa-comment text-gray-400 mr-1"></i> 15
                    </span>
                    <span>
                      <i className="fas fa-heart text-gray-400 mr-1"></i> 32
                    </span>
                  </div>
                </div>
              </div>
              {/* 게시글 항목 4 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-gray-900 mb-1">
                  독서 토론 방법론
                </h3>
                <p className="text-gray-600 text-sm mb-2 truncate">
                  효과적인 독서 토론을 위한 방법을 공유합니다...
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>최민지</span>
                  <div className="flex space-x-3">
                    <span>
                      <i className="fas fa-comment text-gray-400 mr-1"></i> 7
                    </span>
                    <span>
                      <i className="fas fa-heart text-gray-400 mr-1"></i> 19
                    </span>
                  </div>
                </div>
              </div>
              {/* 게시글 항목 5 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-gray-900 mb-1">
                  신간 소개: 미래의 역사
                </h3>
                <p className="text-gray-600 text-sm mb-2 truncate">
                  이번 달에 출간된 미래의 역사라는 책을...
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>정다운</span>
                  <div className="flex space-x-3">
                    <span>
                      <i className="fas fa-comment text-gray-400 mr-1"></i> 5
                    </span>
                    <span>
                      <i className="fas fa-heart text-gray-400 mr-1"></i> 11
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 최신 댓글 목록 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                최신 댓글 목록
              </h2>
              <button className="text-blue-500 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap !rounded-button">
                더 많은 댓글 <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {/* 댓글 항목 1 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <p className="text-gray-600 text-sm mb-2">
                  정말 좋은 책 추천 감사합니다. 저도 읽어봐야겠어요!
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>한소희</span>
                  <span>2025-05-09 14:23</span>
                </div>
              </div>
              {/* 댓글 항목 2 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <p className="text-gray-600 text-sm mb-2">
                  다음 모임에서 이 책에 대해 더 자세히 이야기 나눠보고 싶네요.
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>김태현</span>
                  <span>2025-05-09 11:45</span>
                </div>
              </div>
              {/* 댓글 항목 3 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <p className="text-gray-600 text-sm mb-2">
                  저는 이 작가의 다른 작품도 읽어봤는데, 이 책이 가장
                  인상적이었어요.
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>이지원</span>
                  <span>2025-05-08 18:32</span>
                </div>
              </div>
              {/* 댓글 항목 4 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <p className="text-gray-600 text-sm mb-2">
                  토론 방법론 글 정말 유익했습니다. 다음 모임에서
                  적용해보겠습니다.
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>박현우</span>
                  <span>2025-05-08 15:17</span>
                </div>
              </div>
              {/* 댓글 항목 5 */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <p className="text-gray-600 text-sm mb-2">
                  일정 변경 가능한가요? 그날 다른 약속이 있어서요.
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>정민수</span>
                  <span>2025-05-07 20:05</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 하단 통계 그래프 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div id="userChart" className="w-full h-72"></div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div id="postChart" className="w-full h-72"></div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div id="commentChart" className="w-full h-72"></div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div id="likeChart" className="w-full h-72"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashBoardPage;
