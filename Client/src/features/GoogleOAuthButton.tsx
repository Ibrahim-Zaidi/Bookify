import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import api from "../api/axios";
import { useAuth } from "../Contexts/AuthContext";

// import { jwtDecode } from "jwt-decode";

function GoogleOAuthButton() {
  const navigate = useNavigate();
  const { user, setUser, isLoggedIn, setIsLoggedIn }: any = useAuth();

  async function handleLoginSuccess(response: any) {
    try {
      console.log(response);

      const payload = response.credential;
      const sentResult = await api.post("/auth/google", { idToken: payload });

      console.log(sentResult.data);

      if (sentResult) {
        setIsLoggedIn(true);
        setUser(sentResult.data);
        navigate("/Home");
      } else throw new Error("Google authentication failed");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <GoogleLogin
      onSuccess={(res) => {
        handleLoginSuccess(res);
      }}
      onError={() => console.log("Login Failed")}
    />
  );
}

export default GoogleOAuthButton;
