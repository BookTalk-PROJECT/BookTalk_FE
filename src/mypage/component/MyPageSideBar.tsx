// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { useAuthStore } from "../../store";
const MyPageSideBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeMenu, setActiveMenu] = useState("mypage");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const isAdmin = userInfo?.authority === "ADMIN";
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
    { id: "post-manage", icon: "fa-file-alt", label: "내 게시글", url: "/mypage/bookreview/board", indent: true },
    { id: "comment-manage", icon: "fa-comments", label: "내 댓글", url: "/mypage/bookreview/comment", indent: true },
    {
      id: "community",
      icon: "fa-users",
      label: "커뮤니티",
      url: "",
      isHeader: true,
    },
    { id: "community-post", icon: "fa-file-alt", label: "내 게시글", url: "/mypage/community/board", indent: true },
    {
      id: "community-comment",
      icon: "fa-comments",
      label: "내 댓글",
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
    { id: "recruitment-post", icon: "fa-file-alt", label: "내 게시글", url: "/mypage/gathering/board", indent: true },
    {
      id: "recruitment-comment",
      icon: "fa-comments",
      label: "내 댓글",
      url: "/mypage/gathering/comment",
      indent: true,
    },
    {
      id: "recruitment-approval",
      icon: "fa-check-circle",
      label: "모임 신청",
      url: "/mypage/gathering/manage/request",
      indent: true,
    },
    {
      id: "recruitment-approval-manage",
      icon: "fa-tasks",
      label: "신청 승인",
      url: "/mypage/gathering/manage/approval",
      indent: true,
    },
    {
      id: "admin",
      icon: "fa-user-shield",
      label: "관리자",
      url: "",
      isHeader: true,
      adminOnly: true,
    },
    { id: "admin-post", icon: "fa-file-alt", label: "게시글 관리", url: "/admin/board", indent: true, adminOnly: true },
    { id: "admin-comment", icon: "fa-comments", label: "댓글 관리", url: "/admin/comment", indent: true, adminOnly: true },
    { id: "admin-category", icon: "fa-folder", label: "카테고리 관리", url: "/admin/category", indent: true, adminOnly: true },
    { id: "admin-role.ts", icon: "fa-key", label: "권한 관리", url: "/admin/role", indent: true, adminOnly: true },
  ];

  const sidebarContent = (
    <div className={`flex flex-col h-full border-r border-gray-100 bg-white ${isExpanded ? "w-52" : "w-14"}`}>
      <div className={`${isExpanded ? "px-3" : "px-1"} py-3 relative`}>
        <button
          onClick={toggleSidebar}
          className={`w-full flex items-center justify-center ${isExpanded ? "p-2.5" : "p-2"} bg-white rounded-lg hover:bg-gray-50 text-gray-600 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap mx-auto`}>
          <i className={`fas ${isExpanded ? "fa-chevron-left" : "fa-chevron-right"} text-base`}></i>
          {isExpanded && <span className="ml-2 font-medium text-base">사이드바 접기</span>}
        </button>
      </div>
      <div className="flex-grow py-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.filter((item) => !item.adminOnly || isAdmin).map((item) => (
            <li key={item.id} className={isExpanded ? "px-3" : "px-1"}>
              {item.isHeader && item.id !== "mypage" ? (
                <div className={`flex items-center ${isExpanded ? "px-3 py-2 text-gray-800" : "hidden"}`}>
                  <i className={`fas ${item.icon} text-base ${isExpanded ? "mr-2.5" : ""} text-gray-600`}></i>
                  {isExpanded && <span className="font-bold text-base">{item.label}</span>}
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate(item.url);
                    setActiveMenu(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center ${!isExpanded ? "justify-center" : "justify-between"} ${
                    item.indent && isExpanded ? "pl-8" : ""
                  } ${isExpanded ? "px-3" : "px-2"} py-2 rounded-lg cursor-pointer transition-all duration-200 group whitespace-nowrap ${
                    location.pathname === item.url
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}>
                  <div className="flex items-center">
                    <i
                      className={`fas ${item.icon} text-lg ${isExpanded ? "mr-2.5" : ""} ${
                        location.pathname === item.url ? "" : "group-hover:text-emerald-600"
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
  );

  return (
    <>
      {/* Mobile toggle button (visible below md, below header) */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden fixed top-20 left-2 z-30 bg-white text-gray-600 p-2 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors">
          <i className="fas fa-bars text-base"></i>
        </button>
      )}

      {/* Mobile overlay (transparent, closes sidebar on tap) */}
      <div
        className={`md:hidden fixed inset-0 top-14 z-40 ${
          isMobileOpen ? "" : "pointer-events-none"
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Mobile sidebar (slide-in, below header) */}
      <div className={`
        md:hidden fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {sidebarContent}
      </div>

      {/* Desktop sidebar (sticky) */}
      <div className="hidden md:block sticky top-0 h-screen shrink-0 overflow-y-auto">
        {sidebarContent}
      </div>
    </>
  );
};
export default MyPageSideBar;
