import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";

const Header = () => {
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
            <Link to="#" className="text-gray-700 hover:text-red-500">
              책리뷰
            </Link>
            <Link to="/mypage" className="text-gray-700 hover:text-red-500">
              관리자 페이지
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <CustomButton onClick={() => alert("로그인 클릭됨")} color="white">
            <>
              <i className="fas fa-key"> &nbsp;로그인</i>
            </>
          </CustomButton>
          <CustomButton onClick={() => alert("회원가입 클릭됨")} color="black">
            <>
              <i className="fas fa-right-to-bracket"> &nbsp;회원가입</i>
            </>
          </CustomButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
