/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-refresh/only-export-components */
// import api from "../api/axios.ts";
import { createContext, useContext, useState } from "react";
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return <AuthContext.Provider>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === "undefined") return console.log("dont!");
  return context;
}

export { useAuth, AuthProvider };
