import React, { useState } from "react";
import useMapCells from "../../hooks/subcribeToCell"; // adjust if named export
import {useMap} from "../../hooks/subcribeToCell";       // adjust if named export
import { generateGrid } from "../../utils/generateGrid";
import Token from "../character/token";
import { moveToken } from "../../services/mapServices";
import TokenMenu from "../character/tokenMenu";
import "./battleMap.css"

export default function BattleMap({ userId, campaignId, mapId }) {
  const map = useMap(userId, campaignId, mapId);
  const cellsData = useMapCells(userId, campaignId, mapId);
  const [draggedToken, setDraggedToken] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);

  if (!map) return <div>Loading map...</div>;

  const grid = generateGrid(cellsData, map.width, map.height);

  const handleDragStart = (tokenId, x, y) => {
    setDraggedToken({ tokenId, x, y });

  };

  const handleDrop = async (x, y) => {
    if (!draggedToken) return;

    await moveToken(
      userId,
      campaignId,
      mapId,
      draggedToken.tokenId,
      draggedToken.x,
      draggedToken.y,
      x,
      y
    );

    setDraggedToken(null);
  };


const handleTokenClick = (tokenId, player, x, y) => {
  // Toggle selection
  if (selectedToken?.tokenId === tokenId) {
    setSelectedToken(null);
  } else {
    // Calculate pixel position for menu
    const cellSize = 50; // adjust to your grid cell size
    setSelectedToken({
      tokenId,
      player,
      position: { x: x * cellSize, y: y * cellSize },
    });
  }
};

  return (
    <div className="grid-container">
      {grid.map((row, y) => (
        <div key={y} className="grid-row" style={{ display: "flex" }}>
          {row.map((cell, x) => (
            <div
              key={x}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(x, y)}
              className="grid-cell"
            >
              {cell?.tokenId && (
                <Token
                userId= {userId}
                  tokenId={cell.tokenId}
                  campaignId={campaignId} 
                  x={x}
                  y={y}
                  onDragStart={handleDragStart}
                  onClick={(tokenId, player) => handleTokenClick(tokenId, player, x, y)}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      {selectedToken && (
  <TokenMenu
  userId={userId}
     playerId={selectedToken.tokenId}
  campaignId={campaignId}
  position={selectedToken.position}
  onClose={() => setSelectedToken(null)}
  />
)}
    </div>
  );
}
