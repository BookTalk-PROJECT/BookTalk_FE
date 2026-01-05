import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

// Types and constants for book search
const API_BASE_URL = import.meta.env.VITE_API_URL;
const PAGE_SIZE_DEFAULT = 20;

const PLACEHOLDER_COVER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='160'>
      <rect width='100%' height='100%' fill='#f3f4f6'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='Arial, sans-serif' font-size='12' fill='#9ca3af'>NO COVER</text>
    </svg>`
  );

export interface SearchResult {
  id: string;
  title: string;
  isbn: string;
  cover: string;
  _author: string;
  _year: string;
  _publisher: string;
}

interface BookSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookSelect: (book: SearchResult) => void;
}

const BookSearchModal: React.FC<BookSearchModalProps> = ({ isOpen, onClose, onBookSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(PAGE_SIZE_DEFAULT);
  const [total, setTotal] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const doSearch = async (kwd: string, page = 1) => {
    if (!kwd.trim()) return;

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }

    setSearchResults([]);
    setIsSearching(true);
    setErrorMsg(null);

    try {
      const params = new URLSearchParams({
        kwd: kwd.trim(),
        pageNum: String(page),
        pageSize: String(pageSize),
      });

      const res = await axios.get(`${API_BASE_URL}/nlk/search?${params.toString()}`);

      const data = res.data;
      console.log(data);

      const mapped: SearchResult[] = (data.items ?? []).map(
        (it: any) =>
          ({
            id: it.id || it.isbn || crypto.randomUUID(),
            title: it.title,
            isbn: it.isbn,
            cover: it.cover || PLACEHOLDER_COVER,
            _author: it.author || "",
            _year: it.year || "",
            _publisher: it.publisher || "",
          } as SearchResult)
      );

      setSearchResults(() => mapped);
      setTotal(data.total ?? 0);
      setPageNum(data.pageNum ?? page);
    } catch (err: any) {
      console.error("도서 검색 실패:", err);
      setErrorMsg("도서 검색 중 오류가 발생했습니다. (서버 또는 네트워크 문제일 수 있어요)");
      setSearchResults([]);
      setTotal(0);
    } finally {
      setIsSearching(false);
    }
  };

  const onSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim()) doSearch(searchQuery.trim(), 1);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchResults([]);
      setTotal(0);
      setPageNum(1);
      setErrorMsg(null);
      setSearchQuery("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl flex flex-col h-[50vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">책 검색</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="도서명을 입력 후 엔터"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={onSearchInputKeyDown}
          />
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>

        <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
          <div>{total > 0 ? `검색 결과: ${total.toLocaleString()}건` : "검색어를 입력해 주세요"}</div>
          {isSearching && <div className="animate-pulse">조회 중...</div>}
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto rounded-md border border-gray-200 divide-y">
          {errorMsg && <div className="p-4 text-red-600">{errorMsg}</div>}

          {!errorMsg && searchResults.length === 0 && !isSearching && (
            <div className="p-6 text-center text-gray-400">검색 결과가 없습니다</div>
          )}

          {!errorMsg &&
            searchResults.map((result) => (
              <button
                key={result.id}
                className="w-full text-left px-3 py-3 hover:bg-gray-50"
                onClick={() => onBookSelect(result)}
                title={result.title}>
                <div className="flex gap-3 items-start">
                  <img
                    src={result.cover}
                    alt={result.title}
                    className="w-[64px] h-[84px] object-cover rounded border border-gray-200 flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_COVER;
                    }}
                  />
                  <div className="flex-1 pr-2 min-w-0">
                    <div
                      className="font-medium leading-tight"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as any,
                        overflow: "hidden",
                      }}>
                      {result.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate">ISBN: {result.isbn || "-"}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {result._author ? `저자: ${result._author}` : ""}
                      {result._author && result._year ? " · " : ""}
                      {result._year ? `발행: ${result._year}` : ""}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {result._publisher ? `출판사: ${result._publisher}` : ""}
                    </div>
                  </div>
                </div>
              </button>
            ))}
        </div>

        {total > pageSize && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">페이지 {pageNum}</div>
            <div className="space-x-2">
              <button
                className="px-3 py-1 rounded border text-sm disabled:opacity-40"
                disabled={pageNum <= 1 || isSearching}
                onClick={() => doSearch(searchQuery.trim(), pageNum - 1)}>
                이전
              </button>
              <button
                className="px-3 py-1 rounded border text-sm disabled:opacity-40"
                disabled={pageNum * pageSize >= total || isSearching}
                onClick={() => doSearch(searchQuery.trim(), pageNum + 1)}>
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearchModal;
