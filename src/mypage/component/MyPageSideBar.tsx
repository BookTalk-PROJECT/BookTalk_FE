// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
const MyPageSideBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeMenu, setActiveMenu] = useState("mypage");
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  const location = useLocation();
  const menuItems = [
    {
      id: "mypage",
      icon: "fa-user",
      label: "My Page",
      url: "/mypage",
      isHeader: true,
    },
    {
      id: "bookreview",
      icon: "fa-clipboard",
      label: "북리뷰",
      url: "",
      isHeader: true,
    },
    { id: "post-manage", icon: "fa-file-alt", label: "게시글 관리", url: "/mypage/bookreview/board", indent: true },
    { id: "comment-manage", icon: "fa-comments", label: "댓글 관리", url: "/mypage/bookreview/comment", indent: true },
    {
      id: "community",
      icon: "fa-users",
      label: "커뮤니티",
      url: "",
      isHeader: true,
    },
    { id: "community-post", icon: "fa-file-alt", label: "게시글 관리", url: "/mypage/community/board", indent: true },
    {
      id: "community-comment",
      icon: "fa-comments",
      label: "댓글 관리",
      url: "/mypage/community/comment",
      indent: true,
    },
    {
      id: "gathering",
      icon: "fa-briefcase",
      label: "모임",
      url: "",
      isHeader: true,
    },
    { id: "my-recruitment", icon: "fa-user-friends", label: "내 모임", url: "/mypage/gathering", indent: true },
    { id: "recruitment-post", icon: "fa-file-alt", label: "게시글 관리", url: "/mypage/gathering/board", indent: true },
    {
      id: "recruitment-comment",
      icon: "fa-comments",
      label: "댓글 관리",
      url: "/mypage/gathering/comment",
      indent: true,
    },
    {
      id: "recruitment-approval",
      icon: "fa-check-circle",
      label: "모임 신청 관리",
      url: "/mypage/gathering/manage/request",
      indent: true,
    },
    {
      id: "recruitment-approval-manage",
      icon: "fa-tasks",
      label: "신청 승인 관리",
      url: "/mypage/gathering/manage/approval",
      indent: true,
    },
    {
      id: "admin",
      icon: "fa-user-shield",
      label: "관리자",
      url: "",
      isHeader: true,
    },
    { id: "admin-post", icon: "fa-file-alt", label: "게시글 관리", url: "/admin/board", indent: true },
    { id: "admin-comment", icon: "fa-comments", label: "댓글 관리", url: "/admin/comment", indent: true },
    { id: "admin-category", icon: "fa-folder", label: "카테고리 관리", url: "/admin/category", indent: true },
    { id: "admin-role.ts", icon: "fa-folder", label: "권한 관리", url: "/admin/role", indent: true },
  ];
  return (
    <div className="flex h-full overflow-y-scroll ">
      {/* Sidebar */}
      <div className={` flex flex-col border-r border-gray-100 ${isExpanded ? "w-96" : "w-16"}`}>
        <div className={`${isExpanded ? "px-6" : "px-2"} py-4`}>
          <button
            onClick={toggleSidebar}
            className={`w-full flex items-center justify-center ${isExpanded ? "p-4" : "p-3"} bg-white rounded-xl hover:bg-gray-50 text-gray-600 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md !rounded-button whitespace-nowrap mx-auto`}>
            <i className={`fas ${isExpanded ? "fa-chevron-left" : "fa-chevron-right"} text-lg`}></i>
            {isExpanded && <span className="ml-3 font-medium">사이드바 접기</span>}
          </button>
        </div>
        <div className="flex-grow py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id} className={isExpanded ? "px-6" : "px-2"}>
                {item.isHeader && item.id !== "mypage" ? (
                  <div className={`flex items-center ${isExpanded ? "px-6 py-3 text-gray-800" : "hidden"}`}>
                    <i className={`fas ${item.icon} text-lg ${isExpanded ? "mr-4" : ""} text-gray-600`}></i>
                    {isExpanded && <span className="font-bold text-base">{item.label}</span>}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      navigate(item.url);
                      setActiveMenu(item.id);
                    }}
                    className={`w-full flex items-center ${!isExpanded ? "justify-center" : "justify-between"} ${
                      item.indent && isExpanded ? "pl-12" : ""
                    } ${isExpanded ? "px-6" : "px-3"} py-2.5 rounded-xl cursor-pointer transition-all duration-200 group hover:shadow-md !rounded-button whitespace-nowrap ${
                      location.pathname === item.url
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}>
                    <div className="flex items-center">
                      <i
                        className={`fas ${item.icon} text-xl ${isExpanded ? "mr-4" : ""} ${
                          location.pathname === item.url ? "" : "group-hover:text-indigo-600"
                        }`}></i>
                      {isExpanded && (
                        <span
                          className={`${item.id === "mypage" && item.isHeader ? "font-bold text-base" : "font-medium text-base"} `}>
                          {item.label}
                        </span>
                      )}
                    </div>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default MyPageSideBar;
