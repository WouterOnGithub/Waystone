import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSession, subscribeToSessionStatus } from "../api/userCampaigns";
import { useAuth } from "../context/AuthContext";
import { getLocations } from "../api/userCampaigns";

function Map_Location_Player() {
  const { sessionCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid || null;
  
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNavMenu, setShowNavMenu] = useState(false);
  const navMenuRef = useRef(null);
  const [location, setLocation] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
        setShowNavMenu(false);
      }
    };
    
    if (showNavMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNavMenu]);

  // Load session data when component mounts
  useEffect(() => {
    const loadSession = async () => {
      if (!sessionCode) {
        setError("No session code provided");
        setLoading(false);
        return;
      }

      try {
        const data = await getSession(sessionCode);
        
        if (!data) {
          setError("Invalid session code or session has expired");
        } else if (data.isActive === false) {
          setError("This session is no longer active");
        } else if (!data.locationActive) {
          setError("The dungeon master hasn't opened a location view yet");
        } else {
          setSessionData(data);
          
          // Load location data if available
          if (data.locationCampaignId && data.locationId) {
            try {
              const locationsList = await getLocations(data.locationUserId, data.locationCampaignId);
              const foundLocation = locationsList.find(loc => loc.id === data.locationId);
              setLocation(foundLocation || null);
            } catch (error) {
              console.error("Failed to load location:", error);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load session:", error);
        setError("Failed to load session data");
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionCode]);

  // Monitor session status in real-time
  useEffect(() => {
    if (!sessionCode) return;

    const unsubscribe = subscribeToSessionStatus(sessionCode, (data) => {
      if (!data) {
        // Session was deleted
        console.log("Session deleted, kicking out user");
        navigate("/user/Join_Session");
        return;
      }

      // Check if session has recent heartbeat (within last 45 seconds)
      const now = new Date();
      const lastHeartbeat = data.lastHeartbeat ? new Date(data.lastHeartbeat) : new Date(data.lastUpdated);
      const secondsSinceHeartbeat = (now - lastHeartbeat) / 1000;

      if (secondsSinceHeartbeat > 45) {
        // Owner hasn't sent heartbeat in 45 seconds - session is dead
        console.log("Session owner heartbeat stopped, kicking out user");
        navigate("/user/Join_Session");
        return;
      }

      // Check what view is currently active and redirect if needed
      if (data.battleMapActive) {
        console.log("Battle map is active, redirecting to battle map view");
        navigate(`/user/Map_Battle_View_Player/${sessionCode}`);
        return;
      } else if (data.buildingRegionActive) {
        console.log("Building region is active, redirecting to building region view");
        navigate(`/user/Map_Building_Region_Player/${sessionCode}`);
        return;
      } else if (!data.locationActive) {
        console.log("Location is no longer active, redirecting to main map");
        navigate(`/user/Map_Main_Player/${sessionCode}`);
        return;
      }

      // Update session data if it changed
      setSessionData(data);
    });

    return () => {
      unsubscribe();
    };
  }, [sessionCode, navigate]);

  const handleBack = () => {
    navigate(`/user/Map_Main_Player/${sessionCode}`);
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
              onClick={handleBack}
              title="Go back to main map"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {/* Navigation Button */}
            <div style={{ marginLeft: '10px' }} ref={navMenuRef}>
              <button
                onClick={() => setShowNavMenu(!showNavMenu)}
                style={{
                  backgroundColor: '#2e3d08',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18m-9-9l9 9-9 9"/>
                </svg>
                Navigate
              </button>
              
              {/* Dropdown Menu */}
              {showNavMenu && (
                <div style={{
                  position: 'fixed',
                  top: '65px',
                  left: '80px',
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  minWidth: '150px',
                  zIndex: 1001
                }}>
                  <button
                    onClick={() => {
                      navigate(`/user/Map_Main_Player/${sessionCode}`);
                      setShowNavMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      borderBottom: '1px solid #eee'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Back to Main Map
                  </button>
                  <button
                    onClick={() => {
                      navigate("/user/Join_Session");
                      setShowNavMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Leave Session
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Map Display */}
          <div className="map-display">
            {loading ? (
              <div className="map-placeholder">
                <p>Loading location...</p>
              </div>
            ) : error ? (
              <div className="map-placeholder">
                <p style={{ color: 'red' }}>{error}</p>
                <button 
                  onClick={handleBack}
                  className="back-button"
                  style={{ marginTop: '20px', padding: '10px 20px' }}
                >
                  Back to Main Map
                </button>
              </div>
            ) : location?.imageUrl ? (
              <img
                src={location.imageUrl}
                alt={`Location: ${location.name || 'Unnamed Location'}`}
                className="map-image"
              />
            ) : sessionData?.locationId ? (
              <div className="map-placeholder">
                <p>No image uploaded for this location</p>
                <small>The dungeon master hasn't uploaded an image for this location yet</small>
              </div>
            ) : (
              <div className="map-placeholder">
                <p>Location data not available</p>
              </div>
            )}

            {/* Compass */}
            {!loading && !error && (location?.imageUrl || sessionData?.locationId) && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map_Location_Player;
