import React, { useState } from "react";
import BattleMap from "../components/map/battleMap";
import BattleMapWithSidebar from "../components/map/battleMapWithSidebar";
import Game_Settings from "../components/popups/Game_Settings";

function Map_Battle_View() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img 
          src="/Settings.png" 
          alt="Settings" 
          style={{
            width: '24px',
            height: '24px',
            filter: 'invert(1)'
          }}
        />
      </button>

      {/* Battle Map */}
      <BattleMapWithSidebar userId="UID" campaignId="Campaign_ID" mapId="mapsId" />

      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'relative',
            backgroundColor: 'white',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: 3000
              }}
            >
              ×
            </button>
            <Game_Settings />
          </div>
        </div>
      )}
    </div>
  );
}

export default Map_Battle_View; 