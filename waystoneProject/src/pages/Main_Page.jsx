/* Not completed, currently working */
import React from "react";
import "./CSS.css";

export default function MainPage() 
{
  return (
    <div>
      {/* Sidebar */}
      <nav>
        <img src="/" alt="Waystone_Logo" />
        <a href="/">account</a>
        <a href="/">My Campaigns</a>
        <a href="/">New Campaign</a>
        <a href="/">settings</a>
        <img src="/" alt="Settings_Logo" />
        <a href="/">help</a>
      </nav>

      {/* Main Section */}
      <div>
        <div id="title">
          <p>Welcome</p>
        </div>

        <div id="content">
          <p>Recent Campaigns</p>

          <div id="box-section">
            <div id="box-text">
              <p>Project_name</p>
              <div id="box"></div>
            </div>
          </div>

          <p>News</p>
          {/* News section can be expanded later */}
        </div>
      </div>
    </div>
  );
}
