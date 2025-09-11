import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function login(credentials: { identifier: string; password: string }) {
    try {
      const response = await api.post("/login", credentials);
      const { message, user } = response.data;

      console.log(message, " ! ");
      setUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  const value = {
    user,
    isLoggedIn,
    login,
    setIsLoggedIn,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
