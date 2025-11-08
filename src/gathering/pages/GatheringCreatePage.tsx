import React from "react";
import { useNavigate } from "react-router-dom";
import GatheringForm from "../component/GatheringForm";
import { createGathering } from "../api/GatheringCreateRequest";

const GatheringCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (fd: FormData) => {
    try {
      await createGathering(fd);
      alert("모임 신청이 완료되었습니다!");
      navigate("/gathering");
    } catch (error) {
      console.error("모임 신청 실패:", error);
      alert("모임 신청에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-[1440px] min-h-[1024px] bg-white mx-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-1">모임</h2>
          <p className="text-gray-600 mb-6">모임개설 신청</p>
          <GatheringForm mode="create" onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
        </div>
      </div>
    </div>
  );
};

export default GatheringCreatePage;
