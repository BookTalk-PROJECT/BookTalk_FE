import "./index.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router";
import PrivateRoute from "./common/component/PrivateRoute";
import DashBoardPage from "./dashboard/pages/DashBoardPage";
import GatheringListPage from "./gathering/pages/GatheringListPage";
import GatheringDetailPage from "./gathering/pages/GatheringDetailPage";
import GatheringBoardDetailPage from "./gathering/pages/GatheringBoardDetailPage";

const AppContent = () => {
  const location = useLocation();

  return (
    <div>
      <div>
        {/* <div className="flex justify-center bg-gray-100 min-h-screen">
       <div className="grid grid-areas-layout grid-cols-layout grid-rows-layout gap-x-4 relative max-w-[390px] w-full bg-white shadow-md selection:bg-green-900 font-[pretendard]"> */}
        {/* {location.pathname !== "/login" && <Header />} */}
        <main className={`grid-in-main ${location.pathname !== "/login" ? "my-3 px-[24px]" : ""}`}>
          <Routes>
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route element={<PrivateRoute />}>
              {/* <Route path="/" element={<HomePage />} /> */}
              <Route path="" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashBoardPage />} />
              <Route path="/gatheringlist" element={<GatheringListPage />} /> {/* 이성종 모임 조회 */}
              <Route path="/gatheringlist/:id" element={<GatheringDetailPage />} /> {/* 이성종 모임 상세 */}
              <Route path="/gatheringlist/:id/gatheringboard/:postId" element={<GatheringBoardDetailPage />} /> {/* 이성종 모임 게시판판 상세 */}
            </Route>
          </Routes>
        </main>
        {/* {location.pathname !== "/login" && <NavBar />} */}
      </div>
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
