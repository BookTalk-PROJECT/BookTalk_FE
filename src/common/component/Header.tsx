import { Link, useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import { useAuthStore } from "../../store";
import { fetchLogout } from "../auth/api/Auth";

const Header = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    await fetchLogout();
    localStorage.removeItem("accessToken");
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
            <Link to="/boardList" className="text-gray-700 hover:text-red-500">
              커뮤니티
            </Link>
            <Link to="/gathering" className="text-gray-700 hover:text-red-500">
              모임
            </Link>
            <Link to="/book-review" className="text-gray-700 hover:text-red-500">
              책리뷰
            </Link>
            <Link to="/mypage" className="text-gray-700 hover:text-red-500">
              관리자 페이지
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {localStorage.getItem("accessToken") ? (
            <CustomButton color="white" onClick={logoutHandler}>
              <i className="fas fa-key"> &nbsp;로그아웃</i>
            </CustomButton>
          ) : (
            <CustomButton color="white" onClick={() => navigate("/login")}>
              <i className="fas fa-key"> &nbsp;로그인</i>
            </CustomButton>
          )}
          {!localStorage.getItem("accessToken") ? (
            <CustomButton onClick={() => navigate("/join")} color="black">
              <>
                <i className="fas fa-right-to-bracket"> &nbsp;회원가입</i>
              </>
            </CustomButton>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
