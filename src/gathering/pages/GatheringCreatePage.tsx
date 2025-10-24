// GatheringCreatePage.tsx

//기본
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//컴포넌트 관련
import GatheringTextarea from "../component/GatheringTextarea";

//타입 api 요청관련
import { Books, GatheringCreateRequest, Question, SearchResult } from "../type/GatheringCreatePage.types";

import CustomButton from "../../common/component/CustomButton";
import CustomInput from "../../common/component/CustomInput";
import { createGathering, mockBooks, mockQuestions, mockSearchResults } from "../api/GatheringCreateRequest";

// ★ 국립중앙도서관 OpenAPI (프론트 하드코딩 - 개발용)
const NLK_API_BASE = "https://www.nl.go.kr/NL/search/openApi/search.do";
const NLK_API_KEY  = import.meta.env.ISBN_API_KEY;

// 목록 페이지 크기
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

// NLK image_url이 비정상이면 OpenLibrary 커버로 폴백
const normalizeCover = (raw?: string, isbn?: string) => {
  const s = (raw || "").trim().toLowerCase();
  const looksLikeImage = (u: string) =>
    u.startsWith("http") && (u.endsWith(".jpg") || u.endsWith(".jpeg") || u.endsWith(".png"));
  if (looksLikeImage(s)) return raw as string;
  if (isbn && isbn.length >= 10) return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  return PLACEHOLDER_COVER;
};

const GatheringCreatePage: React.FC = () => {
  const navigate = useNavigate();

  // 책 관련 상태
  const [books, setBooks] = useState<Books[]>(mockBooks);
  // 선택된 책 커버: ISBN -> URL
  const [bookCovers, setBookCovers] = useState<Record<string, string>>({});

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>(mockSearchResults);

  // 이미지 업로드 관련 상태
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [createData, setPostData] = useState({
    groupName: "", //  모임명
    location: "", //  지역
    meetingDetails: "", //  모임 소개
    recruitmentPersonnel: "", //  모집 인원
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 모집/활동 기간
  const [recruitmentPeriod, setRecruitmentPeriod] = useState(""); // 모집 시작 날짜 (문자열로 저장)
  const [activityPeriod, setActivityPeriod] = useState(""); // 활동 시작 날짜 (문자열로 저장)
  const [recruitmentDate, setRecruitmentDate] = useState<Date | null>(null); // DatePicker용 날짜 상태
  const [activityDate, setActivityDate] = useState<Date | null>(null); // DatePicker용 날짜 상태
  const [calendarModalTarget, setCalendarModalTarget] = useState<"recruitment" | "activity" | null>(null); // 현재 열린 달력 종류

  // 가입 질문 관련
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [newQuestion, setNewQuestion] = useState("");

  // 질문 추가 함수 (최대 5개)
  const handleAddQuestion = () => {
    if (newQuestion.trim() && questions.length < 5) {
      const newId = Math.max(...questions.map((q) => q.id), 0) + 1;
      setQuestions([...questions, { id: newId, question: newQuestion }]);
      setNewQuestion("");
    }
  };

  // 질문 삭제 함수
  const handleRemoveQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // 해시태그 관련
  const [hashtagInput, setHashtagInput] = useState(""); // 입력 중인 해시태그
  const [hashtags, setHashtags] = useState<string[]>([]); // 최종 추가된 해시태그 목록

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && hashtagInput.trim()) {
      e.preventDefault(); // 폼 제출 방지
      const newTag = hashtagInput.trim();
      if (!hashtags.includes(newTag)) setHashtags([...hashtags, newTag]);
      setHashtagInput("");
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    const gatheringData: GatheringCreateRequest = {
      ...createData,
      recruitmentPeriod,
      activityPeriod,
      books,
      questions,
      hashtags,
    };

    const formData = new FormData();
    const gatheringBlob = new Blob([JSON.stringify(gatheringData)], { type: "application/json" });

    formData.append("data", gatheringBlob);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await createGathering(formData); // 수정 필요
      alert("모임 신청이 완료되었습니다!");
      navigate("/gathering");
    } catch (error) {
      console.error("모임 신청 실패:", error);
      alert("모임 신청에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // ==========================
  // 국립중앙도서관 검색 (프론트 직접 호출, JSON만)
  // ==========================
  const [isSearching, setIsSearching] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(PAGE_SIZE_DEFAULT);
  const [total, setTotal] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const doSearch = useCallback(async (kwd: string, page = 1) => {
    if (!kwd.trim()) return;
    setIsSearching(true);
    setErrorMsg(null);

    try {
      const url =
        `${NLK_API_BASE}` +
        `?key=${encodeURIComponent(NLK_API_KEY)}` +
        `&apiType=json` +
        `&srchTarget=title` +
        `&kwd=${encodeURIComponent(kwd)}` +
        `&pageNum=${page}` +
        `&pageSize=${pageSize}`;

      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      const items: any[] =
        (Array.isArray(data?.result?.items) && data.result.items) ||
        (Array.isArray(data?.items) && data.items) ||
        (Array.isArray(data?.docs) && data.docs) ||
        (Array.isArray(data?.result) && data.result) ||
        (Array.isArray(data?.channel?.item) && data.channel.item) ||
        [];

      const mapped: SearchResult[] = items
        .map((it: any) => {
          const rawTitle = it.title_info || it.title || it.TITLE || it.titleInfo || "";
          const title = stripHtml(rawTitle);

          const rawIsbn = (it.isbn || it.ISBN || "").toString();
          const isbn = rawIsbn.replace(/[^0-9Xx]/g, "");

          const author = stripHtml(it.author_info || it.author || it.AUTHOR || "");
          const year = stripHtml(it.pub_year_info || it.pub_year || it.PUB_YEAR || "");
          const cover = normalizeCover(it.image_url || it.IMAGE_URL, isbn);

          return {
            id: isbn || it.id || it.control_no || crypto.randomUUID(),
            title,
            isbn,
            cover,
            _author: author,
            _year: year,
          } as any as SearchResult;
        })
        .filter((x) => x.title);

      setSearchResults(mapped);
      setTotal(parseInt(data?.result?.total || data?.total || `${mapped.length}`, 10) || mapped.length);
      setPageNum(page);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("도서 검색 중 오류가 발생했습니다. (CORS 또는 키/파라미터 문제일 수 있어요)");
      setSearchResults([]);
      setTotal(0);
    } finally {
      setIsSearching(false);
    }
  }, [pageSize]);

  const onSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim()) doSearch(searchQuery.trim(), 1);
    }
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

  // ★ 선택된 카드에서 X 버튼으로 책 지우고 즉시 다시 검색
  const handleRemoveBook = (isbn: string) => {
    setBooks((prev) => prev.filter((b) => b.isbn !== isbn));
    setBookCovers((prev) => {
      const { [isbn]: _, ...rest } = prev;
      return rest;
    });
    setIsSearchModalOpen(true); // 제거 후 즉시 검색 모달 열기
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-[1440px] min-h-[1024px] bg-white mx-auto">
        {/* 메인 컨텐츠 */}
        <div className="p-8 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-1">모임</h2>
          <p className="text-gray-600 mb-6">모임개설 신청</p>

          {/* 상단 섹션 */}
          <div className="w-full">
            {/* 선택된 책 카드 리스트 (폭/높이 확장 & 3줄 제목) */}
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
              {books.map((book) => (
                <div key={book.isbn} className="relative w-full h-[260px] bg-white rounded-xl shadow-md p-4">
                  {/* X 제거 버튼 */}
                  <button
                    aria-label="선택한 책 제거"
                    title="선택한 책 제거 후 다시 검색"
                    className="absolute -right-2 -top-2 z-10 w-7 h-7 rounded-full bg-white border shadow hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition"
                    onClick={() => handleRemoveBook(String(book.isbn))}
                  >
                    ×
                  </button>

                  <div className="flex gap-4 h-full">
                    <img
                      src={bookCovers[book.isbn] || PLACEHOLDER_COVER}
                      alt={book.name}
                      className="w-[88px] h-[118px] object-cover rounded border border-gray-200 flex-shrink-0"
                      onError={(e) => { e.currentTarget.src = PLACEHOLDER_COVER; }}
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
                        title={book.name}
                      >
                        {book.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 truncate" title={String(book.isbn)}>
                        ISBN: {book.isbn}
                      </div>
                      <div className="mt-auto flex justify-end">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded ${
                            book.complete_yn === "completed"
                              ? "bg-green-100 text-green-800"
                              : book.complete_yn === "in_progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {book.complete_yn === "completed" ? "완료" : book.complete_yn === "in_progress" ? "진행중" : "예정"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {books.length === 0 && (
                <button
                  onClick={() => setIsSearchModalOpen(true)}
                  className="w-full h-[260px] bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                >
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
                      onClick={() => searchQuery.trim() && doSearch(searchQuery.trim(), 1)}
                    >
                      검색
                    </button>
                  </div>

                  {/* 상태 바 */}
                  <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
                    <div>{total > 0 ? `검색 결과: ${total.toLocaleString()}건` : "검색어를 입력해 주세요"}</div>
                    {isSearching && <div className="animate-pulse">조회 중...</div>}
                  </div>

                  {/* 결과 리스트 */}
                  <div className="max-h-[460px] overflow-y-auto rounded-md border border-gray-200 divide-y">
                    {errorMsg && <div className="p-4 text-red-600">{errorMsg}</div>}

                    {!errorMsg && searchResults.length === 0 && !isSearching && (
                      <div className="p-6 text-center text-gray-400">검색 결과가 없습니다</div>
                    )}

                    {!errorMsg &&
                      searchResults.map((result: any, index) => {
                        const disabled = !result.isbn;
                        const cover = result.cover || PLACEHOLDER_COVER;
                        return (
                          <button
                            key={`${result.id}-${index}`}
                            className={`w-full text-left px-3 py-3 hover:bg-gray-50 ${disabled ? "opacity-60 cursor-not-allowed hover:bg-white" : ""}`}
                            onClick={() => {
                              if (disabled) { alert("이 자료는 ISBN이 없어 선택할 수 없습니다."); return; }
                              setBookCovers(prev => ({ ...prev, [result.isbn]: cover }));
                              setBooks([{
                                isbn: result.isbn,
                                name: result.title,
                                order: 0,
                                complete_yn: "planned",
                                startDate: new Date().toISOString().split("T")[0],
                              } as Books]);
                              setIsSearchModalOpen(false);
                            }}
                            disabled={disabled}
                            title={result.title}
                          >
                            <div className="flex gap-3 items-start">
                              <img
                                src={cover}
                                alt={result.title}
                                className="w-[64px] h-[84px] object-cover rounded border border-gray-200 flex-shrink-0"
                                onError={(e) => { e.currentTarget.src = PLACEHOLDER_COVER; }}
                              />
                              <div className="flex-1 pr-2 min-w-0">
                                <div
                                  className="font-medium leading-tight"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical" as any,
                                    overflow: "hidden",
                                  }}
                                >
                                  {result.title}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 truncate">
                                  ISBN: {result.isbn || "-"}
                                </div>
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

                  {/* 페이징 */}
                  {total > pageSize && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">페이지 {pageNum}</div>
                      <div className="space-x-2">
                        <button
                          className="px-3 py-1 rounded border text-sm disabled:opacity-40"
                          disabled={pageNum <= 1 || isSearching}
                          onClick={() => doSearch(searchQuery.trim(), pageNum - 1)}
                        >
                          이전
                        </button>
                        <button
                          className="px-3 py-1 rounded border text-sm disabled:opacity-40"
                          disabled={pageNum * pageSize >= total || isSearching}
                          onClick={() => doSearch(searchQuery.trim(), pageNum + 1)}
                        >
                          다음
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 기준 정보와 가입 질문 섹션 */}
            <div className="flex gap-8">
              {/* 기준 정보 섹션 */}
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-4">기준 정보</h3>
                <div className="mb-4">
                  <div className="relative">
                    <CustomInput
                      label="모임명"
                      name="groupName"
                      placeholder="모임명을 입력하세요"
                      value={createData.groupName}
                      onChange={onChangeHandler}
                      suffixButton={{
                        label: "중복 체크",
                        onClick: () => alert("중복체크 누름"),
                      }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <CustomInput
                      label="지역"
                      name="location"
                      placeholder="도시 지역을 입력하세요"
                      value={createData.location}
                      onChange={onChangeHandler}
                      suffixIconButton={{
                        icon: <i className="fas fa-search"></i>,
                        onClick: () => alert("도시지역 검색버튼 누름"),
                      }}
                    />
                  </div>
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
                  {/* 모집 인원 */}
                  <div className="flex-1">
                    <div className="relative">
                      <CustomInput
                        label="모집 인원"
                        name="recruitmentPersonnel"
                        placeholder="인원수를 입력하세요"
                        value={createData.recruitmentPersonnel}
                        onChange={onChangeHandler}
                      />
                    </div>
                  </div>

                  {/* 활동 기간 */}
                  <div className="flex-1">
                    <div className="relative">
                      <CustomInput
                        type="date"
                        label="활동 기간"
                        name="activityPeriod"
                        selected={activityDate}
                        onChange={(date) => {
                          setActivityDate(date);
                          if (date) {
                            setActivityPeriod(date.toLocaleDateString().split("T")[0]);
                          }
                        }}
                        placeholder="활동 기간을 선택하세요"
                      />
                    </div>
                  </div>

                  {/* 모집 기간 */}
                  <div className="flex-1">
                    <div className="relative">
                      <CustomInput
                        type="date"
                        label="모집 기간"
                        name="recruitmentPeriod"
                        selected={recruitmentDate}
                        onChange={(date) => {
                          setRecruitmentDate(date);
                          if (date) {
                            setRecruitmentPeriod(date.toLocaleDateString().split("T")[0]);
                          }
                        }}
                        placeholder="모집기간을 선택하세요"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-purple-700 mb-1">해시 태그</label>
                  <div className="w-full border border-purple-300 rounded p-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center bg-purple-100 text-purple-700 text-sm px-2 py-1 rounded-full"
                        >
                          #{tag}
                          <button
                            onClick={() => removeHashtag(tag)}
                            className="ml-1 text-purple-500 hover:text-purple-800"
                          >
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
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="image-upload"
                      className="px-4 py-2 rounded-lg text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer transition-all bg-gray-800 text-white hover:bg-gray-700"
                    >
                      대표 이미지 추가
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return; // null 또는 빈 파일 처리
                        const file = files[0];
                        setImageFile(file);
                      }}
                    />
                    {imageFile && (
                      <div className="text-sm text-gray-600">
                        선택된 파일: <span className="font-semibold">{imageFile.name}</span>
                      </div>
                    )}
                  </div>
                  {imageFile && (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="미리보기"
                      className="mt-2 max-w-xs rounded border"
                    />
                  )}
                </div>
              </div>

              {/* 세로 구분선 */}
              <div className="w-px bg-gray-300" />

              {/* 가입 질문 섹션 */}
              <div className="flex-1">
                <div>
                  <h3 className="text-lg font-bold mb-4">가입 질문</h3>
                  <div className="mb-4">
                    <div className="relative">
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
                  </div>
                  {/* 질문 목록 */}
                  <div className="space-y-7">
                    {questions.map((question) => (
                      <div key={question.id} className="bg-white border border-purple-200 shadow-sm rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm">{question.question}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRemoveQuestion(question.id)}
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
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex justify-end space-x-3 mt-8">
            <CustomButton onClick={handleSubmit} color="black" customClassName="px-6 py-2 text-lg font-semibold">
              <>신청</>
            </CustomButton>
            <CustomButton onClick={handleCancel} color="white" customClassName="px-6 py-2 text-lg font-semibold">
              <>취소</>
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GatheringCreatePage;
