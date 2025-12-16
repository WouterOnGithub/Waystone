import React, { useState } from "react";
import "./pages-css/CSS.css";
import "./pages-css/Main_Page.css";
import "./pages-css/Campaign_Map.css";
import Footer from "../components/UI/Footer";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";

function Map_() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <div className="campaign-page">
      <Sidebar />
      <div className="campaign-main">
        <Header title="Tavern" />
        <div className="campaign-body">
          {/* Location Container */}
          <div className="location-container">
            {/* Top Navigation Bar */}
            <div className="location-top-bar">
              {/* Settings Icon */}
              <button className="location-settings-btn" onClick={toggleSettings}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m0-6h6m-6 0H6"></path>
                  <path d="M19.07 4.93l-4.24 4.24m0 5.66l4.24 4.24m-14.14 0l4.24-4.24m0-5.66L4.93 4.93"></path>
                </svg>
              </button>

              {/* Navigation Buttons */}
              <div className="location-nav-buttons">
                <button className="nav-btn">Back to main map</button>
                <button className="nav-btn">Back to locationname</button>
              </div>

              {/* Location Title */}
              <h2 className="location-title">Tavern</h2>
            </div>

            {/* Settings Menu Popup */}
            {settingsOpen && (
              <div className="location-settings-menu">
                <h3>Settings</h3>
                <ul>
                  <li onClick={() => alert('Edit Location')}>Edit Location</li>
                  <li onClick={() => alert('Change Background')}>Change Background</li>
                  <li onClick={() => alert('Add NPC')}>Add NPC</li>
                  <li onClick={() => alert('Location Details')}>Location Details</li>
                  <li onClick={() => alert('Delete Location')}>Delete Location</li>
                </ul>
              </div>
            )}

            {/* Location Image/Background */}
            <div className="location-display">
              <img 
                src="/path-to-tavern-image.jpg" 
                alt="Tavern" 
                className="location-image"
              />
              
              {/* Placeholder if no image */}
              <div className="location-placeholder">
                <p>Tavern Scene</p>
                <small>Background image will be displayed here</small>
              </div>
            </div>

            {/* Action Buttons - Left Side */}
            <div className="location-action-buttons">
              <button className="action-btn create-cutscene">
                <span>Create Cutscene</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              <button className="action-btn start-battle">
                <span>Start battle</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              <button className="action-btn quick-battle">
                <span>Quick battle</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Map_;