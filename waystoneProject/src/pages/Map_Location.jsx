import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./pages-css/Campaign_Map.css";
import { useAuth } from "../context/AuthContext";
import { getCampaign, getBuildingsRegions, getLocations, deleteSession, updateSessionHeartbeat, updateSessionBattleMap, getEvents } from "../api/userCampaigns";
import { getExistingSessionCode, releaseMapPage, setSessionCleanupCallback, startNewSession, endCurrentSession, isSessionActive } from "../utils/sessionCode";

function Map_Location() {
  const { campaignId, locationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid || null;
  
  const [regionsOpen, setRegionsOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [campaignRegions, setCampaignRegions] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionCode, setSessionCode] = useState('');
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  // Load campaign data and location when component mounts or campaignId/locationId changes
  useEffect(() => {
    const loadData = async () => {
      if (!campaignId || !userId) {
        setLoading(false);
        return;
      }

      try {
        const campaignData = await getCampaign(userId, campaignId);
        setCampaign(campaignData);
        
        // Load regions/buildings for this campaign
        const regionsList = await getBuildingsRegions(userId, campaignId);
        setCampaignRegions(regionsList || []);
        
        // Load events for this campaign
        const eventsList = await getEvents(userId, campaignId);
        setEvents(eventsList || []);
        
        // Load specific location if locationId is provided
        if (locationId) {
          const locationsList = await getLocations(userId, campaignId);
          const foundLocation = locationsList.find(loc => loc.id === locationId);
          setLocation(foundLocation || null);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [campaignId, locationId, userId]);

  // Set up session cleanup callback
  useEffect(() => {
    setSessionCleanupCallback((code) => {
      // Don't delete session automatically - only delete when explicitly ending session
      console.log("Session cleanup callback called for code:", code, "- not deleting automatically");
    });
  }, []);

  // Get existing session code when component mounts (don't auto-generate)
  useEffect(() => {
    if (userId && campaignId) {
      // Only get existing session code, don't generate new one
      // Map_Location should not auto-start session when navigating
      const code = getExistingSessionCode(userId, campaignId);
      setSessionCode(code || '');
    }
  }, [userId, campaignId]);

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

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Don't delete session on unmount - only delete when explicitly ending session
      releaseMapPage();
    };
  }, []);

  // Update session with location data when component mounts or location changes
  useEffect(() => {
    const updateSessionWithLocation = async () => {
      if (isSessionActive() && locationId) {
        const sessionCode = getExistingSessionCode(userId, campaignId);
        
        if (sessionCode) {
          try {
            const updateData = {
              locationActive: true,
              locationUserId: userId,
              locationCampaignId: campaignId,
              locationId: locationId,
              // Clear other view states
              battleMapActive: false,
              buildingRegionActive: false
            };
            console.log("Map_Location: Sending update to session:", updateData);
            await updateSessionBattleMap(sessionCode, updateData);
            console.log("Map_Location: Update sent successfully");
          } catch (error) {
            console.error("Failed to update session with location data:", error);
          }
        }
      }
    };

    updateSessionWithLocation();
  }, [userId, campaignId, locationId]);

  // Clean up location data when component unmounts
  useEffect(() => {
    return () => {
      const cleanupLocation = async () => {
        if (isSessionActive() && locationId) {
          const sessionCode = getExistingSessionCode(userId, campaignId);
          if (sessionCode) {
            try {
              await updateSessionBattleMap(sessionCode, {
                locationActive: false,
                locationUserId: null,
                locationCampaignId: null,
                locationId: null
              });
            } catch (error) {
              console.error("Failed to clear session location data:", error);
            }
          }
        }
      };

      cleanupLocation();
    };
  }, [userId, campaignId, locationId]);

  const toggleRegions = () => {
    setRegionsOpen(!regionsOpen);
    if (eventsDropdownOpen) setEventsDropdownOpen(false);
  };

  const toggleEventsDropdown = () => {
    setEventsDropdownOpen(!eventsDropdownOpen);
    if (regionsOpen) setRegionsOpen(false);
  };

  const handleEventSelect = (event) => {
    navigate(`/user/Map_Battle_View_DM/${campaignId}/${event.mapId}`);
    setEventsDropdownOpen(false);
  };

  const selectRegion = (region) => {
    setSelectedRegion(region);
    setRegionsOpen(false);
    if (region) {
      navigate(`/user/Map_Building_Region/${campaignId}/${region.id}`);
    }
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

            {/* Regions Dropdown */}
            <div className="map-locations-dropdown">
              <button
                className={`locations-toggle ${regionsOpen ? "open" : ""}`}
                onClick={toggleRegions}
              >
                Regions
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {regionsOpen && (
                <div className="locations-buttons-container">
                  {campaignRegions.filter(region => region.locationId === locationId).length > 0 ? (
                    campaignRegions.filter(region => region.locationId === locationId).map((region) => (
                      <button
                        key={region.id}
                        className="location-button"
                        onClick={() => selectRegion(region)}
                      >
                        {region.name}
                      </button>
                    ))
                  ) : (
                    <div className="no-locations-message">
                      No regions added to this location yet
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
              {loading ? (
                <div className="map-placeholder">
                  <p>Loading map...</p>
                </div>
              ) : location?.imageUrl ? (
                <img
                  src={location.imageUrl}
                  alt={`Location: ${location.name || 'Unnamed Location'}`}
                  className="map-image"
                />
              ) : locationId ? (
                <div className="map-placeholder">
                  <p>No image uploaded for this location</p>
                  <small>Add an image in the Map Builder to see it here</small>
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

export default Map_Location;