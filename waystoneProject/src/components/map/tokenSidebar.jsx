import React from "react";
import SidebarToken from "../character/sidebarToken";
import "./tokenSidebar.css";

export default function TokenSidebar({ players, enemies, npcs, onDragStart }) {
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

  <h3>Enemies</h3>
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
</div>
  );
}