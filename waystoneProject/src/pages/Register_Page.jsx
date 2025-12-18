import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Login_Register_Page.css";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import Placeholder from "../assets/PlaceholderImage.jpg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


/* Editing this page -Henry */
function Register_Page() {
const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    await signUp(email, password, username);
    navigate("/user/Login_Page"); // ✅ redirect after success
  } catch (err) {
    setError(err.message);
  }
};

  // Prevent the caret from showing on first load by clearing any default focus
  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);
  return (
    <div id="login-container">

      {/* Left side: login form */}
      <div id="login-section">
        <h1 id="login-title">Register</h1>

        <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter username"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="login-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Link to="/user/Login_Page" id="login-register-link">
        I already have an account
        </Link>

        <button id="login-button" type="submit">
        Submit
        </button>

        </form>
      </div>

      {/* Right side: image background + logo */}
        <div
            id="login-image-section"
            style={{ backgroundImage: `url(${Placeholder})` }}
        >
            <img src={Waystone_Logo} alt="Waystone Logo" id="login-logo" />
        </div>

    </div>
  );
}

export default Register_Page;
