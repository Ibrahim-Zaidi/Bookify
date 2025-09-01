import { useEffect } from "react";
import api from "../api/axios";

const GoogleOAuthButton = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id:
          "243806731921-pni20de9b5v3qdndjr2neaprrek9lh8c.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline",
          size: "medium",
        }
      );
    };
  }, []);

  async function handleCredentialResponse(response: any) {
    console.log(response);
    const { credential } = response;

    try {
      const res = await api.post("/auth/google", { token: credential });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <div id="google-signin-button"></div>
    </div>
  );
};

export default GoogleOAuthButton;
