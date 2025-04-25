import { Link } from "react-router-dom";

const MyPageSideBar = () => {
  return (
    <aside className="w-60 bg-blue-600 text-white flex flex-col p-6  sticky top-0 self-start h-screen">
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
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">내 모임</li>
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">게시글 관리</li>
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">댓글 관리</li>
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">모임 신청 관리</li>
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">신청 승인 관리</li>
        </ul>
      </div>
      <div className="pb-4">
        <h3 className="text-lg font-semibold mb-2">관리자</h3>
        <ul className="space-y-2">
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">게시글 관리</li>
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">댓글 관리</li>
          <Link to="/admin/category">
            <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">카테고리 관리</li>
          </Link>
        </ul>
      </div>
    </aside>
  );
};

export default MyPageSideBar;
