import { useState } from "react";
import { BookReview } from "../types/bookReview";
import { Category, SubCategory } from "../../community/board/type/board";
import { useNavigate, useSearchParams } from "react-router";
import { useRef } from "react";
import { useEffect } from "react";
import { getCategories } from "../../community/category/api/categoryApi";
import { deleteBookReview, getBookReviewList } from "../api/bookReviewApi";
import CustomButton from "../../common/component/CustomButton";
import LoadingBar from "../../common/component/Loading";
import BookReviewCard from "../components/BookReviewCard";

const BookReviewList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>();

  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);

  // MyPageTable의 loadContents와 동일한 패턴
  const loadReviews = (pageNum: number) => {
    setIsLoading(true);
    getBookReviewList(pageNum, 6)
      .then((res) => {
        setReviews(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // MyPageTable과 동일: 초기 로딩만 useEffect에서
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

          const matchedSubCategory = categories.find((category) => category.categoryId === categoryIdNum);
          if (matchedSubCategory) {
            activeCategory = matchedSubCategory;
          }
          if (activeCategory) {
            setActiveCategory(activeCategory);
          }
        } else {
          setActiveCategory(filteredCategories[0]);
        }
      });
    };
    initCategories();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReviews(currentPage);
    // 초기 로딩 - 한 번만!
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, []); // 빈 배열: 마운트 시 한 번만

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReviews(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (activeCategory) {
      setSearchParams({ categoryId: activeCategory.categoryId.toString() });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(1);
    }
  }, [activeCategory]);

  const handlePageChange = (pageNum: number) => {
    if (activeCategory) {
      setSearchParams({
        categoryId: activeCategory.categoryId.toString(),
        page: pageNum.toString(),
      });
    }
    setCurrentPage(pageNum);
  };

  const handleDelete = async (code: string) => {
    setIsLoading(true);
    try {
      await deleteBookReview(code);
      // 현재 페이지 다시 로드
      loadReviews(currentPage);
    } catch (error) {
      console.error("Error deleting review:", error);
      setIsLoading(false);
    }
  };

  const handleCategoryChange = async (category: Category) => {
    setActiveCategory(category);
  };

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Carousel */}
        <div className="relative mb-6">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center hover:bg-gray-100"
            aria-label="scroll left">
            &lt;
          </button>
          <div ref={carouselRef} className="flex space-x-2 overflow-x-auto scrollbar-hide py-2 px-10">
            {categories.map((category) => (
              <button
                key={category.categoryId}
                onClick={() => handleCategoryChange(category)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  activeCategory === category ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}>
                {category.value}
              </button>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center hover:bg-gray-100"
            aria-label="scroll right">
            &gt;
          </button>
        </div>

        {/* Create Button */}
        <div className="flex justify-end mb-6">
          <CustomButton color="blue" onClick={() => navigate("/book-review/create")}>
            <i className="fas fa-pen mr-2"></i>북리뷰 작성하기
          </CustomButton>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <LoadingBar />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <BookReviewCard key={review.code} review={review} onDelete={handleDelete} />
              ))}
            </div>
            <div className="mt-10">
              {/* MyPageTable과 동일한 패턴 */}
              <PagenationCustom totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface PagenationProps {
  totalPages: number;
  currentPage: number;
  handlePageChange: (pageNum: number) => void;
}

const PagenationCustom: React.FC<PagenationProps> = ({ totalPages, currentPage, handlePageChange }) => {
  const [pageRange, setPageRange] = useState<Array<number>>([]);

  // pageRange 생성 함수
  const getIntegerArray = (start: number, end: number) => {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };

  useEffect(() => {
    if (totalPages < 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPageRange([]);
      return;
    }
    const startVal = Math.floor((currentPage - 1) / 10) * 10 + 1;
    const endVal = Math.min(startVal + 9, totalPages);
    setPageRange(getIntegerArray(startVal, endVal));
  }, [totalPages, currentPage]);

  // 렌더링
  if (totalPages === 0) return null; // or <div>페이지 없음</div>

  return (
    <div className="flex justify-center items-center space-x-2 p-4 border-t">
      <button
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="!rounded-button whitespace-nowrap px-3 py-1 bg-gray-200 text-gray-700 disabled:opacity-50">
        <i className="fas fa-chevron-left"></i>
      </button>
      {pageRange.map((value) => (
        <button
          key={value}
          onClick={() => handlePageChange(value)}
          className={`!rounded-button whitespace-nowrap px-3 py-1 ${
            currentPage === value ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}>
          {value}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="!rounded-button whitespace-nowrap px-3 py-1 bg-gray-200 text-gray-700 disabled:opacity-50">
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default BookReviewList;
