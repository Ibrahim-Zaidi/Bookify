import React, { useReducer } from "react";
import styles from "./Register.module.css";
import { useNavigate } from "react-router";
import GoogleOAuthButton from "../../ui/GoogleOAuthButton.tsx";
import { useAuth } from "../../Contexts/AuthContext.tsx";

type RegisterState = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
  number: string;
};

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
  const { register } = useAuth();

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
      await register(state);
      console.log("Registration successful!");

      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Registration failed. Please try again.");
    }
  };

  const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleBookifyClick = () => {
    navigate("/");
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <h1 onClick={handleBookifyClick} className={styles.clickableTitle}>
          Bookify
        </h1>
        <h3>your best bet for quality bookings</h3>
      </div>

      <div className={styles.registrationContainer}>
        <h1>Register now, it is quick and easy 😉</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={state.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
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
              placeholder="Enter your last name"
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
              placeholder="Choose a username"
              required
            />
          </div>
          <div>
            <label htmlFor="number">Phone Number:</label>
            <input
              type="tel"
              id="number"
              name="number"
              value={state.number}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
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
              placeholder="Enter your email address"
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
              placeholder="Create a strong password"
              required
            />
          </div>
          <div className={styles.btnContainer}>
            <button type="submit">Register</button>
            <button type="button" onClick={handleLoginClick}>
              go to login
            </button>
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
