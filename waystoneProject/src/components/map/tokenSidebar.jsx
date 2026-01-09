import React from "react";
import SidebarToken from "../character/sidebarToken";
import "./tokenSidebar.css";
import { useState } from "react";
import QuickAddEnemyPopup from "../popups/QuickAddEnemyPopup";
import InitiativePopup from "../turn/InitiativePopup";

export default function TokenSidebar({ players, enemies, npcs, onDragStart , userId, containers, campaignId, mapId, mapCells}) {
  const [showQuickEnemy, setShowQuickEnemy] = useState(false);
  const [showInitiativePopup, setShowInitiativePopup] = useState(false);

  return (
    <div className="token-sidebar">
      <h3>Available Players</h3>
      <div className="token-list">
        {players.map((player) => (
          <SidebarToken
            key={player.id}
            player={player}
            onDragStart={onDragStart}
          />
        ))}
      </div>
      
      <div>
        <h3>Enemies</h3>
        <button onClick={()=> setShowQuickEnemy(prev => !prev)}>
          +
        </button>
      </div>
      
      <div className="token-list">
        {enemies.map((enemy) => (
          <SidebarToken
            key={enemy.id}
            player={enemy}
            onDragStart={onDragStart}
          />
        ))}
      </div>

      
      <h3>Npcs</h3>
      <div className="token-list">
        {npcs.map((npc) => (
          <SidebarToken
            key={npc.id}
            player={npc}
            onDragStart={onDragStart}
          />
        ))}
      </div>

      <h3>Containers</h3>
      <div className="token-list">
        {containers.map(c => <SidebarToken key={c.id} player={c} onDragStart={onDragStart} />)}
      </div>
      {/* --- Knop voor Initiative Popup --- */}
      <button style={{ marginTop: "10px", width: "100%" }} onClick={() => setShowInitiativePopup(true)}>
        Roll for Initiative
      </button>
      
      {/* --- Initiative Popup --- */}
      {showInitiativePopup && (
        <InitiativePopup
          userId={userId}
          campaignId={campaignId}
          mapId={mapId}
          mapCells={mapCells}
          onClose={() => setShowInitiativePopup(false)}
        />
      )}

      <QuickAddEnemyPopup
        isOpen={showQuickEnemy}
        onClose={() => setShowQuickEnemy(false)}
        userId={userId}
        campaignId={campaignId}
      />
      
    </div>
  );
}