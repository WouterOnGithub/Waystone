import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BattleMap from "../components/map/battleMap";
import { getSession, subscribeToSessionStatus } from "../api/userCampaigns";
import { useAuth } from "../context/AuthContext";
import DiceRoller from "../components/map/diceRoller";
import TurnPanel from "../components/turn/TurnPanel";

function Map_Battle_View_Player() {
  const { sessionCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid || null;
  
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNavMenu, setShowNavMenu] = useState(false);
  const navMenuRef = useRef(null);
  const [draggedToken, setDraggedToken] = useState(null);

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
        } else if (!data.battleMapActive) {
          setError("The dungeon master hasn't started a battle map yet");
        } else {
          setSessionData(data);
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
      if (data.locationActive) {
        console.log("Location is active, redirecting to location view");
        navigate(`/user/Map_Location_Player/${sessionCode}`);
        return;
      } else if (data.buildingRegionActive) {
        console.log("Building region is active, redirecting to building region view");
        navigate(`/user/Map_Building_Region_Player/${sessionCode}`);
        return;
      } else if (!data.battleMapActive) {
        console.log("Battle map is no longer active, redirecting to main map");
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
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor : "#f7f6fb" }}>
      {/* Top Left Controls Container */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {/* Navigation Button */}
        <div ref={navMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNavMenu(!showNavMenu)}
            style={{
              backgroundColor: '#2e3d08',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
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
              left: '20px',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '5px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              minWidth: '150px',
              zIndex: 1001
            }}>
              <button
                onClick={() => {
                  handleBack();
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
                  navigate(-1);
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
                Back to Previous Map
              </button>
            </div>
          )}
        </div>
        
        {/* Dice Roller */}
        <DiceRoller />
        
        {/* Turn Panel */}
        {sessionData?.battleMapUserId && sessionData?.battleMapCampaignId && sessionData?.battleMapId && (
          <div className="turn-panel-vertical">
            <TurnPanel userId={sessionData.battleMapUserId} campaignId={sessionData.battleMapCampaignId} mapId={sessionData.battleMapId} />
          </div>
        )}
      </div>
      
      {/* Leave Session Button */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        right: '20px', 
        zIndex: 1000 
      }}>
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
      
      {/* Battle Map Component - Centered */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}>
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontSize: '18px'
          }}>
            Loading battle map...
          </div>
        ) : error ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            textAlign: 'center'
          }}>
            <p style={{ color: 'red', fontSize: '18px', marginBottom: '20px' }}>{error}</p>
            <button 
              onClick={() => navigate("/user/Join_Session")}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Leave Session
            </button>
          </div>
        ) : sessionData?.battleMapUserId && sessionData?.battleMapCampaignId && sessionData?.battleMapId ? (
          <BattleMap 
            userId={sessionData.battleMapUserId}
            campaignId={sessionData.battleMapCampaignId}
            mapId={sessionData.battleMapId}
            draggedToken={draggedToken}
            setDraggedToken={setDraggedToken}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontSize: '18px'
          }}>
            Battle map data not available
          </div>
        )}
      </div>
    </div>
  );
}

export default Map_Battle_View_Player;
