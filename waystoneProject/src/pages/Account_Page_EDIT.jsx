/* Complete */
import React from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Account_Page.css";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import UploadIMG_Logo from "../assets/PlaceholderImage.jpg";
import Required_Logo from "../assets/Required_Logo.webp";
import Delete_Logo from "../assets/Delete_Logo.webp";
import Add_Logo from "../assets/Add_Logo.webp";
import Placeholder from "../assets/PlaceholderImage.jpg";

function Account_Page_EDIT() 
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
            {/* Main account section */}
            <div id="account-box">
                <form id="input-box-gray">
                    <label htmlFor="upload-img">
                        <img src={UploadIMG_Logo} alt="UploadIMG_Logo" id="UploadIMG_Logo" />
                    </label>
                    <input type="file" id="upload-img" hidden/>
                    <br />
                    <label htmlFor="name"><b>Name</b></label><br />
                    <input type="text" id="name" defaultValue="John Doe"/>
                    <br /><br />
                    <label htmlFor="nickname"><b>Nickname</b></label> <img src={Required_Logo} alt="Required_Logo" id="Required_Logo" /><br />
                    <input type="text" id="nickname" value="DM_0124" required/>
                    <br /><br />
                    <label htmlFor="introduction"><b>Introduction</b> (max. 150 characters)</label><br />
                    <textarea name="introduction" id="introduction" defaultValue="Hello, my name is [Your name] !" maxlength="150"></textarea>
                    <br /><br />
                    <button id="button-green">Save</button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Account_Page_EDIT;