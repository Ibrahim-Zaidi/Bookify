/* eslint-disable react/react-in-jsx-scope */
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./Contexts/AuthContext.tsx";
import { lazy } from "react";
import Home from "./views/Home.tsx";
import Welcoming from "./views/Welcoming.tsx";

const Login = lazy(() => import("./views/login.tsx"));
const Register = lazy(() => import("./views/Register.tsx"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route index element={<Welcoming />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />

          <Route path="/Home" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
