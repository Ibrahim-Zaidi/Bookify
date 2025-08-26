import React, { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router";
import styles from "./login.module.css";

const Login = () => {
  const { handleLogIn } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

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
      console.log(e);

      if (formData.password.length < 6)
        throw new Error("please enter a bigger password");

      const isLoggedIn = await handleLogIn(formData);

      console.log(isLoggedIn);

      if (isLoggedIn) navigate("/Home");
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
