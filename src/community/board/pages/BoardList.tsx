import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import ButtonWrapper from "../../../common/component/Button";
import { useNavigate, useSearchParams } from "react-router";
import { Category, SubCategory } from "../type/board";
import { PostSimpleInfo } from "../../../common/component/Board/type/BoardDetailTypes";
import { getCategories } from "../../category/api/categoryApi";
import { getBoards, searchBoards } from "../api/boardApi";
import DataTableCustom from "../../../common/component/DataTableCustom";
import { RowDef } from "../../../common/type/common";
import { Link } from "react-router-dom";
import { usePaginatedData } from "../../../common/hooks/usePaginatedData";

type BoardTableColDef = {
  board_code: string;
  title: string;
  author: string;
  date: string;
  views: string;
};

const EMPTY_FETCH = () =>
  Promise.resolve({ msg: '', code: 0, data: { content: [], totalPages: 0, totalElements: 0 } });

const BoardList: React.FC = () => {
  const rowDef: RowDef<BoardTableColDef>[] = [
    { label: "게시물 번호", key: "board_code", isSortable: true, isSearchType: true },
    { label: "제목", key: "title", isSortable: true, isSearchType: true },
    { label: "작성자", key: "author", isSortable: true, isSearchType: true },
    { label: "날짜", key: "date", isSortable: true, isSearchType: false },
    { label: "조회수", key: "views", isSortable: true, isSearchType: false },
  ];

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // URL이 Single Source of Truth — state 대신 URL에서 파생
  const categoryId = searchParams.get("categoryId");
  const pageParam = searchParams.get("page");
  const initialPage = pageParam ? parseInt(pageParam) : 1;

  const { activeCategory, activeSubCategory } = useMemo(() => {
    if (!categoryId || categories.length === 0) {
      return { activeCategory: undefined, activeSubCategory: undefined };
    }
    const categoryIdNum = parseInt(categoryId);
    for (const category of categories) {
      const matchedSub = category.subCategories.find(
        (sub: SubCategory) => sub.categoryId === categoryIdNum
      );
      if (matchedSub) {
        return { activeCategory: category, activeSubCategory: matchedSub };
      }
    }
    return { activeCategory: undefined, activeSubCategory: undefined };
  }, [categoryId, categories]);

  const checkScrollButtons = () => {
    if (tabsRef.current) {
      setCanScrollLeft(tabsRef.current.scrollLeft > 0);
      setCanScrollRight(tabsRef.current.scrollLeft < tabsRef.current.scrollWidth - tabsRef.current.clientWidth);
    }
  };

  // 카테고리 로드
  useEffect(() => {
    getCategories().then((res) => {
      const cats = res.data;
      const filtered = cats.filter(
        (category: { subCategories: SubCategory[] }) => category.subCategories && category.subCategories.length > 0
      );
      setCategories(filtered);
    });

    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);

  // categoryId 없이 진입 시 기본값으로 replace redirect
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      navigate(`/boardList?categoryId=${categories[0].subCategories[0].categoryId}`, { replace: true });
    }
  }, [categories, categoryId, navigate]);

  // fetchData 함수 안정화 - activeSubCategory.categoryId가 변경될 때만 새 참조
  const fetchData = useMemo(() => {
    if (!activeSubCategory) return null;
    return (pageNum: number) => getBoards(activeSubCategory.categoryId, pageNum);
  }, [activeSubCategory?.categoryId]);

  const searchData = useMemo(() => {
    if (!activeSubCategory) return undefined;
    return (cond: any, pageNum: number) =>
      searchBoards(cond, activeSubCategory.categoryId, pageNum);
  }, [activeSubCategory?.categoryId]);

  // 커스텀 훅 사용 - fetchData가 null이 아닐 때만 유효
  const {
    data: posts,
    totalPages,
    currentPage,
    isLoading,
    error,
    goToPage,
    search,
    resetSearch,
  } = usePaginatedData({
    fetchData: fetchData ?? EMPTY_FETCH,
    searchData,
    initialPage,
  });

  const handlePageChange = useCallback((page: number) => {
    navigate(`/boardList?categoryId=${categoryId}&page=${page}`, { replace: true });
    goToPage(page);
  }, [navigate, categoryId, goToPage]);

  const renderColumn = (row: any, key: Extract<keyof BoardTableColDef, string>) => {
    switch (key) {
      case "title":
        return (
          <Link to={`/boardDetail/${row["board_code"]}?categoryId=${categoryId}&page=${currentPage}`}>{row[key]}</Link>
        );
      default:
        return <>{row[key]}</>;
    }
  };

  const renderCategoryTab = () => {
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

    const handleCategoryChange = (category: Category) => {
      navigate(`/boardList?categoryId=${category.subCategories[0].categoryId}`, { replace: true });
    };

    return (
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
              <div key={category.categoryId} className="relative group">
                <button
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap cursor-pointer transition-all duration-300 relative ${
                    activeCategory?.categoryId === category.categoryId
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange(category)}>
                  {category.value}
                  {activeCategory?.categoryId === category.categoryId && (
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
    );
  };

  const renderCategoryBar = () => {
    return (
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">현재 카테고리 </span>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center space-x-1 focus:outline-none">
              <span>
                {activeCategory?.value} &gt; {activeSubCategory?.value}
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
                        activeSubCategory?.categoryId === subCategory.categoryId
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                      onClick={() => {
                        navigate(`/boardList?categoryId=${subCategory.categoryId}`, { replace: true });
                        setIsDropdownOpen(false);
                      }}>
                      <span>{subCategory.value}</span>
                      {activeSubCategory?.categoryId === subCategory.categoryId && <i className="fas fa-check text-blue-600"></i>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <ButtonWrapper onClick={() => navigate(`/boardCreate?categoryId=${activeSubCategory?.categoryId}`)}>
          <>
            <i className="fas fa-pencil-alt mr-1"></i> 글쓰기
          </>
        </ButtonWrapper>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Category tabs with horizontal scroll */}
            {renderCategoryTab()}
            {/* Active category display */}
            {renderCategoryBar()}
            {activeSubCategory && fetchData && (
              <DataTableCustom<PostSimpleInfo, BoardTableColDef>
                rows={posts}
                rowDef={rowDef}
                getRowKey={(post) => post.board_code}
                renderColumn={renderColumn}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                isLoading={isLoading}
                error={error}
                searchEnabled={true}
                onSearch={search}
                onResetSearch={resetSearch}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BoardList;
