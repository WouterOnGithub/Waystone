import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSession, subscribeToSessionStatus } from "../api/userCampaigns";
import { useAuth } from "../context/AuthContext";
import { getBuildingsRegions } from "../api/userCampaigns";

function Map_Building_Region_Player() {
  const { sessionCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid || null;
  
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNavMenu, setShowNavMenu] = useState(false);
  const navMenuRef = useRef(null);
  const [building, setBuilding] = useState(null);

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
        } else if (!data.buildingRegionActive) {
          setError("The dungeon master hasn't opened a building/region view yet");
        } else {
          setSessionData(data);
          
          // Load building/region data if available
          if (data.buildingRegionCampaignId && data.buildingRegionId) {
            try {
              const regionsList = await getBuildingsRegions(data.buildingRegionUserId, data.buildingRegionCampaignId);
              const foundBuilding = regionsList.find(building => building.id === data.buildingRegionId);
              setBuilding(foundBuilding || null);
            } catch (error) {
              console.error("Failed to load building/region:", error);
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
      } else if (data.locationActive) {
        console.log("Location is active, redirecting to location view");
        navigate(`/user/Map_Location_Player/${sessionCode}`);
        return;
      } else if (!data.buildingRegionActive) {
        console.log("Building region is no longer active, redirecting to main map");
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
          {/* Leave Session Button */}
          <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
            <button
              onClick={() => navigate("/user/Join_Session")}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              Leave Session
            </button>
          </div>

          {/* Map Display */}
          <div className="map-display">
            {loading ? (
              <div className="map-placeholder">
                <p>Loading building/region...</p>
              </div>
            ) : error ? (
              <div className="map-placeholder">
                <p style={{ color: 'red' }}>{error}</p>
                <button 
                  onClick={() => navigate("/user/Join_Session")}
                  style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Leave Session
                </button>
              </div>
            ) : building?.imageUrl ? (
              <img
                src={`${building.imageUrl}?v=${Date.now()}`}
                alt={`Building/Region: ${building.name || 'Unnamed Building/Region'}`}
                className="map-image"
              />
            ) : sessionData?.buildingRegionId ? (
              <div className="map-placeholder">
                <p>No image uploaded for this building/region</p>
                <small>The dungeon master hasn't uploaded an image for this building/region yet</small>
              </div>
            ) : (
              <div className="map-placeholder">
                <p>Building/region data not available</p>
              </div>
            )}

            {/* Compass */}
            {!loading && !error && (building?.imageUrl || sessionData?.buildingRegionId) && (
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

export default Map_Building_Region_Player;
