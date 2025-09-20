import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router";
import PrivateRoute from "./common/component/PrivateRoute";
import "./index.css";
import DashBoardPage from "./dashboard/pages/DashBoardPage";
import BoardList from "./community/board/pages/BoardList";
import Header from "./common/component/Header";
import Footer from "./common/component/Footer";
import GatheringListPage from "./gathering/pages/GatheringListPage";
import GatheringBoardDetailPage from "./gathering/pages/GatheringBoardDetailPage";
import GatheringCreateBoardPage from "./gathering/pages/GatheringCreateBoardPage";
import AdminCategory from "./admin/page/AdminCategory";
import JoinPage from "./common/auth/page/JoinPage";
import LoginPage from "./common/auth/page/LoginPage";
import MyPage from "./mypage/pages/MyPage";
import AdminPageComment from "./admin/page/AdminPageComment";
import MyPageBookReviewBoard from "./mypage/pages/MyPageBookReviewBoard";
import MyPageBookReviewComment from "./mypage/pages/MyPageBookReviewComment";
import MyPageCommunityBoard from "./mypage/pages/MyPageCommunityBoard";
import MyPageCommunityComment from "./mypage/pages/MyPageCommunityComment";
import MyPageGatheringComment from "./mypage/pages/MyPageGatheringComment";
import MyPageGatheringBoard from "./mypage/pages/MyPageGatheringBoard";
import MyPageGatheringRequestManage from "./mypage/pages/MyPageGatheringRequestManage";
import MyPageGatheringApprovalManage from "./mypage/pages/MyPageGatheringApprovalManage";
import AdminPageBoard from "./admin/page/AdminPageBoard";
import GatheringCreatePage from "./gathering/pages/GatheringCreatePage";
import MyPageMyGatherings from "./mypage/pages/MyPageMyGatherings";
import GatheringDetailPage from "./gathering/pages/GatheringDetailPage";
import BoardCreate from "./community/board/pages/BoardCreate";
import BoardDetail from "./community/board/pages/BoardDetail";
import EditBoard from "./community/board/pages/BoardEdit";
import BoardEdit from "./community/board/pages/BoardEdit";

const AppContent = () => {
  const location = useLocation();

  return (
    <div>
      <Header />
      <div>
        {/* <div className="flex justify-center bg-gray-100 min-h-screen">
        {/* <div className="flex justify-center bg-gray-100 min-h-screen">
       <div className="grid grid-areas-layout grid-cols-layout grid-rows-layout gap-x-4 relative max-w-[390px] w-full bg-white shadow-md selection:bg-green-900 font-[pretendard]"> */}
        {/* {location.pathname !== "/login" && <Header />} */}
        <main
          className={`grid-in-main ${location.pathname !== "/login" || !location.pathname.includes("/mypage") ? "my-3 px-[24px]" : ""}`}>
          <Routes>
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route element={<PrivateRoute />}>
              <Route path="" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashBoardPage />} />
              {/* Board */}
              <Route path="/boardList" element={<BoardList />} />
              <Route path="/boardCreate" element={<BoardCreate />} />
              <Route path="/boardEdit" element={< BoardEdit/>} />
              <Route path="/boardDetail/:postId" element={<BoardDetail />} />
              {/* Gathering */}
              <Route path="/gathering">
                {" "}
                {/* 모임 관련 */}
                <Route index element={<GatheringListPage />} /> {/* 이성종 모임 조회 */}
                <Route path="create" element={<GatheringCreatePage />} /> {/* 이성종 모임 상세 */}
                <Route path=":gatheringId" element={<GatheringDetailPage />} /> {/* 이성종 모임 상세 */}
                <Route path=":gatheringId/gatheringboard">
                  {" "}
                  {/* 모임 게시판 관련 */}
                  <Route path="create" element={<GatheringCreateBoardPage />} /> {/* 이성종 모임 게시판 글쓰기 */}
                  <Route path=":postId" element={<GatheringBoardDetailPage />} /> {/* 이성종 모임 게시판 상세 */}
                </Route>
              </Route>
              {/* Auth */}
              <Route path="/join" element={<JoinPage />} /> {/* 최형석 회원 가입 페이지 */}
              <Route path="/login" element={<LoginPage />} /> {/* 최형석 로그인 페이지 */}
              {/* MyPage */}
              <Route path="/mypage" element={<MyPage />} /> {/* 최형석 마이 페이지 */}
              <Route path="/mypage/bookreview/board" element={<MyPageBookReviewBoard />} />{" "}
              {/* 최형석 마이 페이지 북리뷰 게시판  */}
              <Route path="mypage/bookreview/comment" element={<MyPageBookReviewComment />} />{" "}
              {/* 최형석 마이 페이지 북리뷰 댓글  */}
              <Route path="/mypage/community/board" element={<MyPageCommunityBoard />} />{" "}
              {/* 최형석 마이 페이지 커뮤니티 게시판  */}
              <Route path="/mypage/community/comment" element={<MyPageCommunityComment />} /> {/* MyPage_Gathering */}
              <Route path="/mypage/gathering" element={<MyPageMyGatherings />} /> {/* 최형석 내 모임 */}
              <Route path="/mypage/gathering/board" element={<MyPageGatheringBoard />} /> {/* 최형석 모임 게시판  */}
              <Route path="/mypage/gathering/comment" element={<MyPageGatheringComment />} /> {/* 최형석 모임 댓글  */}
              <Route path="/mypage/gathering/manage/request" element={<MyPageGatheringRequestManage />} />
              {/* 최형석 모임 신청 관리  */}
              <Route path="/mypage/gathering/manage/approval" element={<MyPageGatheringApprovalManage />} />{" "}
              {/* 최형석 모임 승인 관리  */}
              {/* AdminPage */}
              <Route path="/admin/board" element={<AdminPageBoard />} /> {/* 최형석 관리자 게시물 관리 페이지 */}
              <Route path="/admin/comment" element={<AdminPageComment />} /> {/* 최형석 관리자 댓글 관리 페이지 */}
              <Route path="/admin/category" element={<AdminCategory />} /> {/* 최형석 관리자 카테고리 페이지 */}
            </Route>
          </Routes>
        </main>
        {/* {location.pathname !== "/login" && <NavBar />} */}
      </div>
      <Footer />
    </div>
  );
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);
