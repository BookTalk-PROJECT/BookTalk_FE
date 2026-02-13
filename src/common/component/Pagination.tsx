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

  const isEmpty = totalPages === 0;

  return (
    <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 p-4 border-t">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={isEmpty || currentPage === 1}
        className="rounded-lg whitespace-nowrap px-3 py-1 bg-gray-200 text-gray-700 disabled:opacity-50">
        <i className="fas fa-chevron-left"></i>
      </button>
      {isEmpty ? (
        <button
          disabled
          className="rounded-lg whitespace-nowrap px-3 py-1 bg-emerald-600 text-white opacity-50">
          1
        </button>
      ) : (
        pageRange.map((value) => (
          <button
            key={value}
            onClick={() => onPageChange(value)}
            className={`rounded-lg whitespace-nowrap px-3 py-1 ${
              currentPage === value ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700"
            }`}>
            {value}
          </button>
        ))
      )}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={isEmpty || currentPage === totalPages}
        className="rounded-lg whitespace-nowrap px-3 py-1 bg-gray-200 text-gray-700 disabled:opacity-50">
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagination;
