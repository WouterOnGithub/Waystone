import React from "react";
import Sidebar from "../components/UI/Sidebar.jsx";
import Footer from "../components/UI/Footer.jsx";
import "./pages-css/CSS.css";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import UploadIMG_Logo from "../assets/PlaceholderImage.jpg";
import Required_Logo from "../assets/Required_Logo.webp";
import Delete_Logo from "../assets/Delete_Logo.webp";
import Add_Logo from "../assets/Add_Logo.webp";
import Placeholder from "../assets/PlaceholderImage.jpg";

export default function NewCampaign() {
  return (
    <>
      <Sidebar />

      <div id="main">

        {/* GREEN TITLE BAR */}
        <div id="title">
          <p>New Campaign</p>
        </div>

        {/* PAGE CONTENT */}
        <div id="content">

          {/* TAB BUTTONS */}
          <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
            <button id="button-green">Campaign</button>
            <button id="button-green">Map Builder</button>
            <button id="button-green">Characters</button>
          </div>

          {/* TEMPLATES DROPDOWN */}
          <div style={{ marginBottom: "20px" }}>
            <label><b>Templates</b></label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <select style={{ padding: "10px", borderRadius: "5px" }}>
                <option>Select template…</option>
              </select>
              <span style={{ fontSize: "25px" }}>⬇️</span>
            </div>
          </div>

          {/* IMPORT MAP */}
          <div style={{ marginBottom: "20px" }}>
            <label><b>Import Main Map</b></label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input type="file" />
              <span style={{ fontSize: "25px" }}>⬆️</span>
            </div>
          </div>

          {/* MAP PREVIEW */}
          <div
            style={{
              width: "80%",
              height: "250px",
              background: "#bfbfbf",
              border: "3px solid #ffffff",
              margin: "30px auto",
              position: "relative"
            }}
          >
            <div
              style={{
                fontSize: "40px",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            >
              ⬆️
            </div>
          </div>

          {/* LOCATION BUTTONS */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button id="button-green">Add Location</button>
            <button id="button-green">Show</button>
          </div>

          {/* MORE BUTTONS */}
          <div style={{ marginTop: "30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <button id="button-green">Add Building/Region</button>
              <button id="button-green">Show</button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "15px" }}>
              <button id="button-green">Add event</button>
              <button id="button-green">Show</button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "15px" }}>
              <button id="button-green">Add Container</button>
              <button id="button-green">Show</button>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div style={{ marginTop: "40px" }}>
            <button id="button-green">Save and continue</button>
          </div>

        </div>

        
        <Footer />
        
      </div>
    </>
  );
}
