import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router";
import PrivateRoute from "./common/component/PrivateRoute";
import Footer from "./dashboard/pages/Footer";
import Header from "./dashboard/pages/Header";
import MyPage from "./dashboard/pages/MyPage";
import MyPageBookReviewBoard from "./dashboard/pages/MyPageBookReviewBoard";
import AdminPageComment from "./dashboard/pages/AdminPageComment";
import "./index.css";

const AppContent = () => {
  const location = useLocation();

  return (
    <div>
      <div>
        <Header></Header>
        {/* <div className="flex justify-center bg-gray-100 min-h-screen">
       <div className="grid grid-areas-layout grid-cols-layout grid-rows-layout gap-x-4 relative max-w-[390px] w-full bg-white shadow-md selection:bg-green-900 font-[pretendard]"> */}
        {/* {location.pathname !== "/login" && <Header />} */}
        <main className={`grid-in-main ${location.pathname !== "/login" ? "my-3 px-[24px]" : ""}`}>
          <Routes>
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route element={<PrivateRoute />}>
              {/* <Route path="/" element={<HomePage />} /> */}
              {/* <Route path="" element={<Navigate to="/" />} /> */}
              <Route path="/boardList" element={<BoardList />} />
              <Route path="" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<AdminPageComment />} />
            </Route>
          </Routes>
        </main>
        {/* {location.pathname !== "/login" && <NavBar />} */}
        <Footer></Footer>
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
