import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import api from "../api/axios";
// import { jwtDecode } from "jwt-decode";

function GoogleOAuthButton() {
  const navigate = useNavigate();

  async function handleLoginSuccess(response: any) {
    try {
      console.log(response);

      const payload = response.credential;

      console.log(payload);
      const sentResult = await api.post("/auth/google", { idToken: payload });
      console.log(sentResult.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <GoogleLogin
      onSuccess={(res) => {
        handleLoginSuccess(res);
        // navigate("/Home");
      }}
      onError={() => console.log("Login Failed")}
    />
  );
}

export default GoogleOAuthButton;
