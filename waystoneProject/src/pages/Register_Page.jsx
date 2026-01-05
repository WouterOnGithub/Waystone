import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Login_Register_Page.css";
import Waystone_Logo from "../assets/Waystone_Logo.png";
import Waystone_Background from "../assets/PlaceholderImage.jpg";

function Register_Page() 
{
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => 
  {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signUp(email, password, username);
      // Optionally redirect to dashboard OR show success message
    } catch (err) {
      setError(err.message); // Display error if NOT successful register
    }
  };

  // Prevents the caret from showing on first load by clearing any default focus
  useEffect(() => 
  {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);
  
  return (
    <div id="login-register-page"> {/* The whole page */}

      <div id="login-register-section"> {/* Login form */}
        
        {/* The login & register title */}
        <h1 id="login-register-title">Register</h1>

        {/* The form */}
        <form onSubmit={handleSubmit}>
        <div id="input-box-gray">
          <input type="Username" placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br /><br />
          <input type="email" placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br /><br />
          <input type="password" placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br /><br />
          <input type="password" placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* A link to Register_Page */}
        <div id="login-register-link">
          <Link to="/user/Login_Page" id="login-register-link">I already have an account !</Link>
        </div>

        <br /><br />
        <div id="login-register-button"><button id="button-green" type="submit">Enter</button></div>

        {/* An error message in case an error occures */}
        {error && <p style={{ color: "#D34848" }}>{error}</p>}

        </form>
        </div>
      
      {/* Background and Waystone_Logo */}
      <div id="login-image-section" 
           style={{ backgroundImage: `url(${Waystone_Background})` }}>
              
        {/* The Waystone_Logo above the Waystone_Background image */}
        <img src={Waystone_Logo} alt="Waystone_Logo" id="Waystone_Logo" />
      </div>

    </div>
  );
}

export default Register_Page;
