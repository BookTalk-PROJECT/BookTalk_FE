import React, { useState, useRef, useEffect } from "react";
import ButtonWrapper from "../../../common/component/Button";
import { useNavigate, useSearchParams } from "react-router";
import { Category, SubCategory } from "../type/board";
import { SearchType } from "../../../common/type/common";
import { PostSimpleInfo } from "../../../common/component/Board/type/BoardDetailTypes";
import { getCategories } from "../../category/api/categoryApi";
import { getBoards, searchBoards } from "../api/boardApi";
import DataTableCustom from "../../../common/component/DataTableCustom";
import { RowDef } from "../../../common/type/common";
import { Link } from "react-router-dom";

type BoardTableColDef = {
  board_code: string;
  title: string;
  author: string;
  date: string;
  views: string;
};

const BoardList: React.FC = () => {
  const rowDef: RowDef<BoardTableColDef>[] = [
    { label: "게시물 번호", key: "board_code", isSortable: true, isSearchType: true },
    { label: "제목", key: "title", isSortable: true, isSearchType: true },
    { label: "작성자", key: "author", isSortable: true, isSearchType: true },
    { label: "날짜", key: "date", isSortable: true, isSearchType: true },
    { label: "조회수", key: "views", isSortable: true, isSearchType: true },
  ];

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [forceUpdate, setForceUpdate] = useState(0);
  const [posts, setPosts] = useState<PostSimpleInfo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>();
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>();

  const checkScrollButtons = () => {
    if (tabsRef.current) {
      setCanScrollLeft(tabsRef.current.scrollLeft > 0);
      setCanScrollRight(tabsRef.current.scrollLeft < tabsRef.current.scrollWidth - tabsRef.current.clientWidth);
    }
  };

  useEffect(() => {
    const initCategories = () => {
      getCategories().then((res) => {
        const categories = res.data;
        const filteredCategories = categories.filter(
          (category: { subCategories: SubCategory[] }) => category.subCategories && category.subCategories.length > 0
        );
        setCategories(filteredCategories);
        const categoryId = searchParams.get("categoryId");
        if (categoryId) {
          const categoryIdNum = parseInt(categoryId);
          let activeCategory = null;
          let activeSubCategory = null;

          for (const category of filteredCategories) {
            const matchedSubCategory = category.subCategories.find(
              (subCategory: { categoryId: number }) => subCategory.categoryId === categoryIdNum
            );
            if (matchedSubCategory) {
              activeCategory = category;
              activeSubCategory = matchedSubCategory;
              break;
            }
          }

          if (activeCategory && activeSubCategory) {
            setActiveCategory(activeCategory);
            setActiveSubCategory(activeSubCategory);
          }
        } else {
          setActiveCategory(filteredCategories[0]);
          setActiveSubCategory(filteredCategories[0].subCategories[0]);
        }
      });
    };

    initCategories();
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);

  useEffect(() => {
    if (activeSubCategory) {
      setSearchParams({ categoryId: activeSubCategory.categoryId.toString() });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForceUpdate((v) => v + 1);
    }
  }, [activeSubCategory]);

  const renderColumn = (row: any, key: Extract<keyof BoardTableColDef, string>) => {
    switch (key) {
      case "title":
        return (
          <Link to={`/boardDetail/${row["board_code"]}?categoryId=${searchParams.get("categoryId")}`}>{row[key]}</Link>
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

    const handleCategoryChange = async (catetory: Category) => {
      setActiveCategory(catetory);
      setActiveSubCategory(catetory.subCategories[0]);
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
                    activeCategory === category
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                  onClick={async () => {
                    await handleCategoryChange(category);
                  }}>
                  {category.value}
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
                        activeSubCategory === subCategory
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                      onClick={() => {
                        setActiveSubCategory(subCategory);
                        setIsDropdownOpen(false);
                      }}>
                      <span>{subCategory.value}</span>
                      {activeSubCategory === subCategory && <i className="fas fa-check text-blue-600"></i>}
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
            {activeSubCategory && (
              <DataTableCustom<PostSimpleInfo, BoardTableColDef>
                rows={posts}
                rowDef={rowDef}
                getRowKey={(post) => post.board_code}
                renderColumn={renderColumn}
                setRowData={setPosts}
                loadRowData={(pageNum) => {
                  return getBoards(activeSubCategory.categoryId, pageNum);
                }}
                searchRowData={(cond, pageNum) => {
                  return searchBoards(cond, activeSubCategory.categoryId, pageNum);
                }}
                forceUpdate={forceUpdate}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BoardList;
