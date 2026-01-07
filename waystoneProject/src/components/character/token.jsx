import React from "react";
import { usePlayer, useEntity } from "../../hooks/usePlayerMap";
import "./token.css"

export default function Token({ userId,tokenId, x, y, onDragStart, onClick, campaignId }) {
  //use user.uid inplace of UID
  const player = usePlayer(userId, campaignId, tokenId);
  const entity = useEntity(userId,campaignId,tokenId)
  
  const data = player || entity;

  if (!data) return null;



  return (
    
    <div
      className="token"
      draggable
      onDragStart={() => onDragStart(tokenId, x, y)}
      onClick={() => onClick(tokenId, player)}
      style={{ cursor: "grab" }}
    >
      <img
        src={data.imageUrl}
        alt={data.name}
        className="token-image"
      />
    </div>
  );
}

//alt = tokenid