import React, { useReducer } from "react";
import styles from "./Register.module.css";
// import { useAuth } from "../Contexts/AuthContext.tsx";
import { useNavigate } from "react-router";
import api from "../api/axios.ts";

import GoogleOAuthButton from "./GoogleOAuthButton.tsx";
// import "dotenv/config";

type RegisterState = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
  number: string;
};

// all the Inputs are string typed, so that made it easy
// to type-group them all into this common action

type RegisterAction = {
  type: "SET_FIELD";
  field: keyof RegisterState;
  payload: string;
};

const initialValues: RegisterState = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  username: "",
  number: "",
};

function registerReducer(
  state: RegisterState,
  action: RegisterAction
): RegisterState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.payload,
      };
    default:
      return state;
  }
}

function Register() {
  const [state, dispatch] = useReducer(registerReducer, initialValues);
  const navigate = useNavigate();
  // const { handleRegister } = useAuth();

  // async function handleRegister(user: object) {
  //   try {
  //     const res = await api.post("/register", user);
  //     console.log(res);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    dispatch({
      type: "SET_FIELD",
      field: name as keyof RegisterState,
      payload: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", state);

      navigate("/login");
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  // async function handleGoogleAuth(response: any) {
  //   try {
  //     const { credential } = response;

  //     const userData = await api.post("/auth/google", { token: credential });
  //     const user = await userData.json();
  //     console.log(user);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // async function handleGoogleFailure() {
  //   console.log("Google Sign-In was unsuccessful. Try again later");
  // }

  return (
    <main className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <h1>Bookify</h1>
        <h3>your best bet for quality bookings</h3>
      </div>

      <div className={styles.registrationContainer}>
        <h1>Register now, it iss quick and easy 😉</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={state.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={state.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={state.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="number">Number:</label>
            <input
              type="text"
              id="number"
              name="number"
              value={state.number}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={state.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={state.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.btnContainer}>
            <button>log In</button>
            <button>Submit</button>
          </div>
        </form>
        <div>
          <GoogleOAuthButton />
        </div>
      </div>
    </main>
  );
}

export default Register;
