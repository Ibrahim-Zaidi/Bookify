import { useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router";

function ProtectedRoute() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isLoggedIn) navigate("/Home");
    },
    [isLoggedIn, navigate]
  );

  return isLoggedIn ? <div>this is a protectedRoute</div> : null;
}

export default ProtectedRoute;
