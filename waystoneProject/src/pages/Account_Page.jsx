/* Complete */
import React from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Account_Page.css";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import Placeholder from "../assets/PlaceholderImage.jpg";

function Main_Page() 
{
  return (
    <div>
      <div className="navigation">
      <nav>
        <br />
        <img src={Waystone_Logo} alt="Waystone_Logo" id="Waystone_Logo" />
        <br />
        <br />
        <br />
        <Link to="/">Account</Link>
        <br />
        <br />
        <Link to="/">My Campaigns</Link>
        <br />
        <br />
        <Link to="/">New Campaign</Link>
        <br />
        <br />
        <Link to="/">Settings</Link>
        <br />
        <br />
        <Link to="/">Help</Link>
      </nav>
      </div>

      <div id="main">
        {/* The green bar at the top of the page */}
        <div id="title">
          <p>Account</p>
        </div>
        {/* The account section */}
        <div id="content">
            <div id="account-box">
                <p>placeholder</p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Main_Page;