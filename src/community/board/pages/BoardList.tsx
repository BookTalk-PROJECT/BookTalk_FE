import React, { useState, useRef, useEffect } from "react";
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("전체");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const handleCategoryChange = async (categoryName: string) => {
    setIsLoading(true);
    setActiveTab(categoryName);
    setActiveCategory("전체");
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsLoading(false);
  };
  const [activeCategory, setActiveCategory] = useState("전체");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const categories = [
    { id: "all", name: "전체" },
    { id: "literature", name: "문학" },
    { id: "humanities", name: "인문" },
    { id: "society", name: "사회과학" },
    { id: "science", name: "자연과학" },
    { id: "technology", name: "기술공학" },
    { id: "arts", name: "예술" },
    { id: "language", name: "언어" },
    { id: "history", name: "역사" },
    { id: "religion", name: "종교" },
    { id: "philosophy", name: "철학" },
  ];
  const subCategories = {
    전체: ["전체"],
    문학: ["전체", "소설", "시/에세이", "희곡", "문학론"],
    인문: ["전체", "심리학", "교육학", "철학", "윤리학"],
    사회과학: ["전체", "경제학", "정치학", "사회학", "법학"],
    자연과학: ["전체", "수학", "물리학", "화학", "생물학"],
    기술공학: ["전체", "IT/컴퓨터", "건축", "기계", "전자"],
    예술: ["전체", "음악", "미술", "공연", "사진"],
    언어: ["전체", "한국어", "영어", "일본어", "중국어"],
    역사: ["전체", "한국사", "세계사", "문화사", "고고학"],
    종교: ["전체", "불교", "기독교", "천주교", "이슬람"],
    철학: ["전체", "동양철학", "서양철학", "현대철학", "윤리학"],
  };
  const posts = [
    { id: 1, title: "신간 도서 안내", author: "관리자", date: "2025-04-16", views: 234, category: "전체" },
    { id: 2, title: "이달의 추천도서", author: "관리자", date: "2025-04-15", views: 187, category: "문학" },
    { id: 3, title: "독서토론 모임 안내", author: "관리자", date: "2025-04-14", views: 156, category: "인문" },
    { id: 4, title: "봄맞이 도서 할인전", author: "마케팅팀", date: "2025-04-13", views: 142, category: "전체" },
    { id: 5, title: "베스트셀러 순위", author: "김민수", date: "2025-04-12", views: 98, category: "문학" },
    {
      id: 6,
      title: "신간 리뷰: 미래과학의 전망",
      author: "박지훈",
      date: "2025-04-11",
      views: 76,
      category: "자연과학",
    },
    { id: 7, title: "도서 구매 후기", author: "이영희", date: "2025-04-10", views: 112, category: "기술공학" },
    { id: 8, title: "전자책 이용 안내", author: "최준호", date: "2025-04-09", views: 89, category: "전체" },
    { id: 9, title: "도서 반납 연장 문의", author: "정다은", date: "2025-04-08", views: 67, category: "전체" },
    { id: 10, title: "도서관 이용 안내", author: "홍길동", date: "2025-04-07", views: 201, category: "전체" },
  ];
  const filteredPosts = posts
    .filter((post) => {
      // Category filter
      if (activeTab !== "전체" && post.category !== activeTab) return false;
      if (activeCategory !== "전체" && post.category !== activeCategory) return false;

      // Search filter
      if (searchTerm) {
        const searchValue = searchTerm.toLowerCase();
        if (searchField === "title") {
          return post.title.toLowerCase().includes(searchValue);
        } else if (searchField === "author") {
          return post.author.toLowerCase().includes(searchValue);
        }
      }

      // Date range filter
      if (dateRange.start && new Date(post.date) < new Date(dateRange.start)) return false;
      if (dateRange.end && new Date(post.date) > new Date(dateRange.end)) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortField === "date") {
        return sortDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortField === "views") {
        return sortDirection === "asc" ? a.views - b.views : b.views - a.views;
      } else if (sortField === "title") {
        return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }
      return 0;
    });
  const handleScroll = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        direction === "left" ? tabsRef.current.scrollLeft - scrollAmount : tabsRef.current.scrollLeft + scrollAmount;
      tabsRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };
  const checkScrollButtons = () => {
    if (tabsRef.current) {
      setCanScrollLeft(tabsRef.current.scrollLeft > 0);
      setCanScrollRight(tabsRef.current.scrollLeft < tabsRef.current.scrollWidth - tabsRef.current.clientWidth);
    }
  };
  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header/>
      <main className="flex-grow bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Category tabs with horizontal scroll */}
            <div className="border-b relative">
              <div className="flex items-center">
                {canScrollLeft && (
                  <button
                    onClick={() => handleScroll("left")}
                    className="absolute left-0 z-10 bg-gradient-to-r from-white to-transparent px-2 h-full">
                    <i className="fas fa-chevron-left text-gray-600"></i>
                  </button>
                )}
                <div
                  ref={tabsRef}
                  className="flex overflow-x-auto py-2 px-4"
                  onScroll={checkScrollButtons}>
                  {categories.map((category) => (
                    <div key={category.id} className="relative group">
                      <button
                        className={`px-4 py-2 font-medium text-sm whitespace-nowrap cursor-pointer transition-all duration-300 relative ${
                          activeTab === category.name
                            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 shadow-sm"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                        onClick={async () => {
                          setIsLoading(true);
                          await handleCategoryChange(category.name);
                        }}>
                        {category.name}
                        {activeTab === category.name && (
                          <>
                            <span className="absolute -right-1 -top-1 flex h-3 w-3">
                              <span className="z-20 animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="z-20 relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-100 transition-transform duration-300"></span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                {canScrollRight && (
                  <button
                    onClick={() => handleScroll("right")}
                    className="absolute right-0 z-10 bg-gradient-to-l from-white to-transparent px-2 h-full">
                    <i className="fas fa-chevron-right text-gray-600"></i>
                  </button>
                )}
              </div>
            </div>
            {/* Active category display */}
            <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">현재 카테고리:</span>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center space-x-1 focus:outline-none">
                    <span>
                      {activeTab} &gt; {activeCategory}
                    </span>
                    <i
                      className={`fas fa-chevron-down transition-transform duration-200 ${isDropdownOpen ? "transform rotate-180" : ""}`}></i>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-30 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200">
                      <div className="py-2">
                        {subCategories[activeTab].map((subCat, index) => (
                          <div
                            key={index}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                              activeCategory === subCat
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                            onClick={() => {
                              setActiveCategory(subCat);
                              setIsDropdownOpen(false);
                            }}>
                            <span>{subCat}</span>
                            {activeCategory === subCat && <i className="fas fa-check text-blue-600"></i>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-1.5 rounded-button text-sm cursor-pointer whitespace-nowrap hover:bg-blue-700">
                <i className="fas fa-pencil-alt mr-1"></i> 글쓰기
              </button>
            </div>
            {/* Search and filter section */}
            <div className="bg-white p-4 border-b">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    className="border rounded-button px-3 py-1.5 text-sm bg-white">
                    <option value="title">제목</option>
                    <option value="author">작성자</option>
                  </select>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="검색어를 입력하세요"
                      className="border rounded-button pl-8 pr-3 py-1.5 text-sm w-64"
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">기간:</span>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                    className="border rounded-button px-3 py-1.5 text-sm"
                  />
                  <span className="text-sm text-gray-600">~</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                    className="border rounded-button px-3 py-1.5 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Posts table */}
            <div className="overflow-x-auto relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              )}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      번호
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                      onClick={() => {
                        setSortField("title");
                        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                      }}>
                      <div className="flex items-center">
                        제목
                        <span className="ml-1">
                          <i
                            className={`fas fa-sort${sortField === "title" ? (sortDirection === "asc" ? "-up" : "-down") : ""} 
                              ${sortField === "title" ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}></i>
                        </span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      작성자
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28 cursor-pointer group"
                      onClick={() => {
                        setSortField("date");
                        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                      }}>
                      <div className="flex items-center">
                        작성일
                        <span className="ml-1">
                          <i
                            className={`fas fa-sort${sortField === "date" ? (sortDirection === "asc" ? "-up" : "-down") : ""} 
        ${sortField === "date" ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}></i>
                        </span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 cursor-pointer group"
                      onClick={() => {
                        setSortField("views");
                        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                      }}>
                      <div className="flex items-center">
                        조회수
                        <span className="ml-1">
                          <i
                            className={`fas fa-sort${sortField === "views" ? (sortDirection === "asc" ? "-up" : "-down") : ""} 
        ${sortField === "views" ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}></i>
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPosts.map((post, index) => (
                    <tr key={post.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.id}</td>
                      <td className="px-6 py-4 text-sm">
                        <a href="#" className="text-gray-900 hover:text-blue-600">
                          {post.title}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <Pagination/>
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer/>
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">LOGO</h1>
            </a>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <a href="#" className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                홈
              </a>
              <a href="#" className="text-blue-600 border-b-2 border-blue-600 px-3 py-2 rounded-md font-medium">
                게시판
              </a>
              <a href="#" className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                공지사항
              </a>
              <a href="#" className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                마이페이지
              </a>
              <a href="#" className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                고객센터
              </a>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <div className="flex space-x-2">
              <button className="bg-white text-blue-600 border border-blue-600 px-4 py-1 rounded-button cursor-pointer whitespace-nowrap text-sm hover:bg-blue-50">
                로그인
              </button>
              <button className="bg-blue-600 text-white px-4 py-1 rounded-button cursor-pointer whitespace-nowrap text-sm hover:bg-blue-700">
                회원가입
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-200"></div>
    </header>
  );
}

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">LOGO</h2>
            <p className="text-gray-300 mb-4">
              최고의 서비스와 콘텐츠를 제공하는 플랫폼입니다. 항상 사용자의 편의를 최우선으로 생각합니다.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">사이트맵</h3>
            <div className="grid grid-cols-2 gap-2">
              <a href="#" className="text-gray-300 hover:text-white py-1">
                홈
              </a>
              <a href="#" className="text-gray-300 hover:text-white py-1">
                게시판
              </a>
              <a href="#" className="text-gray-300 hover:text-white py-1">
                공지사항
              </a>
              <a href="#" className="text-gray-300 hover:text-white py-1">
                마이페이지
              </a>
              <a href="#" className="text-gray-300 hover:text-white py-1">
                고객센터
              </a>
              <a href="#" className="text-gray-300 hover:text-white py-1">
                FAQ
              </a>
              <a href="#" className="text-gray-300 hover:text-white py-1">
                이용약관
              </a>
              <a href="#" className="text-gray-300 hover:text-white py-1">
                개인정보처리방침
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">고객센터</h3>
            <p className="flex items-center text-gray-300 mb-2">
              <i className="fas fa-phone-alt mr-2"></i> 1588-1234
            </p>
            <p className="flex items-center text-gray-300 mb-2">
              <i className="fas fa-envelope mr-2"></i> support@example.com
            </p>
            <p className="flex items-center text-gray-300 mb-4">
              <i className="fas fa-map-marker-alt mr-2"></i> 서울특별시 강남구 테헤란로 123
            </p>
            <p className="text-gray-400 text-sm">평일 09:00 - 18:00 (주말 및 공휴일 휴무)</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 COMPANY. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              이용약관
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm font-bold">
              개인정보처리방침
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              이메일무단수집거부
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const Pagination: React.FC = () => {
  return (
    <div className="px-4 py-3 flex items-center justify-center border-t">
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <a
          href="#"
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span className="sr-only">이전</span>
          <i className="fas fa-chevron-left text-xs"></i>
        </a>
        <a
          href="#"
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white">
          1
        </a>
        <a
          href="#"
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          2
        </a>
        <a
          href="#"
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          3
        </a>
        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
          ...
        </span>
        <a
          href="#"
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          10
        </a>
        <a
          href="#"
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span className="sr-only">다음</span>
          <i className="fas fa-chevron-right text-xs"></i>
        </a>
      </nav>
    </div>
  );
}
export default App;
