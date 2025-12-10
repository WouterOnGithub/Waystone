/* Not completed, currently working */
import React from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import Settings_Logo from "../assets/PlaceholderImage.jpg";
import Placeholder from "../assets/PlaceholderImage.jpg";

function My_Campaigns_Page() 
{
  return (
    <div>
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
        <img src={Settings_Logo} alt="Settings_Logo" id="Settings_Logo" />
        <br />
        <br />
        <Link to="/">Help</Link>
      </nav>

      <div id="main">
        {/* The green bar at the top of the page */}
        <div id="title">
          <p>My Campaigns</p>
        </div>

        {/* The RECENT campaigns section */}
        <div id="content">
          <b>Recent Campaigns</b>

          <div id="box-section">
            <div id="box-text">
              <p>Project_name &nbsp;</p>
              <div id="box"></div>
            </div>

            {/* Extra placeholder boxes, later to be removed */}
            <div id="box-text">
              <p>Project_name &nbsp;</p>
              <div id="box"></div>
            </div>

            {/* Extra placeholder boxes, later to be removed */}
            <div id="box-text">
              <p>Project_name &nbsp;</p>
              <div id="box"></div>
            </div>

            {/* Extra placeholder boxes, later to be removed */}
            <div id="box-text">
              <p>Project_name &nbsp;</p>
              <div id="box"></div>
           </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default My_Campaigns_Page;