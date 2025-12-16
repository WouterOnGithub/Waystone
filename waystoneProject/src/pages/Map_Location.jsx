import React, { useState } from "react";
import "./pages-css/CSS.css";
import "./pages-css/Main_Page.css";
import "./pages-css/Campaign_Map.css";
import Footer from "../components/UI/Footer";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";

function Map_Location() {
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const locations = [
    { id: 1, name: "Eldor's Keep", description: "Ancient fortress in the heart of the realm" },
    { id: 2, name: "Darkfall", description: "Mysterious village shrouded in shadow" },
    { id: 3, name: "Ithilien", description: "Enchanted forest region" },
    { id: 4, name: "Lormdell", description: "Peaceful riverside town" },
    { id: 5, name: "Darkwood", description: "Dense and dangerous forest" }
  ];

  const toggleLocations = () => {
    setLocationsOpen(!locationsOpen);
    if (settingsOpen) setSettingsOpen(false);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
    if (locationsOpen) setLocationsOpen(false);
  };

  const selectLocation = (location) => {
    setSelectedLocation(location);
    setLocationsOpen(false);
  };

  return (
    <div className="campaign-page">
      <Sidebar />
      <div className="campaign-main">
        <Header title="Campaign Map" />
        <div className="campaign-body">
          {/* Map Container */}
          <div className="map-container">
            {/* Settings Icon - Top Left */}
            <button className="map-settings-btn" onClick={toggleSettings}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m0-6h6m-6 0H6"></path>
                <path d="M19.07 4.93l-4.24 4.24m0 5.66l4.24 4.24m-14.14 0l4.24-4.24m0-5.66L4.93 4.93"></path>
              </svg>
            </button>

            {/* Settings Menu Popup */}
            {settingsOpen && (
              <div className="map-settings-menu">
                <h3>Settings</h3>
                <ul>
                  <li onClick={() => alert('Edit Map')}>Edit Map</li>
                  <li onClick={() => alert('Add Location')}>Add Location</li>
                  <li onClick={() => alert('Grid Settings')}>Grid Settings</li>
                  <li onClick={() => alert('Upload Background')}>Upload Background</li>
                  <li onClick={() => alert('Reset View')}>Reset View</li>
                </ul>
              </div>
            )}

            {/* Locations Dropdown - Top Right */}
            <div className="map-locations-dropdown">
              <button className="locations-toggle" onClick={toggleLocations}>
                Locations
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{ transform: locationsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {locationsOpen && (
                <div className="locations-menu">
                  {locations.map((location) => (
                    <div 
                      key={location.id} 
                      className="location-item"
                      onClick={() => selectLocation(location)}
                    >
                      {location.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Map Image/Background */}
            <div className="map-display">
              <img 
                src="/path-to-your-map-image.jpg" 
                alt="Campaign Map" 
                className="map-image"
              />
              
              {/* Compass */}
              <div className="map-compass">
                <svg width="80" height="80" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#2e3d08" strokeWidth="2" opacity="0.7"/>
                  <polygon points="50,15 55,45 50,50 45,45" fill="#2e3d08"/>
                  <polygon points="50,85 55,55 50,50 45,55" fill="#5b701d"/>
                  <text x="50" y="12" textAnchor="middle" fill="#2e3d08" fontSize="12" fontWeight="bold">N</text>
                  <text x="50" y="92" textAnchor="middle" fill="#2e3d08" fontSize="12" fontWeight="bold">S</text>
                  <text x="88" y="54" textAnchor="middle" fill="#2e3d08" fontSize="12" fontWeight="bold">E</text>
                  <text x="12" y="54" textAnchor="middle" fill="#2e3d08" fontSize="12" fontWeight="bold">W</text>
                </svg>
              </div>

              {/* Placeholder text if no map */}
              <div className="map-placeholder">
                <p>Map will be displayed here</p>
                <small>Click settings to upload a background image</small>
              </div>
            </div>

            {/* Selected Location Info */}
            {selectedLocation && (
              <div className="location-info-panel">
                <button 
                  className="location-info-close"
                  onClick={() => setSelectedLocation(null)}
                >
                  ×
                </button>
                <h3>{selectedLocation.name}</h3>
                <p>{selectedLocation.description}</p>
                <div className="location-actions">
                  <button className="location-btn">View Details</button>
                  <button className="location-btn">Add Notes</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Map_Location;