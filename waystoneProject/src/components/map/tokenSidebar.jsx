import React from "react";
import Token from "../character/token";
import "./tokenSidebar.css";

export default function TokenSidebar({ players, onDragStart }) {
  return (
    <div className="token-sidebar">
      <h3>Available Players</h3>
      <div className="token-list">
        {players.map((player) => (
          <Token
            key={player.id}
            tokenId={player.id}
            tokenImageUrl={player.imageUrl}
            onDragStart={() => onDragStart(player)}
          />
        ))}
      </div>
    </div>
  );
}