import { useEffect, useState } from "react";

interface PagenationProps {
  totalPages: number;
  loadPageByPageNum: (pageNum: number) => void;
}

const Pagenation: React.FC<PagenationProps> = ({ totalPages, loadPageByPageNum }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageRange, setPageRange] = useState<Array<number>>([]);

  const initStates = () => {
    const startVal = Math.floor(currentPage / 10) * 10 + 1;
    const endVal = totalPages == 0 ? 1 : startVal + (10 - 1) < totalPages ? startVal + (10 - 1) : totalPages;
    setPageRange(getIntegerArray(startVal, endVal));
  };

  const getIntegerArray = (start: number, end: number) => {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };

  useEffect(() => {
    initStates();
    loadPageByPageNum(currentPage);
  }, [currentPage]);
  return (
    <div className="flex justify-center items-center space-x-2 p-4 border-t">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
        disabled={currentPage === 0}
        className="!rounded-button whitespace-nowrap px-3 py-1 bg-gray-200 text-gray-700 disabled:opacity-50">
        <i className="fas fa-chevron-left"></i>
      </button>
      {pageRange.map((value, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(value - 1)}
          className={`!rounded-button whitespace-nowrap px-3 py-1 ${currentPage === value - 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}>
          {value}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages - 1}
        className="!rounded-button whitespace-nowrap px-3 py-1 bg-gray-200 text-gray-700 disabled:opacity-50">
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagenation;
