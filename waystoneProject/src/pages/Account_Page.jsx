/* Complete */
import React from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Account_Page.css";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import Edit_Logo from "../assets/PlaceholderImage.jpg";
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
            {/* Main account section */}
            <div id="account-box">
                <div>
                    <img src={Placeholder} alt="Account_Profile" id="Account_Profile" />
                    <img src={Edit_Logo} alt="Edit_Logo" id="Edit_Logo" />
                </div>
                <div>
                    <b>Username_Placeholder</b>
                    <p>
                        This is a very long description that displays whatever text the account user put in, this will be repeated.
                        This is a very long description that displays whatever text the account user put in, this will be repeated.
                        This is a very long description that displays whatever text the account user put in, this will be repeated.
                    </p>
                </div>
            </div>

            {/* Account stats section */}
            <div id="account-box">
                <div>
                    <p><b>Total campaigns: </b> 0 </p> {/* Number later to be replaced */}
                    <p><b>Last played: </b> Project_name </p> {/* Name later to be replaced */}
                </div>
            </div>

            <button id="button-green">Archived Campaigns</button>
            <br />
            <br />
            <div id="account-notes">
                <b>Notes</b>
                <form>
                    <textarea placeholder="Enter you notes here ..."></textarea>
                    <br />
                    <br />
                    <button id="button-green">Save</button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Main_Page;