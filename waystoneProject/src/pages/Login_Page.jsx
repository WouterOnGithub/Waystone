import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import "./pages-css/CSS.css";
import "./pages-css/Login_Register_Page.css";
import Waystone_Logo from "../assets/Waystone_Logo.png";
import Waystone_Background from "../assets/background.jpg";

function Login_Page() 
{

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  const navigate = useNavigate();

const handleLogin = async () => 
{
  setError("");
  try {
    await signIn(email, password);
    navigate("/user/Main_Page"); // Redirect if successful login
  } catch (err) {
    setError(err.message); // Display error if NOT successful login
  }
};

const handleSession= [
    { to: "./user/Join_Session", label: "Join_Session" },
  ];

   const goToSession = () => {
    navigate(handleSession[0].to); // dit voert de navigatie uit
  };

  return (
    <div id="login-register-page"> {/* The whole page */}

      <div id="login-register-section"> {/* Login form */}

        {/* The login & register title */}
        <h1 id="login-register-title">Login</h1>

      {/* The form */}
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>

      <div id="input-box-white">
        <input type="email" placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br /><br />

        <input type="password" placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

        {/* A link to Register_Page */}
        <div id="login-register-link">
          <Link to="/user/Register_Page" id="login-register-link">Don't have an account ?  Create one here !</Link>
        </div>

        <br /><br />
        <div id="login-register-button">
          <button id="button-green" type="submit">Enter</button>
          <button id="button-gray" type="button" onClick={goToSession}>Join Session</button>
        </div>
        {/* An error message in case an error occures */}
        {/*{error && <p style={{ color: "#D34848" }}>{error}</p>}*/}
        
      </form>
      
      {/* An error message in case an error occures */}
      {/*{error && <p style={{ color: "#D34848" }}>{error}</p>}*/}
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

export default Login_Page;
