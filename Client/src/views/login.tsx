import React, { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router";

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

      const res = await handleLogIn(formData);
      console.log(res);

      navigate("/Home");

      console.log("Form submitted with data:", formData);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Identifier Input */}
          <div className="mb-4">
            <label
              htmlFor="identifier"
              className="block text-gray-700 font-medium mb-2"
            >
              pass your Username / Email / Number
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your username, email, or number"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
          <button className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
            login with google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
