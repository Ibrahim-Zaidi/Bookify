import React, { useEffect } from "react";

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

  const handleCredentialResponse = (response: any) => {
    console.log("Credential Response: ", response);
  };

  return (
    <div>
      <div id="google-signin-button"></div>
    </div>
  );
};

export default GoogleOAuthButton;
