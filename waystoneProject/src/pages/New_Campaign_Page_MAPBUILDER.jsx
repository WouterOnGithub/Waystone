import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Main_Page.css";
import "./pages-css/New_Campaign_Page_CAMPAIGN.css";
import Footer from "../components/UI/Footer";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";

function New_Campaign_Page_MAPBUILDER() {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });

  const SIZE_LIMITS = useMemo(
    () => ({
      minWidth: 320,
      minHeight: 220,
      maxWidth: 900,
      maxHeight: 650,
    }),
    []
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleMapUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    const { minWidth, minHeight, maxWidth, maxHeight } = SIZE_LIMITS;

    // Determine scale needed to satisfy min size (may scale up) and max size (may scale down)
    const scaleUp = Math.max(minWidth / naturalWidth, minHeight / naturalHeight, 1);
    const scaleDown = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight, Number.POSITIVE_INFINITY);
    const scale = Math.min(scaleDown, Math.max(scaleUp, 1));

    const width = Math.round(naturalWidth * scale);
    const height = Math.round(naturalHeight * scale);

    setPreviewSize({ width, height });
  };

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
