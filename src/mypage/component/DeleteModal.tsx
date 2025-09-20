import { useEffect, useState } from "react";
type DeleteModalProps = {
    onDelete: (code: string, deleteReason: string) => void;
    isDeleteModalOpen: boolean;
    selectedCode: string;
    closeDeleteModal: () => void;
}
const DeleteModal = ({onDelete, isDeleteModalOpen, selectedCode, closeDeleteModal}: DeleteModalProps) => {
      const [deleteReason, setDeleteReason] = useState("");

      useEffect(() => {
        setDeleteReason("");
      }, [isDeleteModalOpen])
    
      const confirmDelete = async () => {
        if (!selectedCode) return;
        if (onDelete) await onDelete(selectedCode, deleteReason);
        // TODO: 실제 삭제 API 호출 등 처리
        closeDeleteModal();
      };

      return (
        <>
        {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg w-96 p-6">
                <h2 className="text-lg font-semibold mb-4">삭제 사유 입력</h2>
                <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="삭제 사유를 입력하세요"
                className="w-full border border-gray-300 rounded-md p-2 mb-4 h-24 resize-none"
                />
                <div className="flex justify-end space-x-2">
                <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                    취소
                </button>
                <button
                    onClick={confirmDelete}
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    disabled={deleteReason.trim() === ""}
                >
                    삭제
                </button>
                </div>
            </div>
            </div>
        )}
        </>
      )
}

export default DeleteModal;