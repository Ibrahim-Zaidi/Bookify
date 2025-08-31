import React, { useState } from "react";
// import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router";
import styles from "./login.module.css";
import api from "../api/axios.ts";

const Login = () => {
  // const { handleLogIn } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  // async function handleLogIn(user: object) {
  //   try {
  //     console.log(user);
  //     const res = await api.post("/login", user);
  //     return res;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formData.password.length < 6)
        throw new Error("please enter a bigger password");

      // const isLoggedIn = await handleLogIn(formData);

      console.log(formData);

      const res = await api.post("/login", formData);

      console.log(res);

      if (res) navigate("/Home");
      else throw new Error("login failed");

      console.log("Form submitted with data:", formData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputField}>
            <label htmlFor="identifier">Username / Email / Number</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your username, email, or number"
              required
            />
          </div>

          <div className={styles.inputField}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>

        <button className={styles.googleBtn}>Login with Google</button>
      </div>
    </div>
  );
};

export default Login;
