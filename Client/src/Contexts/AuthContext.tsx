import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

type User = {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  number?: string;
};

type AuthError = {
  message: string;
  type: "login" | "register" | "general"; // because generally the error cant get outside of these three types
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  error: AuthError | null;
  isLoading: boolean;
  register: (userData: User) => Promise<void>;
  login: (credentials: {
    identifier: string;
    password: string;
  }) => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: AuthError | null) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get("/auth/user_information");
        const user = response.data;
        setUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
        handleError(error, "general");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  function handleError(err: any, type: AuthError["type"]) {
    let message = "An unexpected error occurred";

    if (err.response) {
      message =
        err.response.data.message ||
        `${err.response.status}: ${err.response.message}`;
    } else if (err.request) {
      message = "Network error: Unable to connect to server";
    } else if (err.message) {
      message = err.message;
    }

    setError({
      message,
      type,
    });
  }

  async function login(credentials: { identifier: string; password: string }) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/public/login", credentials);
      const { user } = response.data;
      setUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
      handleError(error, "login");
    } finally {
      setIsLoading(false);
    }
  }

  async function register(userData: User) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("public/register", userData);
      const { user } = response.data;

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

  async function logout() {
    setIsLoading(true);
    setError(null);

    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
      handleError(error, "general");
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }

  const value: AuthContextType = {
    user,
    isLoggedIn,
    error,
    setError,
    isLoading,
    login,
    register,
    logout,
    setUser,
    setIsLoggedIn,
    setIsLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
export type { AuthError, User };
