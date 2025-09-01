import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

function GoogleOAuthButton() {
  const navigate = useNavigate();

  
  async function handleLoginSuccess(response: any) {
    try {
      console.log(response);

      // const userObject: any = (response.credential);

      
      const sentResult = await api.post('/auth/google', )


    }catch() {

    }

  }


  

  return (
    <GoogleLogin

    onSuccess={(res) => handleLoginSuccess(res)}

      // onSuccess={(res: any) => {
      //   console.log(jwtDecode(res.credential));
      //   navigate("/Home");
      // }}
      onError={() => console.log("Login Failed")}
    />
  );
}

export default GoogleOAuthButton;
