import React, { useCallback, useEffect, useMemo, useState } from "react";
import GatheringTextarea from "../component/GatheringTextarea";
import CustomButton from "../../common/component/CustomButton";
import CustomInput from "../../common/component/CustomInput";
import { Books, GatheringCreateRequest, Question, SearchResult } from "../type/GatheringCreatePage.types";

// NLK(Open API)
const API_BASE_URL = import.meta.env.VITE_API_URL;
const PAGE_SIZE_DEFAULT = 20;

// ---------- 유틸 ----------
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

const toYMD = (d?: Date | null) => {
  if (!d) return "";
  try {
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

type Status = "INTENDED" | "PROGRESS" | "END";
const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "INTENDED", label: "모집중" },
  { value: "PROGRESS", label: "진행중" },
  { value: "END", label: "완료" },
];

type Mode = "create" | "edit";

export interface GatheringFormInitial extends Partial<GatheringCreateRequest> {
  // edit 모드에서만 올 수 있는 확장 필드
  status?: Status;
  imageUrl?: string | null; // 서버의 기존 이미지
}

interface Props {
  mode: Mode;
  initial?: GatheringFormInitial; // edit에서만 의미 있음
  onSubmit: (fd: FormData) => Promise<void>;
  onCancel: () => void;
}

// 공용 폼
const GatheringForm: React.FC<Props> = ({ mode, initial, onSubmit, onCancel }) => {
  const isEdit = mode === "edit";
  const allowMultiBooks = isEdit; // 생성은 1권, 수정은 여러 권

  // ---------------- 상태 ----------------
  // 책
  const [books, setBooks] = useState<Books[]>(initial?.books || []);
  const [bookCovers, setBookCovers] = useState<Record<string, string>>({});

  // 책 검색 모달
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // 이미지
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [serverImageUrl, setServerImageUrl] = useState<string | null>(initial?.imageUrl ?? null);

  // 기준 정보
  const [createData, setCreateData] = useState({
    groupName: initial?.groupName || "",
    location: initial?.location || "",
    meetingDetails: initial?.meetingDetails || "",
    recruitmentPersonnel: initial?.recruitmentPersonnel || "",
  });

  // 기간
  const [recruitmentPeriod, setRecruitmentPeriod] = useState(initial?.recruitmentPeriod || "");
  const [activityPeriod, setActivityPeriod] = useState(initial?.activityPeriod || "");
  const [recruitmentDate, setRecruitmentDate] = useState<Date | null>(
    initial?.recruitmentPeriod ? new Date(initial.recruitmentPeriod) : null
  );
  const [activityDate, setActivityDate] = useState<Date | null>(
    initial?.activityPeriod ? new Date(initial.activityPeriod) : null
  );

  // 상태(수정만)
  const [status, setStatus] = useState<Status>(initial?.status || "INTENDED");

  // 가입 질문
  const [questions, setQuestions] = useState<Question[]>(initial?.questions || []);
  const [newQuestion, setNewQuestion] = useState("");

  // 해시태그
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>(initial?.hashtags || []);

  // ---------------- 핸들러 ----------------
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() && questions.length < 5) {
      const newId = Math.max(...questions.map((q) => q.id), 0) + 1;
      setQuestions([...questions, { id: newId, question: newQuestion }]);
      setNewQuestion("");
    }
  };

  const handleRemoveQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && hashtagInput.trim()) {
      e.preventDefault();
      const newTag = hashtagInput.trim();
      if (!hashtags.includes(newTag)) setHashtags([...hashtags, newTag]);
      setHashtagInput("");
    }
  };

  const removeHashtag = (tag: string) => setHashtags((prev) => prev.filter((t) => t !== tag));

  const handleRemoveBook = (isbn: string) => {
    setBooks((prev) => prev.filter((b) => String(b.isbn) !== String(isbn)));
    setBookCovers((prev) => {
      const { [isbn]: _, ...rest } = prev;
      return rest;
    });
  };

  // ---------------- 제출 ----------------
  const handleSubmit = async () => {
    const payload: any = {
      groupName: createData.groupName,
      location: createData.location,
      meetingDetails: createData.meetingDetails,
      recruitmentPersonnel: createData.recruitmentPersonnel,
      recruitmentPeriod,
      activityPeriod,
      books,
      questions,
      hashtags,
    };
    if (isEdit) payload.status = status;

    const fd = new FormData();
    fd.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    if (imageFile) fd.append("image", imageFile);

    await onSubmit(fd);
  };

  // ---------------- 검색 ----------------
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
        const params = new URLSearchParams({
          kwd: kwd.trim(),
          pageNum: String(page),
          pageSize: String(pageSize),
        });

        // 백엔드 프록시 호출
        const url = `${API_BASE_URL}/nlk/search?${params.toString()}`;

        const res = await fetch(url, { method: "GET" });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        // 백엔드에서 NlkSearchResponse 형태로 내려온다고 가정:
        // { total, pageNum, pageSize, items: [{ id, title, isbn, author, year, cover }] }
        setSearchResults(
          (data.items ?? []).map((it: any) => ({
            id: it.id,
            title: it.title,
            isbn: it.isbn,
            cover: it.cover,
            _author: it.author,
            _year: it.year,
          }))
        );

        setTotal(data.total ?? 0);
        setPageNum(data.pageNum ?? page);
      } catch (err) {
        console.error("도서 검색 실패:", err);
        setErrorMsg("도서 검색 중 오류가 발생했습니다. (서버 또는 네트워크 문제일 수 있어요)");
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

  const handleBookStatusChange = (isbn: string | number, nextStatus: number) => {
    setBooks((prev) =>
      prev.map((book) => (String(book.isbn) === String(isbn) ? { ...book, complete_yn: nextStatus } : book))
    );
  };
  // 모달 닫힐 때 초기화
  useEffect(() => {
    if (!isSearchModalOpen) {
      setSearchResults([]);
      setTotal(0);
      setPageNum(1);
      setErrorMsg(null);
      setSearchQuery("");
    }
  }, [isSearchModalOpen]);

  // 초기 커버 맵 세팅
  useEffect(() => {
    if (books.length === 0) return;
    setBookCovers((prev) => {
      const next = { ...prev };
      for (const b of books) {
        if (!next[b.isbn]) next[b.isbn] = PLACEHOLDER_COVER;
      }
      return next;
    });
  }, [books]);

  const canAddMoreBooks = useMemo(() => {
    return allowMultiBooks ? true : books.length === 0;
  }, [allowMultiBooks, books.length]);

  // ---------------- 렌더 ----------------
  return (
    <div className="w-full">
      {/* 선택된 책 카드 리스트 */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {books.map((book) => (
          <div key={book.isbn} className="relative w-full h-[260px] bg-white rounded-xl shadow-md p-4">
            {/* X */}
            <button
              aria-label="선택한 책 제거"
              title="선택한 책 제거"
              className="absolute -right-2 -top-2 z-10 w-7 h-7 rounded-full bg-white border shadow hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition"
              onClick={() => handleRemoveBook(String(book.isbn))}>
              ×
            </button>

            <div className="flex gap-4 h-full">
              <img
                src={bookCovers[book.isbn] || PLACEHOLDER_COVER}
                alt={book.name}
                className="w-[88px] h-[118px] object-cover rounded border border-gray-200 flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_COVER;
                }}
              />
              <div className="flex flex-col flex-1 min-w-0">
                <div
                  className="font-semibold leading-snug"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical" as any,
                    overflow: "hidden",
                  }}
                  title={book.name}>
                  {book.name}
                </div>
                <div className="text-xs text-gray-500 mt-1 truncate" title={String(book.isbn)}>
                  ISBN: {book.isbn}
                </div>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <span className="text-[11px] text-gray-500"></span>
                  <div className="flex items-center gap-2">
                    {/* 상태 배지 (현재 상태 표시) */}
                    <span
                      className={`px-2.5 py-1 text-xs rounded ${
                        book.complete_yn === 1 ? "bg-blue-500 text-white" : "bg-yellow-500 text-white"
                      }`}>
                      {book.complete_yn === 1 ? "완료" : "진행중"}
                    </span>
                    {/* 실제 선택 컨트롤 */}
                    <select
                      className="text-[10px] border border-gray-300 rounded px-1.5 py-0.5 bg-white focus:outline-none focus:ring-1 focus:ring-purple-400"
                      value={book.complete_yn}
                      onChange={(e) => handleBookStatusChange(book.isbn, Number(e.target.value))}>
                      <option value={0}>진행중</option>
                      <option value={1}>완료</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* 추가 버튼: create는 1권 제한, edit는 무제한 */}
        {canAddMoreBooks && (
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full h-[260px] bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
            <i className="fas fa-plus text-2xl text-gray-600"></i>
          </button>
        )}
      </div>

      {/* 검색 모달 */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[720px] shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">책 검색</h2>
              <button onClick={() => setIsSearchModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="도서명을 입력 후 엔터"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={onSearchInputKeyDown}
              />
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-white bg-gray-800 px-3 py-1 rounded-md"
                onClick={() => searchQuery.trim() && doSearch(searchQuery.trim(), 1)}>
                검색
              </button>
            </div>

            <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
              <div>{total > 0 ? `검색 결과: ${total.toLocaleString()}건` : "검색어를 입력해 주세요"}</div>
              {isSearching && <div className="animate-pulse">조회 중...</div>}
            </div>

            <div className="max-h-[460px] overflow-y-auto rounded-md border border-gray-200 divide-y">
              {errorMsg && <div className="p-4 text-red-600">{errorMsg}</div>}

              {!errorMsg && searchResults.length === 0 && !isSearching && (
                <div className="p-6 text-center text-gray-400">검색 결과가 없습니다</div>
              )}

              {!errorMsg &&
                (searchResults as any[]).map((result: any, index) => {
                  const disabled = !result.isbn;
                  const cover = result.cover || PLACEHOLDER_COVER;
                  return (
                    <button
                      key={`${result.id}-${index}`}
                      className={`w-full text-left px-3 py-3 hover:bg-gray-50 ${
                        disabled ? "opacity-60 cursor-not-allowed hover:bg-white" : ""
                      }`}
                      onClick={() => {
                        if (disabled) {
                          alert("이 자료는 ISBN이 없어 선택할 수 없습니다.");
                          return;
                        }
                        setBookCovers((prev) => ({ ...prev, [result.isbn]: cover }));
                        setBooks((prev) => {
                          // 중복 방지
                          if (prev.some((b) => String(b.isbn) === String(result.isbn))) return prev;
                          const nextOrder =
                            prev.length === 0 ? 0 : Math.max(...prev.map((b) => Number(b.order || 0))) + 1;
                          return [
                            ...prev,
                            {
                              isbn: result.isbn,
                              name: result.title,
                              order: nextOrder,
                              complete_yn: 0,
                              startDate: new Date().toISOString().split("T")[0],
                            } as Books,
                          ];
                        });
                        setIsSearchModalOpen(false);
                      }}
                      disabled={disabled}
                      title={result.title}>
                      <div className="flex gap-3 items-start">
                        <img
                          src={cover}
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
                          {(result._author || result._year) && (
                            <div className="text-[11px] text-gray-400 mt-0.5 truncate">
                              {result._author ? `저자: ${result._author}` : ""}
                              {result._author && result._year ? " · " : ""}
                              {result._year ? `발행: ${result._year}` : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
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

      {/* 기준 정보 + 가입 질문 */}
      <div className="flex gap-8">
        {/* 기준 정보 */}
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-4">기준 정보</h3>

          <div className="mb-4">
            <CustomInput
              label="모임명"
              name="groupName"
              placeholder="모임명을 입력하세요"
              value={createData.groupName}
              onChange={onChangeHandler}
            />
          </div>

          <div className="mb-4">
            <CustomInput
              label="지역"
              name="location"
              placeholder="도시 지역을 입력하세요"
              value={createData.location}
              onChange={onChangeHandler}
            />
          </div>

          <div className="mb-4">
            <GatheringTextarea
              label="모임 소개"
              name="meetingDetails"
              placeholder="모임 소개를 입력하세요"
              minHeight="400px"
              value={createData.meetingDetails}
              onChange={onChangeHandler}
            />
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <CustomInput
                label="모집 인원"
                name="recruitmentPersonnel"
                placeholder="인원수를 입력하세요"
                value={createData.recruitmentPersonnel}
                onChange={onChangeHandler}
              />
            </div>

            <div className="flex-1">
              <CustomInput
                type="date"
                label="활동 기간"
                name="activityPeriod"
                selected={activityDate}
                onChange={(date) => {
                  setActivityDate(date);
                  if (date) setActivityPeriod(toYMD(date));
                }}
                placeholder="활동 기간을 선택하세요"
              />
            </div>

            <div className="flex-1">
              <CustomInput
                type="date"
                label="모집 기간"
                name="recruitmentPeriod"
                selected={recruitmentDate}
                onChange={(date) => {
                  setRecruitmentDate(date);
                  if (date) setRecruitmentPeriod(toYMD(date));
                }}
                placeholder="모집기간을 선택하세요"
              />
            </div>
          </div>

          {/* 모임 상태: 수정 모드에서만 */}
          {isEdit && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">모임 상태</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}>
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 해시태그 */}
          <div className="mb-4">
            <label className="block text-sm text-purple-700 mb-1">해시 태그</label>
            <div className="w-full border border-purple-300 rounded p-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-purple-100 text-purple-700 text-sm px-2 py-1 rounded-full">
                    #{tag}
                    <button onClick={() => removeHashtag(tag)} className="ml-1 text-purple-500 hover:text-purple-800">
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleHashtagKeyDown}
                className="w-full border-0 focus:outline-none placeholder:text-sm placeholder:text-gray-400 px-2 py-1"
                placeholder="해시태그 입력 후 엔터를 눌러주세요"
              />
            </div>
          </div>

          {/* 대표 이미지 */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <label
                htmlFor="image-upload"
                className="px-4 py-2 rounded-lg text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer transition-all bg-gray-800 text-white hover:bg-gray-700">
                {isEdit ? "대표 이미지 변경" : "대표 이미지 추가"}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  setImageFile(files[0]);
                }}
              />
              {imageFile && (
                <div className="text-sm text-gray-600">
                  선택된 파일: <span className="font-semibold">{imageFile.name}</span>
                </div>
              )}
            </div>
            {imageFile ? (
              <img src={URL.createObjectURL(imageFile)} alt="미리보기" className="mt-2 max-w-xs rounded border" />
            ) : isEdit && serverImageUrl ? (
              <img
                src={API_BASE_URL + serverImageUrl}
                alt="기존 대표 이미지"
                className="mt-2 max-w-xs rounded border"
              />
            ) : null}
          </div>
        </div>

        {/* 세로 구분선 */}
        <div className="w-px bg-gray-300" />

        {/* 가입 질문 */}
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-4">가입 질문</h3>

          <div className="mb-4">
            <CustomInput
              label="질문"
              placeholder="질문 사항을 입력하세요"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddQuestion();
                }
              }}
              suffixIconButton={{
                icon: <i className="fas fa-plus"></i>,
                onClick: handleAddQuestion,
                className: `${questions.length >= 5 ? "bg-gray-400" : "bg-gray-700"} 
                  text-white w-8 h-8 flex items-center justify-center 
                  rounded-full whitespace-nowrap cursor-pointer`,
              }}
            />
          </div>

          <div className="space-y-7">
            {questions.map((q) => (
              <div key={q.id} className="bg-white border border-purple-200 shadow-sm rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm">{q.question}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded !rounded-button whitespace-nowrap cursor-pointer">
                      <i className="fas fa-minus"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex justify-end space-x-3 mt-8">
        <CustomButton onClick={handleSubmit} color="black" customClassName="px-6 py-2 text-lg font-semibold">
          <>{isEdit ? "저장" : "신청"}</>
        </CustomButton>
        <CustomButton onClick={onCancel} color="white" customClassName="px-6 py-2 text-lg font-semibold">
          <>취소</>
        </CustomButton>
      </div>
    </div>
  );
};

export default GatheringForm;
