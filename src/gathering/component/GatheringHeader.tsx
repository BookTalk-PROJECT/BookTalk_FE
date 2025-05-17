import { useState, useEffect } from "react";
import CustomButton from "../../common/component/CustomButton"; // 필요
import { bookInfo, Books } from "../type/GatheringHeader.types";
import { exampleBookInfo, examplebooks, fetchGatheringBooks, fetchGatheringInfo } from "../api/GatheringHeaderRequest";
import { useNavigate } from "react-router";

interface GatheringId {
  gatheringId: string;
}

// 나중에 gatheringId(모임만의 PK평문)을 이용해서 API요청 보낼것
const GatheringHeader: React.FC<GatheringId> = ({ gatheringId }) => {
    const navigate = useNavigate();
    const [books, setBooks] = useState<Books[]>([]);
    const [gatheringBookInfo, setGatheringBookInfo] = useState<bookInfo | null>(null);

  // 데이터 로드 함수
  const loadGatheringData = async () => {
    if (!gatheringId) {
      console.error("gatheringId가 유효하지 않습니다:", gatheringId);
      return;
    }

    try {
      // API 요청
      const booksData = await fetchGatheringBooks(gatheringId);
      const infoData = await fetchGatheringInfo(gatheringId);
      setBooks(booksData);
      setGatheringBookInfo(infoData);
    } catch (error) {
      console.error("모임 책목록 API 요청 실패! 더미 넣는데이:", error);
      // API 요청 실패 시 더미 데이터 사용
      setBooks(examplebooks);
      setGatheringBookInfo(exampleBookInfo);
    } finally {
    }
  };

  // 컴포넌트가 마운트될 때 데이터 로드
  useEffect(() => {
    loadGatheringData();
  }, [gatheringId]);

    return (
        <div>
            {/* 모임 정보 영역 */}
            <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">즐거운 독서</h1>
                    <div className="flex space-x-3">
                        <CustomButton onClick={() => alert("공유하기 클릭됨")} color="white">
                            <>
                                <i className="fas fa-share-alt mr-2"></i>공유하기
                            </>
                        </CustomButton>
                        <CustomButton onClick={() => navigate(`/gatheringlist/${gatheringId}/join`)} color="black">
                            <>
                                <i className="fas fa-user-plus mr-2"></i>가입하기
                            </>
                        </CustomButton>
                    </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>
                        <i className="fas fa-users mr-2"></i>멤버 : {gatheringBookInfo?.totalMembers}
                    </span>
                    <span>
                        <i className="fas fa-book mr-2"></i>다읽은 책 : {gatheringBookInfo?.completeBooks}
                    </span>
                    <span>
                        <i className="fas fa-calendar mr-2"></i>매주 {gatheringBookInfo?.weeklyDay}
                    </span>
                </div>
            </div>

      {/* 독서 목록 영역 */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">독서 목록</h2>
          <div className="flex space-x-2">
            {/* start arrowButton */}
            <div className="flex space-x-2">
              {/* 왼쪽으로 스크롤 버튼 */}
              <button
                onClick={() => {
                  const container = document.querySelector(".books-container") as HTMLElement;
                  if (container) {
                    container.scrollLeft -= container.offsetWidth;
                  }
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 hover:scale-110 transition-transform duration-200 shadow-sm hover:shadow-md">
                <i className="fas fa-chevron-left transition-transform duration-200"></i>
              </button>

              {/* 오른쪽으로 스크롤 버튼 */}
              <button
                onClick={() => {
                  const container = document.querySelector(".books-container") as HTMLElement;
                  if (container) {
                    container.scrollLeft += container.offsetWidth;
                  }
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 hover:scale-110 transition-transform duration-200 shadow-sm hover:shadow-md">
                <i className="fas fa-chevron-right transition-transform duration-200"></i>
              </button>
            </div>
            {/* end arrowButton */}
          </div>
        </div>

        {/* 책 리스트 */}
        <div
          className="books-container overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}>
          <div className="inline-flex gap-6 min-w-max pb-4">
            {[...books, ...books].map((book, index) => (
              <div key={`${book.id}-${index}`} className="w-[300px] cursor-pointer group">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  {/* 이미지 영역 */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={`https://readdy.ai/api/search-image?query=modern%20minimalist%20book%20cover%20design%20with%20abstract%20geometric%20patterns%20and%20sophisticated%20typography%20on%20clean%20background%20professional%20publishing%20quality&width=400&height=400&seq=${book.id}&orientation=squarish`}
                      alt={book.title}
                      className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* 내용 영역 */}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-base text-gray-900">{book.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          book.status === 1 ? "bg-blue-500 text-white" : "bg-yellow-500 text-white"
                        }`}>
                        {book.status === 1 ? "다 읽음" : "진행중"}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <span>{book.author}</span>
                      <span className="ml-auto flex items-center">
                        <i className="far fa-calendar-alt mr-1"></i>
                        {book.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GatheringHeader;
