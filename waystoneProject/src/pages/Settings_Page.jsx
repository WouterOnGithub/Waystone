/* Complete */
import React from "react";
import "./pages-css/CSS.css";
import "./pages-css/Settings_Page.css";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import Sidebar from "../components/UI/Sidebar";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import UploadIMG_Logo from "../assets/PlaceholderImage.jpg";
import Required_Logo from "../assets/Required_Logo.webp";
import Delete_Logo from "../assets/Delete_Logo.webp";
import Add_Logo from "../assets/Add_Logo.webp";
import Placeholder from "../assets/PlaceholderImage.jpg";

function Settings_Page() {
  return (
    <div className="settings-page">
      <Sidebar />

      <div id="main" className="settings-shell">
        <Header title="Settings" />

        {/* The settings section */}
        <div id="content" className="settings-content">
          <div id="settings-box">
            <form id="input-box-gray">
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
              <b>Language</b>
              <br />
              {/* Needs a way to make the selected btn based on the language display throughout the site */}
              <div id="settings-language-radiobtn">
                <input
                  type="radio"
                  id="english"
                  name="language-settings"
                  value="English"
                />
                <label htmlFor="english">English</label>

                <br />
                <input
                  type="radio"
                  id="nederlands"
                  name="language-settings"
                  value="Nederlands"
                />
                <label htmlFor="nederlands">Nederlands</label>

                <br />
                <input
                  type="radio"
                  id="unknown"
                  name="language-settings"
                  value="Unknown"
                />
                <label htmlFor="unknown">Unknown</label>
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
  );
}

export default Settings_Page;