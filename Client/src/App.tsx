/* eslint-disable react/react-in-jsx-scope */
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./Contexts/AuthContext.tsx";
import { lazy } from "react";
import Home from "./views/Home/Home.tsx";
import Welcoming from "./views/Welcome/Welcoming.tsx";
import Room from "./views/Room/RoomCard.tsx";

const Login = lazy(() => import("./views/Login/login.tsx"));
const Register = lazy(() => import("./views/Register/Register.tsx"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route index element={<Welcoming />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Room" element={<Room />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
