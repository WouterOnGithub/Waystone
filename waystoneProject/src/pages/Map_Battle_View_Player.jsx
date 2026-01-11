import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BattleMap from "../components/map/battleMap";
import { getSession, subscribeToSessionStatus } from "../api/userCampaigns";
import DiceRoller from "../components/map/diceRoller";
import TurnPanel from "../components/turn/TurnPanel";

function Map_Battle_View_Player() {
  const { sessionCode } = useParams();
  const navigate = useNavigate();
  
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedToken, setDraggedToken] = useState(null);


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
        {/* Dice Roller */}
        <DiceRoller />
      </div>
      
      {/* Bottom Left Turn Panel */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 1000
      }}>
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
