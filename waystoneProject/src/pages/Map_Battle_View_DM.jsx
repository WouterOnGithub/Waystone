import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BattleMap from "../components/map/battleMap";
import BattleMapWithSidebar from "../components/map/battleMapWithSidebar";
import { updateSessionBattleMap } from "../api/userCampaigns";
import { getSharedSessionCode, getExistingSessionCode, isSessionActive } from "../utils/sessionCode";
import { useAuth } from "../context/AuthContext";
import "./pages-css/CSS.css"
import DiceRoller from "../components/map/diceRoller";
import TurnPanel from "../components/turn/TurnPanel";

function Map_Battle_View_DM() {
  const { campaignId, eventMapId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showNavMenu, setShowNavMenu] = useState(false);
  const navMenuRef = useRef(null);
  
  // Get the authenticated user ID or use fallback for backward compatibility
  const userId = user?.uid;
  const finalCampaignId = campaignId;
  const finalMapId = eventMapId;

  // Update session with battle map data when component mounts
  useEffect(() => {
    const updateSessionWithBattleMap = async () => {
      if (isSessionActive()) {
        const sessionCode = getExistingSessionCode(userId, finalCampaignId);
        if (sessionCode) {
          try {
            await updateSessionBattleMap(sessionCode, {
              battleMapActive: true,
              battleMapUserId: userId,
              battleMapCampaignId: finalCampaignId,
              battleMapId: finalMapId
            });
            console.log("Session updated with battle map data");
          } catch (error) {
            console.error("Failed to update session with battle map data:", error);
          }
        }
      }
    };

    updateSessionWithBattleMap();
  }, [userId, finalCampaignId, finalMapId]);

  // Clean up battle map data when component unmounts
  useEffect(() => {
    return () => {
      const cleanupBattleMap = async () => {
        if (isSessionActive()) {
          const sessionCode = getExistingSessionCode(userId, finalCampaignId);
          if (sessionCode) {
            try {
              await updateSessionBattleMap(sessionCode, {
                battleMapActive: false,
                battleMapUserId: null,
                battleMapCampaignId: null,
                battleMapId: null
              });
              console.log("Session battle map data cleared");
            } catch (error) {
              console.error("Failed to clear session battle map data:", error);
            }
          }
        }
      };

      cleanupBattleMap();
    };
  }, [userId, finalCampaignId]);
  
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
                  navigate(`/user/New_Campaign_Page_CAMPAIGN/${finalCampaignId}`);
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
                Back to Campaign
              </button>
              <button
                onClick={() => {
                  navigate(`/user/Map_Main/${finalCampaignId}`);
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
        <div className="turn-panel-vertical">
          <TurnPanel userId={userId} campaignId={finalCampaignId} mapId={finalMapId} />
        </div>
      </div>
      
      {/* Battle Map Component - Centered */}
      <div style={{ paddingLeft: '25vw', marginTop: '5vh' }}>
        <BattleMapWithSidebar userId={userId} campaignId={finalCampaignId} mapId={finalMapId} />
      </div>
    </div>
  );
}

export default Map_Battle_View_DM; 