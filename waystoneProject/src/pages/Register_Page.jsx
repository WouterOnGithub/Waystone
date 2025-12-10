import React from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import Waystone_Logo from "../assets/Waystone_logo.png";

function Login_Page() {
  return (
    <div id="login-container">

      {/* Left side: login form */}
      <div id="login-section">
        <h1 id="login-title">Register</h1>

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

         <input
          type="confirm password"
          placeholder="************"
          className="login-input"
        />

        <Link to="/Login_Page" id="login-register-link">
        I already have an account
        </Link>

        <Link to="/Main_Page"><button id="login-button">Enter</button></Link>
      </div>

      {/* Right side: image background + logo */}
      <div id="login-image-section">
        <img src={Waystone_Logo} alt="Waystone Logo" id="login-logo" />
      </div>

    </div>
  );
}

export default Login_Page;
