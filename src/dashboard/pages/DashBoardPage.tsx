// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from "react";
import {
  ChartConfig,
  HighlightCard,
  RecentGatherings,
  RecentPost,
  RecentReply
} from "../type/DashBoardPage.type";
import {
  fetchHighlightCards,
  fetchRecentGatherings,
  fetchRecentPosts,
  fetchRecentReplies,
  fetchChartData
} from "../api/DashBoardPage.mock";
import Graph from "../../common/component/Graph";

const DashBoardPage: React.FC = () => {

  //상단 카드 데이터 상태
  const [cards, setCards] = useState<HighlightCard[]>([]);
  //중단 최신 모임의 상태
  const [gatherings, setGatherings] = useState<RecentGatherings[]>([]);
  //중단 최신 게시글의 상태
  const [posts, setPosts] = useState<RecentPost[]>([]);
  //중단 최신 댓글의 상태태
  const [comments, setComments] = useState<RecentReply[]>([]);
  //하단 차트의 상태
  const [charts, setCharts] = useState<ChartConfig[]>([]);


  const loadDashboardData = async () => {
    try {
      const [
        highlightData,
        gatheringData,
        postData,
        commentData,
      ] = await Promise.all([
        fetchHighlightCards(),
        fetchRecentGatherings(),
        fetchRecentPosts(),
        fetchRecentReplies(),
      ]);

      setCards(highlightData);
      setGatherings(gatheringData);
      setPosts(postData);
      setComments(commentData);
    } catch (error) {
      console.error("대시보드 데이터 로드 실패:", error);
    }
  };

  const loadChartData = async () => {
    const chartIds = ["userChart", "postChart", "commentChart", "likeChart"];
    const chartDataPromises = chartIds.map((id) => fetchChartData(id));

    try {
      const chartData = await Promise.all(chartDataPromises);
      setCharts(chartData);
    } catch (error) {
      console.error("차트 데이터 로드 실패:", error);
    }
  }

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Dashboard API 로드 (예: 하이라이트 카드)
        await loadDashboardData();

        await loadChartData();

      } catch (error) {
        console.error("전체 차트 데이터 로드 실패:", error);
        setCharts([]); // 로드 실패 시 빈 배열로 설정
      }
    };

    loadAllData();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-16 h-16 flex items-center justify-center">
            <i className="fas fa-book-open via-gray-600 text-4xl"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-600 mb-3 pt-14">
            함께 읽는 즐거움
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            다양한 독서 모임에서 새로운 친구들과 함께 독서의 즐거움을 나누세요
          </p>
          <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>
        {/* 상단 하이라이트 카드 섹션 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105 cursor-pointer !rounded-button"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-semibold text-gray-800">{card.title}</div>
                <div className={`w-12 h-12 ${card.iconColor} rounded-full flex items-center justify-center`}>
                  <i className={`${card.icon} text-xl`}></i>
                </div>
              </div>
              <div className={`text-3xl font-bold ${card.textColor}`}>{card.count}개</div>
              <div className="text-sm mt-2 text-gray-600">{card.description}</div>
            </div>
          ))}
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
              {gatherings.map((gathering, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <h3 className="font-medium text-gray-900 mb-1">
                    {gathering.title}
                  </h3>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>생성일: {gathering.createdAt}</span>
                    <span>멤버: {gathering.members}명</span>
                  </div>
                </div>
              ))}
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
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 truncate">
                    {post.content}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{post.author}</span>
                    <div className="flex space-x-3">
                      <span>
                        <i className="fas fa-comment text-gray-400 mr-1"></i>{" "}
                        {post.comments}
                      </span>
                      <span>
                        <i className="fas fa-heart text-gray-400 mr-1"></i>{" "}
                        {post.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 최신 댓글 목록 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">최신 댓글</h2>
              <button className="text-blue-500 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap !rounded-button">
                전체 댓글 보기 <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <p className="text-gray-600 text-sm mb-2">{comment.content}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{comment.author}</span>
                    <span>{comment.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 하단 통계 그래프 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charts.map((config) => (
            <div key={config.id} className="bg-white rounded-lg shadow-md p-6">
              <Graph config={config} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DashBoardPage;
