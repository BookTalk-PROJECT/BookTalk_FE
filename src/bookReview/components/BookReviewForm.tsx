import React, { useState, useEffect, useCallback } from "react";
import { BookReviewCreate, BookReviewDetail } from "../types/bookReview";
import CustomButton from "../../common/component/CustomButton";
import CustomInput from "../../common/component/CustomInput";
import { Link } from "react-router-dom";

// Types and constants for book search
const NLK_API_BASE = "https://www.nl.go.kr/NL/search/openApi/search.do";
const PAGE_SIZE_DEFAULT = 20;

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

const PLACEHOLDER_COVER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='160'>
      <rect width='100%' height='100%' fill='#f3f4f6'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='Arial, sans-serif' font-size='12' fill='#9ca3af'>NO COVER</text>
    </svg>`
  );

const normalizeCover = (raw?: string, isbn?: string) => {
  const s = (raw || "").trim().toLowerCase();
  const looksLikeImage = (u: string) =>
    u.startsWith("http") && (u.endsWith(".jpg") || u.endsWith(".jpeg") || u.endsWith(".png"));
  if (looksLikeImage(s)) return raw as string;
  if (isbn && isbn.length >= 10) return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  return PLACEHOLDER_COVER;
};

interface SearchResult {
  id: string;
  title: string;
  isbn: string;
  cover: string;
  _author: string;
  _year: string;
  _publisher: string;
}

interface BookReviewFormProps {
  initialData?: BookReviewDetail; // For edit mode
  onSubmit: (data: BookReviewCreate) => void;
}

const BookReviewForm: React.FC<BookReviewFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<BookReviewCreate>(
    initialData
      ? {
          bookTitle: initialData.book_title,
          authors: initialData.authors,
          publisher: initialData.publisher,
          isbn: initialData.isbn,
          thumbnail: initialData.thumbnail_url,
          title: initialData.title,
          content: initialData.content,
          rating: initialData.rating,
          notificationYn: initialData.notification_yn,
        }
      : {
          bookTitle: "",
          authors: "",
          publisher: "",
          isbn: "",
          thumbnail: "",
          title: "",
          content: "",
          rating: 0,
          notificationYn: false,
        }
  );

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(PAGE_SIZE_DEFAULT);
  const [total, setTotal] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const doSearch = useCallback(
    async (kwd: string, page = 1) => {
      if (!kwd.trim()) return;
      setIsSearching(true);
      setErrorMsg(null);

      try {
        const url =
          `${NLK_API_BASE}` +
          `?key=${encodeURIComponent("5703ff0e81c46e44a276655ac78421a5b94bd4d7e3cb5ddf07db4db6d6509803")}` +
          "&apiType=json" +
          "&srchTarget=title" +
          `&kwd=${encodeURIComponent(kwd)}` +
          `&pageNum=${page}` +
          `&pageSize=${pageSize}`;

        const res = await fetch(url, { method: "GET" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log(data);

        const items: any[] = (Array.isArray(data.result) && data.result) || [];

        const mapped: SearchResult[] = items
          .map((it: any) => {
            const rawTitle = it.titleInfo;
            const title = stripHtml(rawTitle);
            const rawIsbn = (it.isbn || "").toString();
            const isbn = rawIsbn.replace(/[^0-9Xx]/g, "");
            const author = stripHtml(it.authorInfo || "");
            const publisher = stripHtml(it.pubInfo || "");
            const year = stripHtml(it.pub_yearInfo || "");
            const cover = normalizeCover(it.imageUrl, isbn);

            return {
              id: isbn || it.id || it.control_no || crypto.randomUUID(),
              title,
              isbn,
              cover,
              _author: author,
              _year: year,
              _publisher: publisher,
            };
          })
          .filter((x) => x.title && x.isbn);

        setSearchResults(mapped);
        setTotal(parseInt(data?.result?.total || `${mapped.length}`, 10) || mapped.length);
        setPageNum(page);
      } catch (err: any) {
        console.error(err);
        setErrorMsg("도서 검색 중 오류가 발생했습니다.");
        setSearchResults([]);
        setTotal(0);
      } finally {
        setIsSearching(false);
      }
    },
    [pageSize]
  );

  const onSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim()) doSearch(searchQuery.trim(), 1);
    }
  };

  useEffect(() => {
    if (!isSearchModalOpen) {
      setSearchResults([]);
      setTotal(0);
      setPageNum(1);
      setErrorMsg(null);
      setSearchQuery("");
    }
  }, [isSearchModalOpen]);

  const handleBookSelect = (book: SearchResult) => {
    setFormData((prev) => ({
      ...prev,
      bookTitle: book.title,
      authors: book._author,
      publisher: book._publisher,
      isbn: book.isbn,
      thumbnail: book.cover,
    }));
    setIsSearchModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating: rating,
    }));
  };

  const handleValidationAndSubmit = () => {
    if (!formData.bookTitle || !formData.isbn) {
      alert("도서를 검색하여 선택해주세요.");
      return;
    }
    if (!formData.title.trim()) {
      alert("리뷰 제목을 입력해주세요.");
      return;
    }
    if (!formData.content.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }
    if (formData.rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }
    onSubmit(formData);
  };

  const isEditMode = !!initialData;

  return (
    <>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto my-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditMode ? "리뷰 수정" : "리뷰 작성"}</h2>
        <div className="space-y-6">
          <>
            <div className="flex items-end gap-2">
              <div className="flex-grow">
                <CustomInput
                  label="도서명"
                  type="text"
                  name="bookTitle"
                  value={formData.bookTitle}
                  onChange={handleChange}
                  placeholder="도서 검색 버튼을 눌러 도서를 선택하세요"
                  readOnly
                />
              </div>
              <CustomButton type="button" onClick={() => setIsSearchModalOpen(true)} color="gray">
                도서 검색
              </CustomButton>
            </div>

            <CustomInput
              label="저자"
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              placeholder="도서 검색시 자동으로 입력됩니다"
              readOnly
            />
            <CustomInput
              label="출판사"
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="도서 검색시 자동으로 입력됩니다"
            />
            <CustomInput
              label="ISBN"
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="도서 검색시 자동으로 입력됩니다"
              readOnly
            />
            <CustomInput
              label="썸네일 URL"
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="도서 검색시 자동으로 입력됩니다"
              readOnly
            />
             {formData.thumbnail && (
              <div className="flex justify-center">
                 <img src={formData.thumbnail} alt="표지" className="w-32 h-44 object-cover rounded shadow-sm" />
              </div>
            )}
          </>

          <CustomInput
            label="제목"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
          />
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              value={formData.content}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="내용을 입력하세요"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">별점</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-3xl ${
                    (formData.rating ?? 0) >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => handleRatingChange(star)}>
                  &#9733;
                </span>
              ))}
            </div>
          </div>
          {!isEditMode && (
            <div className="flex items-center">
              <input
                id="notificationYn"
                name="notificationYn"
                type="checkbox"
                checked={formData.notificationYn}
                onChange={handleChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="notificationYn" className="ml-2 block text-sm text-gray-900">
                공지글로 등록 (관리자 전용)
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <CustomButton type="button" onClick={handleValidationAndSubmit} color="blue">
              {isEditMode ? "수정하기" : "작성하기"}
            </CustomButton>
            <Link to="/book-review">
              <CustomButton color="none">취소</CustomButton>
            </Link>
          </div>
        </div>
      </div>

      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">책 검색</h2>
              <button onClick={() => setIsSearchModalOpen(false)} className="text-gray-500 hover:text-gray-700">
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

            <div className="flex-grow max-h-[60vh] overflow-y-auto rounded-md border border-gray-200 divide-y">
              {errorMsg && <div className="p-4 text-red-600">{errorMsg}</div>}

              {!errorMsg && searchResults.length === 0 && !isSearching && (
                <div className="p-6 text-center text-gray-400">검색 결과가 없습니다</div>
              )}

              {!errorMsg &&
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    className="w-full text-left px-3 py-3 hover:bg-gray-50"
                    onClick={() => handleBookSelect(result)}
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
      )}
    </>
  );
};

export default BookReviewForm;
