import { useMemo } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  // 페이지 범위 계산 (순수 계산, 부수효과 없음)
  const pageRange = useMemo(() => {
    if (totalPages < 1) return [];
    const startVal = Math.floor((currentPage - 1) / 10) * 10 + 1;
    const endVal = Math.min(startVal + 9, totalPages);
    const result = [];
    for (let i = startVal; i <= endVal; i++) {
      result.push(i);
    }
    return result;
  }, [totalPages, currentPage]);

  if (totalPages === 0) return null;

  return (
    <div className="flex justify-center items-center space-x-2 p-4 border-t">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="!rounded-button whitespace-nowrap px-3 py-1 bg-gray-200 text-gray-700 disabled:opacity-50">
        <i className="fas fa-chevron-left"></i>
      </button>
      {pageRange.map((value) => (
        <button
          key={value}
          onClick={() => onPageChange(value)}
          className={`!rounded-button whitespace-nowrap px-3 py-1 ${
            currentPage === value ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}>
          {value}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="!rounded-button whitespace-nowrap px-3 py-1 bg-gray-200 text-gray-700 disabled:opacity-50">
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagination;
