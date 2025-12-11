import React from "react";
import "./pages-css/CSS.css";
import "./pages-css/Main_Page.css";
import "./pages-css/New_Campaign_Page_CAMPAIGN.css";
import Footer from "../components/UI/Footer";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";

function New_Campaign_Page_MAPBUILDER() {
  return (
    <div className="campaign-page">
      <Sidebar />

      <div className="campaign-main">
        <Header title="New Campaign" />
        <div className="campaign-body">

        <div className="campaign-tabs">
            <button className="campaign-tab active">Campaign</button>
            <button className="campaign-tab">Map Builder</button>
            <button className="campaign-tab">Characters</button>
        </div>

          {/* MAIN MAP BUILDER CARD */}
          <div className="campaign-card">

            {/* Templates Dropdown */}
            <div className="campaign-field">
              <label className="campaign-label">Templates</label>
              <div className="mapbuilder-row">
                <select className="mapbuilder-select">
                  <option>Select template...</option>
                </select>
              </div>
            </div>

            {/* Upload Main Map */}
            <div className="campaign-field">
              <label className="campaign-label">Import Main Map</label>
              <div className="mapbuilder-row">
                <input type="file" className="mapbuilder-file" />
                <span className="mapbuilder-icon">⬆️</span>
              </div>
            </div>

            {/* Map preview box */}
            <div className="mapbuilder-preview">
              <div className="mapbuilder-preview-icon">preview</div>
            </div>

            {/* Add buttons */}
            <div className="mapbuilder-button-row">
              <button className="campaign-pill">Add Location</button>
              <button className="campaign-pill">Show</button>
            </div>

            <div className="mapbuilder-button-row">
              <button className="campaign-pill">Add Building/Region</button>
              <button className="campaign-pill">Show</button>
            </div>

            <div className="mapbuilder-button-row">
              <button className="campaign-pill">Add Event</button>
              <button className="campaign-pill">Show</button>
            </div>

            <div className="mapbuilder-button-row">
              <button className="campaign-pill">Add Container</button>
              <button className="campaign-pill">Show</button>
            </div>

            {/* Save */}
            <div className="campaign-actions">
              <button className="campaign-save">Save and continue</button>
            </div>

          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default New_Campaign_Page_MAPBUILDER;
