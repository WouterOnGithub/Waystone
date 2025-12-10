import React from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import Waystone_Logo from "../assets/login_image.webp";

function Login_Page() {
  return (
    <div id="login-container">

      {/* Left side: login form */}
      <div id="login-section">
        <h1 id="login-title">Login</h1>

        <input
          type="text"
          placeholder="Example_Username"
          className="login-input"
        />

        <input
          type="email"
          placeholder="Example_Email"
          className="login-input"
        />

        <input
          type="password"
          placeholder="************"
          className="login-input"
        />

        <Link to="/register" id="login-register-link">
          Don't have an account? Create one here!
        </Link>

        <button id="login-button">Enter</button>
      </div>

      {/* Right side: image background + logo */}
      <div id="login-image-section">
        <img src={Waystone_Logo} alt="Waystone Logo" id="login-logo" />
      </div>

    </div>
  );
}

export default Login_Page;
