import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { LoadingSpinner } from "./LoadingSpinner.jsx";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <LoadingSpinner size="lg" text="በመጫን ላይ..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
