import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./pages-css/Campaign_Map.css";
import { useAuth } from "../context/AuthContext";
import { getCampaign, getLocations, createSession, updateSessionStatus, deleteSession, cleanupInactiveSessions, updateSessionHeartbeat, getEvents } from "../api/userCampaigns";
import { getSharedSessionCode, getExistingSessionCode, releaseMapPage, setSessionCleanupCallback, startNewSession, endCurrentSession, isSessionActive } from "../utils/sessionCode";

function Map_Main() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid || null;
  
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [campaignLocations, setCampaignLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  // Load campaign data and main map when component mounts or campaignId changes
  useEffect(() => {
    const loadCampaign = async () => {
      if (!campaignId || !userId) {
        setLoading(false);
        setMapLoading(false);
        return;
      }

      try {
        const campaignData = await getCampaign(userId, campaignId);
        setCampaign(campaignData);
        
        // Load locations for this campaign
        const locationsList = await getLocations(userId, campaignId);
        setCampaignLocations(locationsList || []);
        
        // Load events for this campaign
        const eventsList = await getEvents(userId, campaignId);
        setEvents(eventsList || []);
      } catch (error) {
        console.error("Failed to load campaign:", error);
      } finally {
        setLoading(false);
        setMapLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId, userId]);

  // Add effect to periodically check if map URL needs updating
  useEffect(() => {
    if (!campaignId || !userId) return;

    const checkMapUrl = async () => {
      try {
        const freshCampaignData = await getCampaign(userId, campaignId);
        if (freshCampaignData?.mainMapUrl !== campaign?.mainMapUrl) {
          console.log('Map URL updated, refreshing campaign data...');
          setCampaign(freshCampaignData);
        }
      } catch (error) {
        console.error('Error checking map URL:', error);
      }
    };

    // Check immediately and then every 5 seconds
    checkMapUrl();
    const interval = setInterval(checkMapUrl, 5000);
    
    return () => clearInterval(interval);
  }, [campaignId, userId]);

  // Additional effect to handle map loading issues
  useEffect(() => {
    if (mapError && campaignId && userId) {
      console.log('Map error detected, reloading campaign data...');
      const retryLoad = async () => {
        try {
          const campaignData = await getCampaign(userId, campaignId);
          setCampaign(campaignData);
          setMapError(false);
          setMapLoading(false);
        } catch (error) {
          console.error('Failed to reload campaign:', error);
        }
      };
      
      // Retry after 3 seconds
      const retryTimer = setTimeout(retryLoad, 3000);
      
      return () => clearTimeout(retryTimer);
    }
  }, [mapError, campaignId, userId]);

  // Set up session cleanup callback
  useEffect(() => {
    setSessionCleanupCallback((code) => {
      // Don't delete session automatically - only delete when explicitly ending session
      // This prevents accidental deletion when navigating between pages
      console.log("Session cleanup callback called for code:", code, "- not deleting automatically");
    });
  }, []);

  // Get existing session code when component mounts (don't auto-generate)
  useEffect(() => {
    if (userId && campaignId) {
      // Clean up old inactive sessions first
      cleanupInactiveSessions().catch(console.error);
      
      // Only get existing session code, don't generate new one
      // Map_Main should start with inactive session
      const code = getExistingSessionCode(userId, campaignId);
      // If no session exists, code will be null, which is what we want
      setSessionCode(code || '');
    }
  }, [userId, campaignId]);

  // Save session data to Firestore when session is active
  useEffect(() => {
    const saveSessionData = async () => {
      if (sessionCode && campaign && userId && isSessionActive()) {
        try {
          const sessionData = {
            sessionCode: sessionCode,
            userId: userId,
            campaignId: campaignId,
            campaignName: campaign.name || 'Unnamed Campaign',
            mainMapUrl: campaign.mainMapUrl || null,
            isActive: true,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            lastHeartbeat: new Date().toISOString(),
            // Initialize view state flags
            battleMapActive: false,
            locationActive: false,
            buildingRegionActive: false
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

  // Heartbeat mechanism to keep session alive
  useEffect(() => {
    if (!sessionCode) return;

    const heartbeatInterval = setInterval(() => {
      // Only send heartbeat if page is visible
      if (!document.hidden) {
        updateSessionHeartbeat(sessionCode);
      }
    }, 30000); // Send heartbeat every 30 seconds

    // Send initial heartbeat
    updateSessionHeartbeat(sessionCode);

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, stop heartbeat
        console.log("Page hidden, stopping heartbeat");
        clearInterval(heartbeatInterval);
      } else {
        // Page is visible, restart heartbeat
        console.log("Page visible, restarting heartbeat");
        updateSessionHeartbeat(sessionCode);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(heartbeatInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessionCode]);

  // Update session with main map data when component mounts
  useEffect(() => {
    const updateSessionWithMainMap = async () => {
      if (isSessionActive()) {
        const sessionCode = getExistingSessionCode(userId, campaignId);
        
        if (sessionCode) {
          try {
            const updateData = {
              // Clear all other view states to indicate main map is active
              battleMapActive: false,
              locationActive: false,
              buildingRegionActive: false
            };
            await updateSessionBattleMap(sessionCode, updateData);
          } catch (error) {
            console.error("Failed to update session with main map data:", error);
          }
        }
      }
    };

    updateSessionWithMainMap();
  }, [userId, campaignId]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Don't delete session on unmount - only delete when explicitly ending session
      releaseMapPage();
    };
  }, []);

  const toggleLocations = () => {
    setLocationsOpen(!locationsOpen);
    if (settingsOpen) setSettingsOpen(false);
    if (eventsDropdownOpen) setEventsDropdownOpen(false);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
    if (locationsOpen) setLocationsOpen(false);
    if (eventsDropdownOpen) setEventsDropdownOpen(false);
  };

  const toggleEventsDropdown = () => {
    setEventsDropdownOpen(!eventsDropdownOpen);
    if (settingsOpen) setSettingsOpen(false);
    if (locationsOpen) setLocationsOpen(false);
  };

  const handleEventSelect = (event) => {
    navigate(`/user/Map_Battle_View_DM/${campaignId}/${event.mapId}`);
    setEventsDropdownOpen(false);
  };

  const selectLocation = (location) => {
    setSelectedLocation(location);
    setLocationsOpen(false);
    if (location) {
      navigate(`/user/Map_Location/${campaignId}/${location.id}`);
    }
  };

  const handleResume = () => {
    setSettingsOpen(false);
  };

  const handleSaveGame = () => {
    navigate(`/user/Game_Settings_SAVEGAME/${campaignId}`);
  };

  const handleEndSession = () => {
    const confirmEnd = window.confirm(
      "Are you sure you want to end this session? This will kick all players out."
    );
    if (confirmEnd) {
      // Delete session when explicitly ending it
      if (sessionCode) {
        deleteSession(sessionCode);
      }
      endCurrentSession();
      setSessionCode('');
      // Stay on the same page, just end the session
    }
  };

  const handleStartSession = () => {
    if (userId && campaignId) {
      const newCode = startNewSession(userId, campaignId);
      setSessionCode(newCode);
      console.log("New session started with code:", newCode);
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
                onClick={() => navigate(`/user/New_Campaign_Page_MAPBUILDER/${campaignId}`)}
                title="Go to Map Builder"
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

            {/* Session Code Display and Controls */}
            <div className="session-code-display">
              <span className="code-label">Session Code:</span>
              <span className={`code-value ${!isCodeVisible ? 'hidden' : ''}`}>
                {isCodeVisible && sessionCode ? sessionCode : '•••••••••••••'}
              </span>
              <button 
                className="code-visibility-toggle"
                onClick={() => setIsCodeVisible(!isCodeVisible)}
                title={isCodeVisible ? 'Hide code' : 'Show code'}
                disabled={!sessionCode}
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
              
              {/* Session Control Buttons */}
              <div className="session-control-buttons">
                {!sessionCode ? (
                  <button 
                    className="start-session-btn"
                    onClick={handleStartSession}
                    title="Start new session"
                  >
                    Start Session
                  </button>
                ) : (
                  <button 
                    className="end-session-btn"
                    onClick={handleEndSession}
                    title="End current session"
                  >
                    End Session
                  </button>
                )}
              </div>
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
                        onClick={() => selectLocation(location)}
                      >
                        {location.name}
                      </button>
                    ))
                  ) : (
                    <div className="no-locations-message">
                      No locations added to this campaign yet
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Start Battle Button with Dropdown */}
            <div className="map-events-dropdown">
              <button className="start-battle-btn" onClick={toggleEventsDropdown}>
                Start Battle
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginLeft: '5px'}}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              
              {eventsDropdownOpen && (
                <div className="events-dropdown-menu">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <button
                        key={event.mapId}
                        className="event-item"
                        onClick={() => handleEventSelect(event)}
                      >
                        {event.name}
                      </button>
                    ))
                  ) : (
                    <div className="no-events">No events available</div>
                  )}
                </div>
              )}
            </div>

            {/* Map Display */}
            <div className="map-display">
              {loading || mapLoading ? (
                <div className="map-placeholder">
                  <p>Loading map...</p>
                </div>
              ) : campaign?.mainMapUrl ? (
                <img
                  src={campaign.mainMapUrl}
                  alt="Campaign Map"
                  className="map-image"
                  onLoad={() => {
                    setMapLoading(false);
                    setMapError(false);
                    console.log('Map loaded successfully:', campaign.mainMapUrl);
                  }}
                  onError={(e) => {
                    console.error('Map image failed to load:', campaign.mainMapUrl);
                    setMapError(true);
                    setMapLoading(false);
                    // Retry loading after a short delay to handle potential timing issues
                    setTimeout(() => {
                      const retryUrl = `${campaign.mainMapUrl}?retry=${Date.now()}`;
                      console.log('Retrying map load with:', retryUrl);
                      e.target.src = retryUrl;
                      setMapError(false);
                    }, 2000);
                  }}
                />
              ) : (
                <div className="map-placeholder">
                  <p>No map uploaded yet</p>
                  <small>Upload a map in the Map Builder to see it here</small>
                </div>
              )}
              
              {mapError && (
                <div style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  background: '#ff6b6b', 
                  color: 'white', 
                  padding: '5px 10px', 
                  borderRadius: '5px',
                  fontSize: '12px'
                }}>
                  Map failed to load. Retrying...
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
