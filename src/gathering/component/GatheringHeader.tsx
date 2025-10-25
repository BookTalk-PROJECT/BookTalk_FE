// src/features/gathering/components/GatheringHeader.tsx
import { useState, useEffect } from "react";
import CustomButton from "../../common/component/CustomButton";
import { bookInfo as GatheringDetail, Books, GatheringDetailResponse } from "../type/GatheringHeader.types";
import {
  exampleBookInfo,
  examplebooks,
  fetchGatheringBooks,
  fetchGatheringInfo,
} from "../api/GatheringHeaderRequest";
import { useNavigate } from "react-router";

interface GatheringId {
  gatheringId: string;
}

const STATUS_META: Record<number, { label: string; cls: string }> = {
  0: { label: "모집중", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  1: { label: "진행중", cls: "bg-blue-100 text-blue-800 border-blue-200" },
  2: { label: "완료", cls: "bg-gray-200 text-gray-700 border-gray-300" },
};

const fmt = (v?: string | number | null) => {
  if (v === null || v === undefined) return "-";
  if (typeof v === "string") return v.trim() === "" ? "-" : v;
  return String(v);
};

const GatheringHeader: React.FC<GatheringId> = ({ gatheringId }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Books[]>([]);
  const [gatheringBookInfo, setGatheringBookInfo] = useState<GatheringDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGatheringData = async () => {
    if (!gatheringId) {
      console.error("gatheringId가 유효하지 않습니다:", gatheringId);
      return;
    }
    try {
      setLoading(true);
      const [booksData, infoData] = await Promise.all([
        fetchGatheringBooks(gatheringId),
        fetchGatheringInfo(gatheringId),
      ]);
      setBooks(booksData);
      setGatheringBookInfo(infoData);
    } catch (error) {
      console.error("모임 데이터 로드 실패! 더미 사용:", error);
      setBooks(examplebooks);
      setGatheringBookInfo(exampleBookInfo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGatheringData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatheringId]);

  const statusMeta =
    STATUS_META[gatheringBookInfo?.status ?? 999] ??
    { label: `상태(${gatheringBookInfo?.status ?? "-"})`, cls: "bg-slate-100 text-slate-700 border-slate-200" };

  return (
    <div className="space-y-8">
      {/* ===== 상단 헤더 카드 ===== */}
      <div className="p-7 border-b bg-white">
        {/* 타이틀 + 액션 */}
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-extrabold tracking-tight">
                {gatheringBookInfo?.name ?? (loading ? "로딩 중..." : "모임명 없음")}
              </h1>

              {/* 상태 배지 */}
              <span
                className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm font-semibold ${statusMeta.cls}`}
                title={`현재 상태: ${statusMeta.label}`}
              >
                {statusMeta.label}
              </span>

              {/* 코드 칩 */}
              {/* {gatheringBookInfo && (
                <span className="inline-flex items-center rounded-md bg-gray-100 border border-gray-200 px-3 py-1.5 text-xs font-mono text-gray-800">
                  {gatheringBookInfo.gatheringCode}
                </span>
              )} */}
            </div>

            {/* 요약문 */}
            {!!gatheringBookInfo?.summary && (
              <p className="text-base text-gray-700 max-w-3xl leading-relaxed">
                모임 소개 : {gatheringBookInfo.summary}
              </p>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="flex shrink-0 items-center gap-2">
            <CustomButton onClick={() => alert("공유하기 클릭됨")} color="white">
              <>
                <i className="fas fa-share-alt mr-2"></i>공유하기
              </>
            </CustomButton>
              {/* masterYn === 1 → 모임 수정 / 그 외 → 가입하기 */}
              {gatheringBookInfo?.masterYn === 1 ? (
                <CustomButton
                  onClick={() => navigate(`/gathering/${gatheringId}/edit`)} // 임시 URL
                  color="black"
                >
                  <>
                    <i className="fas fa-edit mr-2"></i>모임 수정
                  </>
                </CustomButton>
              ) : (
                <CustomButton
                  onClick={() => navigate(`/gathering/${gatheringId}/join`)}
                  color="black"
                >
                  <>
                    <i className="fas fa-user-plus mr-2"></i>가입하기
                  </>
                </CustomButton>
              )}
          </div>
        </div>

        {/* 디테일 섹션: 제목 : 값  */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <DetailRow label="모집 인원" value={fmt(gatheringBookInfo?.recruitmentPersonnel)} icon="fas fa-user-friends" />
          <DetailRow label="모집 기간" value={fmt(gatheringBookInfo?.recruitmentPeriod)} icon="far fa-calendar-check" />
          <DetailRow label="활동 기간" value={fmt(gatheringBookInfo?.activityPeriod)} icon="far fa-calendar-alt" />
          <DetailRow label="행정구역(시군구)" value={fmt(gatheringBookInfo?.sigCd)} icon="fas fa-map-marker-alt" />
          <DetailRow label="행정구역(읍면동)" value={fmt(gatheringBookInfo?.emdCd)} icon="fas fa-map-pin" />
          {gatheringBookInfo?.delYn && (
            <DetailRow
              label="삭제 상태"
              value={gatheringBookInfo?.delReason ? `삭제됨 - ${gatheringBookInfo.delReason}` : "삭제됨"}
              icon="fas fa-exclamation-triangle"
              valueClass="text-red-600"
            />
          )}

          {/* 로딩 스켈레톤 */}
          {loading && (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          )}
        </div>
      </div>

      {/* ===== 독서 목록 ===== */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">독서 목록</h2>
          <div className="flex space-x-2">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const container = document.querySelector(".books-container") as HTMLElement;
                  if (container) container.scrollLeft -= container.offsetWidth;
                }}
                className="w-9 h-9 text-base flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 hover:scale-110 transition-transform duration-200 shadow-sm hover:shadow-md"
              >
                <i className="fas fa-chevron-left transition-transform duration-200"></i>
              </button>
              <button
                onClick={() => {
                  const container = document.querySelector(".books-container") as HTMLElement;
                  if (container) container.scrollLeft += container.offsetWidth;
                }}
                className="w-9 h-9 text-base flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 hover:scale-110 transition-transform duration-200 shadow-sm hover:shadow-md"
              >
                <i className="fas fa-chevron-right transition-transform duration-200"></i>
              </button>
            </div>
          </div>
        </div>

        <div
          className="books-container overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}
        >
          <div className="inline-flex gap-6 min-w-max pb-4">
            {books.map((book, index) => (
              <div key={`${book.id}-${index}`} className="w-[320px] cursor-pointer group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={`https://readdy.ai/api/search-image?query=modern%20minimalist%20book%20cover%20design%20with%20abstract%20geometric%20patterns%20and%20sophisticated%20typography%20on%20clean%20background%20professional%20publishing%20quality&width=400&height=400&seq=${book.id}&orientation=squarish`}
                      alt={book.title}
                      className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-base text-gray-900 line-clamp-2">{book.title}</h3>
                      <span
                        className={`px-2.5 py-1 text-xs rounded ${
                          book.status === 1 ? "bg-blue-500 text-white" : "bg-yellow-500 text-white"
                        }`}
                      >
                        {book.status === 1 ? "다 읽음" : "진행중"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="ml-auto flex items-center">
                        <i className="far fa-calendar-alt mr-1"></i>
                        {book.startDate} ~{book.endDate ? ` ${book.endDate}` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {books.length === 0 && !loading && (
              <div className="text-gray-500 text-sm px-2">등록된 책이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- 재사용 가능한 행 컴포넌트: "제목 : 값" 레이아웃 ---------- */
function DetailRow({
  label,
  value,
  icon,
  valueClass,
}: {
  label: string;
  value: string | number;
  icon?: string;
  valueClass?: string;
}) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white/60 px-4 py-3">
      <div className="flex items-baseline gap-2">
        {/* 라벨(제목) */}
        <div className="shrink-0 flex items-center gap-2">
          {icon && <i className={`${icon} text-gray-500 text-base`} />}
          <span className="text-gray-700 font-semibold text-[15px]">{label}</span>
        </div>

        {/* 콜론 */}
        <span className="text-gray-400 font-semibold text-[15px]">:</span>

        {/* 값 */}
        <div className={`min-w-0 text-gray-900 font-semibold text-lg leading-snug ${valueClass ?? ""}`}>
          <span className="truncate block">{value}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- 로딩 스켈레톤 ---------- */
function SkeletonRow() {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white/60 px-4 py-3">
      <div className="flex items-baseline gap-2">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        <span className="text-gray-300">:</span>
        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default GatheringHeader;
