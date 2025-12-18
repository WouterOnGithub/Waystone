import React from "react";
import { usePlayer } from "../../hooks/usePlayer";
import "./token.css"

export default function Token({ userId,tokenId, x, y, onDragStart, onClick, campaignId }) {
  //use user.uid inplace of UID
  const player = usePlayer(userId, campaignId, tokenId);

  if (!player) return null;

  return (
    
    <div
      className="token"
      draggable
      onDragStart={() => onDragStart(tokenId, x, y)}
      onClick={() => onClick(tokenId, player)}
      style={{ cursor: "grab" }}
    >
      <img
        src={player.imageUrl}
        alt={player.name}
        className="token-image"
      />
    </div>
  );
}

//alt = tokenid