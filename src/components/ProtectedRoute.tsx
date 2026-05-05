import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  requireProfile?: boolean;
}

export default function ProtectedRoute({
  children,
  requireProfile = false,
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-300">
        Loading your placement workspace...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireProfile && !user?.profileCompleted) {
    return <Navigate to="/profile/setup" replace />;
  }

  return children;
}
