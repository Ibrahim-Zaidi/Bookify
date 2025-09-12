import { useAuth } from "../Contexts/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
