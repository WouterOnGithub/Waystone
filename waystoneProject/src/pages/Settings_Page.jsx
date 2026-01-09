/* Complete */
import React from "react";
import "./pages-css/CSS.css";
import "./pages-css/Settings_Page.css";
import "./pages-css/Main_Page.css";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import Sidebar from "../components/UI/Sidebar";

function Settings_Page() 
{
  return (
    <div className="full-page">
      <Sidebar />
      <div className="main-wrapper">
        <div id="main">
          <Header title="Settings" />

        {/* The settings section */}
        <div id="content" className="settings-content">
          <div id="settings-box">
            <form id="input-box-white">
              <b>Change Password</b>
              <br />
              <div id="settings-password">

                <div id="settings-passwords">
                  <label htmlFor="password"><b>Password</b></label>
                  <br />
                  <input type="password" id="password" />
                </div>

                <div id="settings-passwords">
                  <label htmlFor="password-confirm"><b>Confirm Password</b></label>
                  <br />
                  <input type="password" id="password-confirm" />
                </div>
              </div>

              <br />
              <br />
              <button id="button-green">Save</button>
            </form>
          </div>
        </div>

        <Footer />
        </div>
      </div>
    </div>
  );
}

export default Settings_Page;