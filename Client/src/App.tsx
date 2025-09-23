/* eslint-disable react/react-in-jsx-scope */
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./Contexts/AuthContext.tsx";

import { lazy } from "react";
import Home from "./features/Home/Home.tsx";
import Welcoming from "./features/Welcome/Welcoming.tsx";
import RoomPage from "./features/Room/RoomPage.tsx";
import ProtectedRoute from "./ui/ProtectedRoute.tsx";
import UserBookings from "./features/Bookings/userBookings.tsx";
import Error from "./ui/Error.tsx";

const Login = lazy(() => import("./features/Login/login.tsx"));
const Register = lazy(() => import("./features/Register/Register.tsx"));

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route index element={<Welcoming />} />
            <Route path="login" element={<Login />} />
            <Route path="Register" element={<Register />} />
            <Route path="Home" element={<Home />} />
            <Route path="room/:id" element={<RoomPage />} />
            <Route
              path="Bookings"
              element={
                <ProtectedRoute>
                  <UserBookings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
