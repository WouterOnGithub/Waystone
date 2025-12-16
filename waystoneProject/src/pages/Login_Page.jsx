import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  return (
    <div id="login-container">

      {/* Left side: login form */}
      <div id="login-section">
        <h1 id="login-title">Login</h1>

        <input
          type="text"
          placeholder="Enter username or email"
          className="login-input"
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="login-input"
        />

        <Link to="/user/Register_Page" id="login-register-link">
          Don't have an account? Create one here!
        </Link>

        <div id="mainpage-button">
          <button
            id="login-button"
            type="button"
            onClick={() => navigate("/user/Main_Page")}
          >
            Enter
          </button>
        </div>
        
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

export default Login_Page;
