import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router";
import "./index.css";
import PrivateRoute from "./common/component/PrivateRoute";
import DashBoardPage from "./dashboard/pages/DashBoardPage";

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="grid grid-areas-layout grid-cols-layout grid-rows-layout gap-x-4 relative max-w-[390px] w-full bg-white shadow-md selection:bg-green-900 font-[pretendard]">
        {/* {location.pathname !== "/login" && <Header />} */}
        <main className={`grid-in-main ${location.pathname !== "/login" ? "my-3 px-[24px]" : ""}`}>
          <Routes>
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route element={<PrivateRoute />}>
              {/* <Route path="/" element={<HomePage />} /> */}
              <Route path="" element={<Navigate to="/dashboard"/>}/>
              <Route path="/dashboard" element={<DashBoardPage/>}/>
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