import React from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Login_Register_Page.css";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import UploadIMG_Logo from "../assets/PlaceholderImage.jpg";
import Required_Logo from "../assets/Required_Logo.webp";
import Delete_Logo from "../assets/Delete_Logo.webp";
import Add_Logo from "../assets/Add_Logo.webp";
import Placeholder from "../assets/PlaceholderImage.jpg";

/* Editing this page -Henry */
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
        <div
            id="login-image-section"
            style={{ backgroundImage: `url(${PlaceholderImage})` }}
        >
            <img src={Waystone_Logo} alt="Waystone Logo" id="login-logo" />
        </div>

    </div>
  );
}

export default Login_Page;
