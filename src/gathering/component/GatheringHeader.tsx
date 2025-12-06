// src/features/gathering/components/GatheringHeader.tsx
import { useState, useEffect, useCallback } from "react";
import CustomButton from "../../common/component/CustomButton";
import { bookInfo as GatheringDetail, Books, GatheringDetailResponse } from "../type/GatheringHeader.types";
import {
  exampleBookInfo,
  examplebooks,
  fetchGatheringBooks,
  fetchGatheringInfo,
  deleteGathering, // ★ 추가: 삭제 API
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

  // ★ 삭제 모달 상태
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const reasonMax = 200;

  const openDeleteModal = () => {
    setDeleteReason("");
    setIsDeleteOpen(true);
  };
  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setIsDeleteOpen(false);
    setDeleteReason("");
  };

  const handleConfirmDelete = useCallback(async () => {
    if (!gatheringId) return;
    const reason = deleteReason.trim();
    if (!reason) {
      alert("삭제 사유를 입력하세요.");
      return;
    }
    try {
      setDeleteLoading(true);
      await deleteGathering(gatheringId, reason);
      alert("모임이 삭제되었습니다.");
      navigate("/gathering");
    } catch (err) {
      console.error("모임 삭제 실패:", err);
      alert("모임 삭제에 실패했습니다. 잠시 후 다시 시도하세요.");
    } finally {
      setDeleteLoading(false);
      setIsDeleteOpen(false);
    }
  }, [deleteReason, gatheringId, navigate]);

  // ESC 닫기, Ctrl/Cmd+Enter 확인
  useEffect(() => {
    if (!isDeleteOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDeleteModal();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
        e.preventDefault();
        if (!deleteLoading) handleConfirmDelete();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDeleteOpen, deleteLoading, handleConfirmDelete]);

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

  const statusMeta = STATUS_META[gatheringBookInfo?.status ?? 999] ?? {
    label: `상태(${gatheringBookInfo?.status ?? "-"})`,
    cls: "bg-slate-100 text-slate-700 border-slate-200",
  };

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
                title={`현재 상태: ${statusMeta.label}`}>
                {statusMeta.label}
              </span>
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
              <>
                <CustomButton onClick={() => navigate(`/gathering/${gatheringId}/edit`)} color="black">
                  <>
                    <i className="fas fa-edit mr-2"></i>모임 수정
                  </>
                </CustomButton>
                <CustomButton onClick={openDeleteModal} color="red">
                  <>
                    <i className="fas fa-trash mr-2"></i>모임 삭제
                  </>
                </CustomButton>
              </>
            ) : (
              <CustomButton onClick={() => navigate(`/gathering/${gatheringId}/join`)} color="black">
                <>
                  <i className="fas fa-user-plus mr-2"></i>가입하기
                </>
              </CustomButton>
            )}
          </div>
        </div>

        {/* 디테일 섹션: 제목 : 값  */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <DetailRow
            label="모집 인원"
            value={fmt(gatheringBookInfo?.recruitmentPersonnel)}
            icon="fas fa-user-friends"
          />
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
                className="w-9 h-9 text-base flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 hover:scale-110 transition-transform duration-200 shadow-sm hover:shadow-md">
                <i className="fas fa-chevron-left transition-transform duration-200"></i>
              </button>
              <button
                onClick={() => {
                  const container = document.querySelector(".books-container") as HTMLElement;
                  if (container) container.scrollLeft += container.offsetWidth;
                }}
                className="w-9 h-9 text-base flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 hover:scale-110 transition-transform duration-200 shadow-sm hover:shadow-md">
                <i className="fas fa-chevron-right transition-transform duration-200"></i>
              </button>
            </div>
          </div>
        </div>

        <div
          className="books-container overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}>
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
                        {book.status === 1 ? "완료" : "진행중"}
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

            {books.length === 0 && !loading && <div className="text-gray-500 text-sm px-2">등록된 책이 없습니다.</div>}
          </div>
        </div>
      </div>

      {/* ===== 삭제 미니 모달 ===== */}
      {isDeleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDeleteModal(); // 오버레이 클릭 닫기
          }}>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Modal */}
          <div className="relative w-full max-w-md mx-4 rounded-xl bg-white shadow-2xl border border-gray-200">
            <div className="px-5 py-4 border-b">
              <h3 className="text-lg font-bold">모임 삭제</h3>
              <p className="text-sm text-gray-500 mt-1">삭제 사유를 입력해 주세요. 이 작업은 되돌릴 수 없습니다.</p>
            </div>

            <div className="px-5 py-4">
              <label htmlFor="delete-reason" className="block text-sm font-medium text-gray-700 mb-1">
                삭제 사유
              </label>
              <textarea
                id="delete-reason"
                className="w-full min-h-[120px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="예) 활동 종료로 인해 모임을 닫습니다."
                value={deleteReason}
                maxLength={reasonMax}
                onChange={(e) => setDeleteReason(e.target.value)}
              />
              <div className="mt-1 text-right text-xs text-gray-400">
                {deleteReason.length}/{reasonMax}
              </div>
            </div>

            <div className="px-5 py-3 border-t flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                onClick={closeDeleteModal}
                disabled={deleteLoading}>
                취소
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm rounded-lg text-white ${deleteReason.trim() && !deleteLoading ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-not-allowed"}`}
                onClick={handleConfirmDelete}
                disabled={!deleteReason.trim() || deleteLoading}
                title={!deleteReason.trim() ? "삭제 사유를 입력하세요" : "Ctrl/⌘ + Enter로도 확인할 수 있어요"}>
                {deleteLoading ? "삭제 중..." : "삭제하기"}
              </button>
            </div>
          </div>
        </div>
      )}
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
