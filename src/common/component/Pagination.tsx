import { useEffect, useState } from "react";

interface PagenationProps {
  totalPages: number;
  loadPageByPageNum: (pageNum: number) => void;
}

const Pagenation: React.FC<PagenationProps> = ({ totalPages, loadPageByPageNum }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageRange, setPageRange] = useState<Array<number>>([]);

  // pageRange 생성 함수
  const getIntegerArray = (start: number, end: number) => {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };

  // 페이지 범위 계산, currentPage 변경에 따라 동작
  useEffect(() => {
    if (totalPages < 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPageRange([]);
      setCurrentPage(1);
      return;
    }
    const startVal = Math.floor((currentPage - 1) / 10) * 10 + 1;
    const endVal = Math.min(startVal + 9, totalPages);
    setPageRange(getIntegerArray(startVal, endVal));
  }, [totalPages, currentPage]);

  // currentPage 범위 자동 수정 (totalPages 변경 시 클리핑)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage((prev) => {
      if (totalPages === 0) return 1;
      return Math.min(prev, totalPages);
    });
  }, [totalPages]);

  // 페이지 이동시 호출
  useEffect(() => {
    if (totalPages > 0) {
      loadPageByPageNum(currentPage);
    }
  }, [currentPage, totalPages]);

  // 렌더링
  if (totalPages === 0) return null; // or <div>페이지 없음</div>

  return (
    <div className="flex justify-center items-center space-x-2 p-4 border-t">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="!rounded-button whitespace-nowrap px-3 py-1 bg-gray-200 text-gray-700 disabled:opacity-50">
        <i className="fas fa-chevron-left"></i>
      </button>
      {pageRange.map((value) => (
        <button
          key={value}
          onClick={() => setCurrentPage(value)}
          className={`!rounded-button whitespace-nowrap px-3 py-1 ${
            currentPage === value ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}>
          {value}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="!rounded-button whitespace-nowrap px-3 py-1 bg-gray-200 text-gray-700 disabled:opacity-50">
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagenation;
