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
import GatheringDetailPage from "./gathering/pages/GatheringDetailPage";
import GatheringBoardDetailPage from "./gathering/pages/GatheringBoardDetailPage";
import GatheringCreateBoardPage from "./gathering/pages/GatheringCreateBoardPage";
import AdminCategory from "./admin/page/AdminCategory";
import JoinPage from "./common/auth/page/JoinPage";
import LoginPage from "./common/auth/page/LoginPage";
import MyPage from "./mypage/MyPage";
import AdminPageComment from "./admin/page/AdminPageComment";
import MyPageBookReviewBoard from "./mypage/MyPageBookReviewBoard";
import GatheringCreatePage from "./gathering/pages/GatheringCreatePage";

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
        <main className={`grid-in-main ${location.pathname !== "/login" ? "my-3 px-[24px]" : ""}`}>
          <Routes>
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route element={<PrivateRoute />}>
              <Route path="" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashBoardPage />} />

              {/* Board */}
              <Route path="/boardList" element={<BoardList />} />

              {/* Gathering */}
              <Route path="/gatheringlist"> {/* 모임 관련 */}
                <Route index element={<GatheringListPage />} /> {/* 이성종 모임 조회 */}
                <Route path="create" element={<GatheringCreatePage />} /> {/* 이성종 모임 상세 */}
                <Route path=":id" element={<GatheringDetailPage />} /> {/* 이성종 모임 상세 */}
                <Route path=":id/gatheringboard"> {/* 모임 게시판 관련 */}
                  <Route path="create" element={<GatheringCreateBoardPage />} /> {/* 이성종 모임 게시판 상세 */}
                  <Route path=":postId" element={<GatheringBoardDetailPage />} /> {/* 이성종 모임 게시판 글쓰기 */}
                </Route>
              </Route>
              {/* Auth */}
              <Route path="/join" element={<JoinPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* MyPage */}
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/mypagebookreviewboard" element={<MyPageBookReviewBoard />} />

              {/* AdminPage */}
              <Route path="/admincategory" element={<AdminCategory />} />
              <Route path="/adminpagecomment" element={<AdminPageComment />} />
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
