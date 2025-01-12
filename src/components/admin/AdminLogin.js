import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import "./AdminLogin.css";

const API_KEY = "AIzaSyAuhWVPRFZTjeusq__hFDwkmwnllDNUEog";

const AdminLogin = () => {
  const { login } = useAuth(); // Access the login function from context
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const toggleSignup = () => {
    setIsSignup((prev) => !prev);
    setIsForgotPassword(false);
    setMessage("");
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(true);
    setIsSignup(false);
    setMessage("");
  };

  const backToLogin = () => {
    setIsForgotPassword(false);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      let url = "";

      if (isForgotPassword) {
        url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setMessage("Password reset email sent!");
        } else {
          setMessage(data.error.message);
        }
      } else if (isSignup) {
        url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setMessage("Account created successfully!");
        } else {
          setMessage(data.error.message);
        }
      } else {
        url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          login(); // Set login state to true
          setMessage("Logged in successfully!");
        } else {
          setMessage(data.error.message);
        }
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="admin-container">
      <h1>{isForgotPassword ? "Forgot Password" : isSignup ? "Sign Up" : "Admin Login"}</h1>
      <form className="grid-form" onSubmit={handleSubmit}>
        {!isForgotPassword && (
          <>
            <input
              type="email"
              placeholder="Official Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}

        {isForgotPassword && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="button" className="back-button" onClick={backToLogin}>
              Back to Login
            </button>
          </>
        )}

        <button type="submit">
          {isForgotPassword
            ? "Send Reset Link"
            : isSignup
            ? "Create Account"
            : "Login"}
        </button>
      </form>
      <p className="message">{message}</p>
      <div className="toggle-links">
        {!isForgotPassword && (
          <p onClick={toggleSignup}>
            {isSignup ? "Already have an account? Login" : "New here? Sign Up"}
          </p>
        )}
        {!isSignup && <p onClick={toggleForgotPassword}>Forgot Password?</p>}
      </div>
    </div>
  );
};

export default AdminLogin;