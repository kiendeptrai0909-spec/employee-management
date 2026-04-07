import { Navigate } from "react-router-dom";
import { getCurrentUser, type RoleName } from "../../utils/authStorage";

interface ProtectedRouteProps {
  allowRole?: RoleName;
  children: JSX.Element;
}

export default function ProtectedRoute({ allowRole, children }: ProtectedRouteProps) {
  const user = getCurrentUser();

  if (!user) return <Navigate to="/" replace />;
  if (allowRole && user.role !== allowRole) return <Navigate to="/" replace />;

  return children;
}
