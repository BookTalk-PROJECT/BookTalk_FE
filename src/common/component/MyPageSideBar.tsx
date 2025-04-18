const MyPageSideBar = () => {
  return (
    <aside className="w-60 bg-blue-600 text-white flex flex-col p-6 space-y-8 sticky top-0 self-start h-screen">
      <div className="text-2xl font-bold text-center">My Page</div>
      <div>
        <h3 className="text-lg font-semibold mb-2">북리뷰</h3>
        <ul className="space-y-2">
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">게시글 관리</li>
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">댓글 관리</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">커뮤니티</h3>
        <ul className="space-y-2">
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">게시글 관리</li>
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">댓글 관리</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">모임</h3>
        <ul className="space-y-2">
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">내 모임</li>
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">게시글 관리</li>
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">댓글 관리</li>
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">모임 신청 관리</li>
          <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">신청 승인 관리</li>
        </ul>
      </div>
    </aside>
  );
};

export default MyPageSideBar;
