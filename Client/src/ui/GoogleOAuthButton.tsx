import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router";
import api from "../api/axios";
import { useAuth } from "../Contexts/AuthContext";

function GoogleOAuthButton() {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useAuth();

  async function handleLoginSuccess(response: CredentialResponse) {
    try {
      const payload = response.credential;
      const sentResult = await api.post("/auth/google", { idToken: payload });

      if (sentResult) {
        setUser(sentResult.data.user);
        setIsLoggedIn(true);
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
