import { Link } from "react-router-dom";
import { Route } from "react-router";

const MyPageSideBar = () => {
  return (
    <div className="fixed top-6 left-0 w-60 h-full bg-blue-600 text-white p-6 space-y-8">
      <aside className="w-60 text-white flex flex-col p-6  sticky top-0 self-start h-screen">
        <div className="text-2xl font-bold text-center pb-9">My Page</div>
        <div className="pb-4">
          <h3 className="text-lg font-semibold mb-2">북리뷰</h3>
          <ul className="space-y-2">
            <Link to="/mypage/bookreview/board">
              <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">게시글 관리</li>
            </Link>
            <Link to="/mypage/bookreview/comment">
              <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">댓글 관리</li>
            </Link>
          </ul>
        </div>
        <div className="pb-4">
          <h3 className="text-lg font-semibold mb-2">커뮤니티</h3>
          <ul className="space-y-2">
            <Link to="/mypage/community/board">
              <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">게시글 관리</li>
            </Link>
            <Link to="/mypage/community/comment">
              <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">댓글 관리</li>
            </Link>
          </ul>
        </div>
        <div className="pb-4">
          <h3 className="text-lg font-semibold mb-2">모임</h3>
          <ul className="space-y-2">
            <Link to="/mypage/gathering">
            <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">내 모임</li>
            </Link>
            <Link to="/mypage/gathering/board">
              <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">게시글 관리</li>
            </Link>
            <Link to="/mypage/gathering/comment">
              <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">댓글 관리</li>
            </Link>
            <Link to="/mypage/gathering/manage/request">
              <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">모임 신청 관리</li>
            </Link>
            <Link to="/mypage/gathering/manage/approval">
              <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">신청 승인 관리</li>
            </Link>
          </ul>
        </div>
        <div className="pb-4">
          <h3 className="text-lg font-semibold mb-2">관리자</h3>
          <ul className="space-y-2">
            <Link to="/admin/board">
              <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">게시글 관리</li>
            </Link>
            <Link to="/admin/comment">
              <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">댓글 관리</li>
            </Link>
            <Link to="/admin/category">
              <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">카테고리 관리</li>
            </Link>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default MyPageSideBar;
