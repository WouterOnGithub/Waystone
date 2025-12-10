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
        <img src={Waystone_Logo} alt="Waystone_Logo" id="Waystone_Logo" />
        <br />
        <Link to="/">account</Link>
        <br />
        <Link to="/">My Campaigns</Link>
        <br />
        <Link to="/">New Campaign</Link>
        <br />
        <Link to="/">settings</Link>
        <img src={Settings_Logo} alt="Settings_Logo" id="Settings_Logo" />
        <br />
        <Link to="/">help</Link>
      </nav>

      <div id="main">
        {/* The green bar at the top of the page */}
        <div id="title">
          <p>Welcome</p>
        </div>

        {/* The campaigns section */}
        <div id="content">
          <p>Recent Campaigns</p>

          <div id="box-section">
            <div id="box-text">
              <p>Project_name &nbsp;</p>
              <div id="box"></div>
            </div>

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