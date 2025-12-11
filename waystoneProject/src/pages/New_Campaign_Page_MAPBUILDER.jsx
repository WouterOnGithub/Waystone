import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pages-css/CSS.css";

export default function NewCampaign() {
  return (
    <div className="campaign-page">
      <Sidebar />

      <div className="campaign-main">
        <Header title="New Campaign" />
        <div className="campaign-body">

        <div className="campaign-tabs">
            <button
              className="campaign-tab"
              onClick={() => navigate("/user/New_Campaign_Page_CAMPAIGN")}
            >
              Campaign
            </button>
            <button className="campaign-tab active">Map Builder</button>
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
                <input
                  type="file"
                  accept="image/*"
                  className="mapbuilder-file"
                  onChange={handleMapUpload}
                />
              </div>
            </div>

            {/* Map preview box */}
            <div
              className="mapbuilder-preview"
              style={
                previewSize.width && previewSize.height
                  ? { width: `${previewSize.width}px`, height: `${previewSize.height}px` }
                  : undefined
              }
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Map preview"
                  className="mapbuilder-preview-img"
                  onLoad={handleImageLoad}
                />
              ) : (
                <div className="mapbuilder-preview-icon">preview</div>
              )}
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
