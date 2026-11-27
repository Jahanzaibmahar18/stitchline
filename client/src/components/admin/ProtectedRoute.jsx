import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/admin/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[#765236]">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated || !["admin", "staff"].includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
