import React from "react";
import SidebarToken from "../character/sidebarToken";
import "./tokenSidebar.css";

export default function TokenSidebar({ players, onDragStart }) {
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
    </div>
  );
}