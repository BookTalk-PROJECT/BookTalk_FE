import React, { useMemo } from "react";

type QAItem = { question: string; answer: any };

type RequestQAModalProps = {
  isOpen: boolean;
  gatheringName: string;
  qaJson: string; // JSON 문자열
  onClose: () => void;
};

const RequestQAModal: React.FC<RequestQAModalProps> = ({ isOpen, gatheringName, qaJson, onClose }) => {
  const qaList = useMemo<QAItem[]>(() => {
    try {
      const parsed = JSON.parse(qaJson ?? "[]");
      if (Array.isArray(parsed)) return parsed as QAItem[];
      return [];
    } catch {
      return [];
    }
  }, [qaJson]);

  const formatAnswer = (ans: any) => {
    if (ans === null || ans === undefined) return "-";
    if (typeof ans === "string") {
      // answer가 JSON 문자열로 들어올 수도 있어서 한 번 더 시도
      try {
        const j = JSON.parse(ans);
        return JSON.stringify(j, null, 2);
      } catch {
        return ans;
      }
    }
    return JSON.stringify(ans, null, 2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg w-[600px] max-w-[90vw] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            질문/답변 목록 <span className="text-gray-500 text-sm">({gatheringName})</span>
          </h2>
          <button onClick={onClose} className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100">
            닫기
          </button>
        </div>

        {qaList.length === 0 ? (
          <div className="text-sm text-gray-600">표시할 질문/답변이 없습니다.</div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-auto">
            {qaList.map((qa, idx) => (
              <div key={idx} className="border rounded-md p-4 bg-gray-50">
                <div className="font-medium text-gray-900 mb-2">Q. {qa.question ?? "-"}</div>
                <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                  A. {formatAnswer(qa.answer)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestQAModal;
