import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-extrabold text-black-500 mr-6 tracking-tight">
            책톡
          </Link>
          <nav className="hidden md:flex space-x-4">
            <a href="#" className="text-gray-700 hover:text-red-500">
              커뮤니티
            </a>
            <a href="#" className="text-gray-700 hover:text-red-500">
              모임
            </a>
            <a href="#" className="text-gray-700 hover:text-red-500">
              책리뷰
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-gray-50 hover:bg-gray-200 px-4 py-1.5 rounded-full text-sm text-gray-700 shadow-sm transition-all">
            로그인
          </button>
          <button className="bg-black text-white hover:bg-gray-800 px-4 py-1.5 rounded-full text-sm shadow-sm transition-all">
            회원가입
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
