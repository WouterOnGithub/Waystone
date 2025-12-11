/* Complete */
import React from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Settings_Page.css";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import Required_Logo from "../assets/PlaceholderImage.jpg";
import Placeholder from "../assets/PlaceholderImage.jpg";

function Settings_Page() 
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
            <p>Settings</p>
        </div>
        {/* The settings section */}
        <div id="content">
            <div id="settings-box">
                <form id="input-box-gray">
                    <b>Change Password</b>
                    <br />
                    <div id="settings-password">
                        <div id="settings-passwords">
                            <label htmlFor="password"><b>Password</b></label><br />
                            <input type="password" id="password"/>  
                        </div>
                        <div id="settings-passwords">
                            <label htmlFor="password-confirm"><b>Confirm Password</b></label><br />
                            <input type="password" id="password-confirm"/>
                        </div>
                        </div>

                    <br /><b>Language</b><br />
                    {/* A way to make the selected btn based on the language display throughout the site */}
                    <div id="settings-language-radiobtn">
                        <input type="radio" id="english" name="language-settings" value="English" />
                        <label htmlFor="english">English</label><br />
                        <input type="radio" id="nederlands" name="language-settings" value="Nederlands" />
                        <label htmlFor="nederlands">Nederlands</label><br />
                        <input type="radio" id="unknown" name="language-settings" value="Unknown" />
                        <label htmlFor="unknown">Unknown</label>
                    </div>

                    <br /><br />
                    <button id="button-green">Save</button>
                    <button id="button-green">Logout</button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Settings_Page;