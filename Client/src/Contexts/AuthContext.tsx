/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-refresh/only-export-components */
// import api from "../api/axios.ts";
import { createContext, useContext, useState } from "react";
// import { useNavigate } from "react-router";

const AuthContext = createContext(null);

function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // const navigate = useNavigate();

  const value = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === "undefined") return console.log("dont!");
  return context;
}

export { useAuth, AuthProvider };
