import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import { JSX } from "react";

type AdminRouteProps = {
  children: JSX.Element;
};

function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, userInfo } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (userInfo?.authority !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return children;
}

export default AdminRoute;
