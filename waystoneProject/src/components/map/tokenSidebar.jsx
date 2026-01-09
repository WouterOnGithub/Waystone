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

    {/* Players */}
    <section>
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
    </section>

    {/* Enemies */}
    <section>
      <div className="sidebar-header-row">
        <h3>Enemies</h3>
        <button
          className="add-token-btn"
          onClick={() => setShowQuickEnemy(prev => !prev)}
        >
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
    </section>

    {/* NPCs */}
    <section>
      <h3>NPCs</h3>
      <div className="token-list">
        {npcs.map((npc) => (
          <SidebarToken
            key={npc.id}
            player={npc}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </section>

    {/* Containers */}
    <section>
      <h3>Containers</h3>
      <div className="token-list">
        {containers.map((c) => (
          <SidebarToken
            key={c.id}
            player={c}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </section>

    {/* Initiative */}
    <button
      className="initiative-btn"
      onClick={() => setShowInitiativePopup(true)}
    >
      Roll for Initiative
    </button>

    {/* Popups */}
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
);}
