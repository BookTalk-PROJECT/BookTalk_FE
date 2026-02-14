import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CustomButton from "./CustomButton";
import { useAuthStore } from "../../store";
import { fetchLogout } from "../auth/api/Auth";

const Header = () => {
  const { isAuthenticated, logout, userInfo } = useAuthStore();
  const isAdmin = userInfo?.authority === "ADMIN";
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/boardList") return location.pathname.startsWith("/board");
    return location.pathname.startsWith(path);
  };
  const logoutHandler = async () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-extrabold text-black-500 mr-6 tracking-tight">
            책톡
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link to="/boardList" className={`${isActive("/boardList") ? "text-emerald-700 font-medium border-b-2 border-emerald-600" : "text-gray-500"} hover:text-gray-900 pb-1 transition-colors`}>
              커뮤니티
            </Link>
            <Link to="/gathering" className={`${isActive("/gathering") ? "text-emerald-700 font-medium border-b-2 border-emerald-600" : "text-gray-500"} hover:text-gray-900 pb-1 transition-colors`}>
              모임
            </Link>
            <Link to="/book-review" className={`${isActive("/book-review") ? "text-emerald-700 font-medium border-b-2 border-emerald-600" : "text-gray-500"} hover:text-gray-900 pb-1 transition-colors`}>
              책리뷰
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* 마이페이지 / 관리자 아이콘 */}
          {isAuthenticated && (
            <>
              <Link
                to="/mypage"
                className={`p-2 transition-colors ${isActive("/mypage") ? "text-emerald-700" : "text-gray-500 hover:text-emerald-700"}`}
                title="마이페이지"
              >
                <i className="fas fa-user-circle text-lg"></i>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/board"
                  className={`p-2 transition-colors ${isActive("/admin") ? "text-emerald-700" : "text-gray-500 hover:text-emerald-700"}`}
                  title="관리자 페이지"
                >
                  <i className="fas fa-user-shield text-lg"></i>
                </Link>
              )}
            </>
          )}

          {isAuthenticated ? (
            <CustomButton color="white" onClick={logoutHandler}>
              <i className="fas fa-key"></i>
              <span className="hidden sm:inline"> &nbsp;로그아웃</span>
            </CustomButton>
          ) : (
            <CustomButton color="white" onClick={() => navigate("/login")}>
              <i className="fas fa-key"></i>
              <span className="hidden sm:inline"> &nbsp;로그인</span>
            </CustomButton>
          )}
          {!isAuthenticated ? (
            <CustomButton onClick={() => navigate("/join")} color="black">
              <>
                <i className="fas fa-right-to-bracket"></i>
                <span className="hidden sm:inline"> &nbsp;회원가입</span>
              </>
            </CustomButton>
          ) : (
            <div></div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900">
            <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"} text-lg`}></i>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t bg-white px-4 py-2 space-y-1">
          <Link to="/boardList" className={`block py-2 ${isActive("/boardList") ? "text-emerald-700 font-medium" : "text-gray-500"}`} onClick={() => setIsMobileMenuOpen(false)}>
            커뮤니티
          </Link>
          <Link to="/gathering" className={`block py-2 ${isActive("/gathering") ? "text-emerald-700 font-medium" : "text-gray-500"}`} onClick={() => setIsMobileMenuOpen(false)}>
            모임
          </Link>
          <Link to="/book-review" className={`block py-2 ${isActive("/book-review") ? "text-emerald-700 font-medium" : "text-gray-500"}`} onClick={() => setIsMobileMenuOpen(false)}>
            책리뷰
          </Link>
          {isAuthenticated && (
            <>
              <hr className="border-gray-200 my-1" />
              <Link to="/mypage" className={`block py-2 ${isActive("/mypage") ? "text-emerald-700 font-medium" : "text-gray-500"}`} onClick={() => setIsMobileMenuOpen(false)}>
                <i className="fas fa-user-circle mr-2"></i>마이페이지
              </Link>
              {isAdmin && (
                <Link to="/admin/board" className={`block py-2 ${isActive("/admin") ? "text-emerald-700 font-medium" : "text-gray-500"}`} onClick={() => setIsMobileMenuOpen(false)}>
                  <i className="fas fa-user-shield mr-2"></i>관리자 페이지
                </Link>
              )}
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
