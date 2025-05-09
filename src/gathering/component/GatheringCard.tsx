import React from "react";
import { useNavigate } from "react-router-dom";
import { GatheringPost } from "../type/GatheringListPage.types";
import { GatheringStatus } from "../../common/type/Status";

interface GatheringCardProps {
    gathering: GatheringPost;
    lastRef?: React.Ref<HTMLDivElement>;
}

const GatheringCard: React.FC<GatheringCardProps> = ({ gathering, lastRef }) => {
    const navigate = useNavigate();

    return (
        <div
            key={gathering.id}
            onClick={() => navigate(`/gatheringlist/${gathering.id}`)}
            ref={lastRef || null}
            className="cursor-pointer bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="relative">
                <img src={gathering.imageUrl} alt="영상 썸네일" className="w-full h-48 object-cover object-top" />
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{gathering.title}</h3>
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <i className="fas fa-users text-red-500 mr-2"></i>
                            <span className="text-gray-700 font-medium">
                                {gathering.currentMembers}/{gathering.maxMembers}명
                            </span>
                        </div>
                        <span className="text-gray-500">조회수 {gathering.views}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {gathering.hashtags.map((tag: string, tagIndex: number) => (
                                <span
                                    key={tagIndex}
                                    className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs hover:bg-blue-200 transition">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap
                            ${gathering.status === GatheringStatus.intended
                                    ? "bg-green-100 text-green-600"
                                    : gathering.status === GatheringStatus.progress
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-gray-200 text-gray-600"}
                            `}>
                            {gathering.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GatheringCard;
