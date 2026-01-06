import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./pages-css/Campaign_Map.css";
import { useAuth } from "../context/AuthContext";
import { getCampaign, getLocations } from "../api/userCampaigns";

function Map_Main() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid || null;
  
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [campaignLocations, setCampaignLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load campaign data and main map when component mounts or campaignId changes
  useEffect(() => {
    const loadCampaign = async () => {
      if (!campaignId || !userId) {
        setLoading(false);
        return;
      }

      try {
        const campaignData = await getCampaign(userId, campaignId);
        setCampaign(campaignData);
        
        // Load locations for this campaign
        const locationsList = await getLocations(userId, campaignId);
        setCampaignLocations(locationsList || []);
      } catch (error) {
        console.error("Failed to load campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId, userId]);

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

  const handleResume = () => {
    setSettingsOpen(false);
  };

  const handleSaveGame = () => {
    navigate(`/user/Game_Settings_SAVEGAME/${campaignId}`);
  };

  const handleEndSession = () => {
    const confirmEnd = window.confirm(
      "Are you sure you want to end this session? Make sure you've saved your progress."
    );
    if (confirmEnd) {
      navigate("/user/campaigns");
    }
  };

  const handleReturnToMenu = () => {
    const confirmReturn = window.confirm(
      "Return to main menu? Any unsaved progress will be lost."
    );
    if (confirmReturn) {
      navigate("Main_Page.jsx");
    }
  };

  return (
    <div className="full-page">
    <div className="campaign-page">
      <div className="map-container">

        {/* Top Controls */}
        <div className="map-top-controls">
          {/* Back Button */}
          <button 
            className="map-back-btn" 
            onClick={() => navigate(-1)}
            title="Go back to previous page"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Settings Button */}
          <button className="map-settings-btn" onClick={toggleSettings}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6m0-6h6m-6 0H6" />
              <path d="M19.07 4.93l-4.24 4.24m0 5.66l4.24 4.24m-14.14 0l4.24-4.24m0-5.66L4.93 4.93" />
            </svg>
          </button>
        </div>

        {/* Settings Menu */}
        {settingsOpen && (
          <div className="map-settings-menu">
            <h3>Game Settings</h3>
            <ul>
              <li onClick={handleResume}>Resume Game</li>
              <li onClick={handleSaveGame}>Save Game</li>
              <li onClick={handleEndSession}>End Session</li>
              <li onClick={handleReturnToMenu}>Return to Main Menu</li>
            </ul>
          </div>
        )}

        {/* Locations Dropdown */}
        <div className="map-locations-dropdown">
          <button
            className={`locations-toggle ${locationsOpen ? "open" : ""}`}
            onClick={toggleLocations}
          >
            Locations
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {locationsOpen && (
            <div className="locations-buttons-container">
              {campaignLocations.length > 0 ? (
                campaignLocations.map((location) => (
                  <button
                    key={location.id}
                    className="location-button"
                    onClick={() => navigate(`/user/Map_Location/${campaignId}/${location.id}`)}
                  >
                    {location.name || 'Unnamed Location'}
                  </button>
                ))
              ) : (
                <div className="no-locations-message">
                  No locations added yet
                </div>
              )}
            </div>
          )}
        </div>

        {/* Map Display */}
        <div className="map-display">
          {loading ? (
            <div className="map-placeholder">
              <p>Loading map...</p>
            </div>
          ) : campaign?.mainMapUrl ? (
            <img
              src={campaign.mainMapUrl}
              alt="Campaign Map"
              className="map-image"
            />
          ) : (
            <div className="map-placeholder">
              <p>No map uploaded yet</p>
              <small>Upload a map in the Map Builder to see it here</small>
            </div>
          )}

          <div className="map-compass">
            <svg width="80" height="80" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#2e3d08" strokeWidth="2" />
              <polygon points="50,15 55,45 50,50 45,45" fill="#2e3d08" />
              <polygon points="50,85 55,55 50,50 45,55" fill="#5b701d" />
              <text x="50" y="12" textAnchor="middle">N</text>
              <text x="50" y="92" textAnchor="middle">S</text>
              <text x="88" y="54" textAnchor="middle">E</text>
              <text x="12" y="54" textAnchor="middle">W</text>
            </svg>
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}

export default Map_Main;
