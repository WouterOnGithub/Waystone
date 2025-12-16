import React, { useEffect } from "react";
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
function Register_Page() {
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

        <input
          type="Email/Username"
          placeholder="Enter username or email"
          className="login-input"
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="login-input"
        />

         <input
          type="confirm password"
          placeholder="Confirm Password"
          className="login-input"
        />

        <Link to="/user/Login_Page" id="login-register-link">
        I already have an account
        </Link>

        <Link to="/user/Main_Page"><button id="login-button">Enter</button></Link>
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
