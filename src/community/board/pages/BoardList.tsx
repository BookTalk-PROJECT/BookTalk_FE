import React, { useState, useRef, useEffect } from "react";
import Footer from "../../../common/component/Footer";
import Header from "../../../common/component/Header";
import Pagenation from "../../../common/component/Pagination";
import ButtonWrapper from "../../../common/component/Button";
import { Category, Post, SubCategory } from "../type/boardList";
import { getCategories, getPosts } from "../api/boardList";
const BoardList: React.FC = () => {
  // flag
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  // category
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<Category>();
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>();
  // search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  // data
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const handleCategoryChange = async (catetory: Category) => {
    setIsLoading(true);
    setActiveCategory(catetory);
    setActiveSubCategory(catetory.subCategories[0]);
    setIsLoading(false);
  };

  const filteredPosts = posts
    .filter((post) => {
      // Category filter
      // if (post.categoryId !== activeCategory?.id) return false;
      if (post.categoryId !== activeSubCategory?.id) return false;

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
    getCategories().then((categories) => {
      setCategories(categories);
      setActiveCategory(categories[0]);
      setActiveSubCategory(categories[0].subCategories[0]);
    });
    getPosts().then((posts) => setPosts(posts));
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
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
                <div ref={tabsRef} className="flex overflow-x-auto py-2 px-4" onScroll={checkScrollButtons}>
                  {categories.map((category) => (
                    <div key={category.id} className="relative group">
                      <button
                        className={`px-4 py-2 font-medium text-sm whitespace-nowrap cursor-pointer transition-all duration-300 relative ${
                          activeCategory === category
                            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 shadow-sm"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                        onClick={async () => {
                          setIsLoading(true);
                          await handleCategoryChange(category);
                        }}>
                        {category.name}
                        {activeCategory === category && (
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
                      {activeCategory?.name} &gt; {activeSubCategory?.name}
                    </span>
                    <i
                      className={`fas fa-chevron-down transition-transform duration-200 ${isDropdownOpen ? "transform rotate-180" : ""}`}></i>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-30 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200">
                      <div className="py-2">
                        {activeCategory?.subCategories.map((subCategory, index) => (
                          <div
                            key={index}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                              activeSubCategory === subCategory
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                            onClick={() => {
                              setActiveSubCategory(subCategory);
                              setIsDropdownOpen(false);
                            }}>
                            <span>{subCategory.name}</span>
                            {activeSubCategory === subCategory && <i className="fas fa-check text-blue-600"></i>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <ButtonWrapper
                onClick={() => {
                  alert("Button Clicked!!");
                }}>
                <>
                  <i className="fas fa-pencil-alt mr-1"></i> 글쓰기
                </>
              </ButtonWrapper>
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
            <Pagenation totalPages={21} loadPageByPageNum={(num) => {}} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BoardList;
