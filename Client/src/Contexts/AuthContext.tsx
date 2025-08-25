/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import api from "../api/axios.ts";

const AuthContext = createContext(null);

function AuthProvider({ children }: any) {
  // const [isAuthanticated, setIsAuthenticated] = useState();

  async function handleRegister(user: object) {
    // console.log(user);

    try {
      const res = await api.post("/register", user);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleLogIn(user: object) {
    try {
      console.log(user);
      const res = await api.post("/login", user);
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ handleRegister, handleLogIn }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === "undefined") return console.log("dont!");
  return context;
}

export { useAuth, AuthProvider };
