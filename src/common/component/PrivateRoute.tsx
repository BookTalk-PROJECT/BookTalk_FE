import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
  // const isAuthenticated = checkLogin(); // 인증 상태를 확인하는 함수

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return <Outlet />;
};

export default PrivateRoute;
