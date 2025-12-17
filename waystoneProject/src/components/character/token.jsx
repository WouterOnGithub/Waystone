import React from "react";


export default function Token({ tokenId, tokenImageUrl, x, y, onDragStart }) {
  return (
    <div
      className="token"
      draggable
      onDragStart={() => onDragStart(tokenId, x, y)}
      style={{ cursor: "grab" }}
    >
      {tokenImageUrl ? <img src={tokenImageUrl} alt={tokenId} /> : <span>{tokenId}</span>}
    </div>
  );
}

//alt = tokenid