import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthError {
  message: string;
  type: "login" | "register" | "general";
}

interface AuthContextType {
  user: User;
  isLoggedIn: boolean;
  error: AuthError;
  isLoading: boolean;
  logout: () => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  login: (credentials: {
    identifier: string;
    password: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((err: any, type: AuthError["type"]) => {
    let message = "An unexpected error occurred";

    if (err.response) {
      message =
        err.response.data.message ||
        `${err.response.status}: ${err.response.statusText}`;
    } else if (err.request) {
      message = "Network error: Unable to connect to server";
    } else if (err.message) {
      message = err.message;
    }

    setError({
      message,
      type,
    });
  }, []);

  async function login(credentials: { identifier: string; password: string }) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/login", credentials);
      const { message, user } = response.data;

      console.log(message, " ! ");
      setUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
      handleError(error, "login");
    } finally {
      setIsLoading(false);
    }
  }

  async function register(userData: any) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/register", userData);
      const { message, user } = response.data;

      setUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Registration failed:", error);
      handleError(error, "register");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
      handleError(error, "general");
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }, [handleError]);

  const value: AuthContextType = {
    user,
    isLoggedIn,
    error,
    isLoading,
    login,
    register,
    logout,
    setError,
    setUser,
    setIsLoggedIn,
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
export type { AuthError, User };
