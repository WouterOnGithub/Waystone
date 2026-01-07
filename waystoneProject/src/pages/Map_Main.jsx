import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./pages-css/Campaign_Map.css";
import { useAuth } from "../context/AuthContext";
import { getCampaign, getLocations, createSession } from "../api/userCampaigns";
import { getSharedSessionCode, releaseMapPage } from "../utils/sessionCode";

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
  const [sessionCode, setSessionCode] = useState('');
  const [isCodeVisible, setIsCodeVisible] = useState(false);

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

  // Generate session code when component mounts and user is available
  useEffect(() => {
    if (userId) {
      const code = getSharedSessionCode(userId);
      setSessionCode(code);
    }
  }, [userId]);

  // Save session data to Firestore when campaign data is loaded
  useEffect(() => {
    const saveSessionData = async () => {
      if (sessionCode && campaign && userId) {
        try {
          const sessionData = {
            sessionCode: sessionCode,
            userId: userId,
            campaignId: campaignId,
            campaignName: campaign.name || 'Unnamed Campaign',
            mainMapUrl: campaign.mainMapUrl || null,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          };
          
          await createSession(sessionCode, sessionData);
          console.log("Session data saved to Firestore:", sessionData);
        } catch (error) {
          console.error("Failed to save session data:", error);
        }
      }
    };

    saveSessionData();
  }, [sessionCode, campaign, campaignId, userId]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      releaseMapPage();
    };
  }, []);

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

            {/* Session Code Display */}
            <div className="session-code-display">
              <span className="code-label">Session Code:</span>
              <span className={`code-value ${!isCodeVisible ? 'hidden' : ''}`}>
                {isCodeVisible ? sessionCode : '••••••••••••'}
              </span>
              <button 
                className="code-visibility-toggle"
                onClick={() => setIsCodeVisible(!isCodeVisible)}
                title={isCodeVisible ? 'Hide code' : 'Show code'}
              >
                {isCodeVisible ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8-4 8-11 8-11-8-4-8-11 8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5.38 0-10.17-2.88-11.99-7.5L1 12l1.01-1.01C3.83 15.17 8.62 12 14 12c5.38 0 10.17 2.88 11.99 7.5L23 12l-1.01 1.01A10.07 10.07 0 0 1 17.94 17.94z"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c1.42 0 2.76.38 3.9 1.04l.01.01-.01L9.9 4.24z"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Settings Menu */}
            {settingsOpen && (
              <div className="map-settings-menu">
                <h3>Settings</h3>
                <ul>
                  <li>Edit Map</li>
                  <li>Add Location</li>
                  <li>Grid Settings</li>
                  <li>Upload Background</li>
                  <li>Reset View</li>
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
