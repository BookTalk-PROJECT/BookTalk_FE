import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GatheringForm, { GatheringFormInitial } from "../component/GatheringForm";
import { getGatheringDetail, updateGathering } from "../api/GatheringEditRequest";
import { GatheringDetailResponse } from "../type/GatheringEditPage.types";

const mapDetailToInitial = (d: GatheringDetailResponse): GatheringFormInitial => {
  return {
    groupName: d.name,
    location: (d as any).location ?? d.sigCd ?? d.emdCd ?? "",
    meetingDetails: d.summary,
    recruitmentPersonnel: String(d.recruitmentPersonnel ?? ""),
    recruitmentPeriod: d.recruitmentPeriod,
    activityPeriod: d.activityPeriod,
    status: d.status,
    imageUrl: d.imageUrl ?? null,
    books: (d.books || []).map((b) => ({
      isbn: b.isbn,
      name: b.name,
      order: Number(b.order ?? 0),
      complete_yn: typeof b.completeYn === "boolean" ? (b.completeYn ? 1 : 0) : Number(b.completeYn ?? 0),
      startDate: b.startDate ?? "",
    })),
    questions: (d.questions || []).map((q) => ({ id: q.id, question: q.question })),
    hashtags: d.hashtags || [],
  };
};

const GatheringEditPage: React.FC = () => {
  const { gatheringId } = useParams<{ gatheringId: string }>();
  const navigate = useNavigate();

  const [initial, setInitial] = useState<GatheringFormInitial | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!gatheringId) return;
      setLoading(true);
      setLoadError(null);
      try {
        const detail = await getGatheringDetail(gatheringId);
        if (!ignore) setInitial(mapDetailToInitial(detail));
      } catch (e) {
        console.error(e);
        if (!ignore) setLoadError("모임 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [gatheringId]);

  const handleSubmit = async (fd: FormData) => {
    if (!gatheringId) return;
    try {
      await updateGathering(gatheringId, fd);
      alert("모임 정보가 수정되었습니다.");
      navigate(`/gathering/${gatheringId}`);
    } catch (e) {
      console.error(e);
      alert("모임 정보 수정에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-[1440px] min-h-[1024px] bg-white mx-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-1">모임</h2>
          <p className="text-gray-600 mb-6">모임 수정</p>

          {loading ? (
            <div className="py-24 text-center text-gray-500">불러오는 중...</div>
          ) : loadError ? (
            <div className="py-24 text-center text-red-500">{loadError}</div>
          ) : initial ? (
            <GatheringForm mode="edit" initial={initial} onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GatheringEditPage;
