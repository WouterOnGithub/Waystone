/* Complete */
import React from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Main_Page.css";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import Settings_Logo from "../assets/PlaceholderImage.jpg";
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
          <p>Welcome</p>
        </div>
        {/* The campaigns section */}
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

          <br />
          <b>News</b>

          <div id="news-box-section">
            <div id="news-box">
              <img src={Placeholder} alt="NewsImages" id="news-box-img" />
              <div id="news-box-text">
                <b>News_Title</b>
                <p>
                  This is a very long description that explains whatever the
                  news is about, this will be repeated. This is a very long
                  description that explains whatever the news is about, this
                  will be repeated. This is a very long description that
                  explains whatever the news is about, this will be repeated.
                  This is a very long description that explains whatever the
                  news is about, this will be repeated.
                </p>
              </div>
            </div>

            {/* Extra placeholder boxes, later to be removed */}
            <div id="news-box">
              <img src={Placeholder} alt="NewsImages" id="news-box-img" />
              <div id="news-box-text">
                <b>News_Title</b>
                <p>
                  This is a very long description that explains whatever the
                  news is about, this will be repeated. This is a very long
                  description that explains whatever the news is about, this
                  will be repeated. This is a very long description that
                  explains whatever the news is about, this will be repeated.
                  This is a very long description that explains whatever the
                  news is about, this will be repeated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main_Page;