import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth.js";

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading, isAuthenticated, isAdmin } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
