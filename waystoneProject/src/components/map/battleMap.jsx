import React, { useState } from "react";
import useMapCells from "../../hooks/subcribeToCell"; // adjust if named export
import {useMap} from "../../hooks/subcribeToCell";       // adjust if named export
import { generateGrid } from "../../utils/generateGrid";
import Token from "../character/token";
import { moveToken } from "../../services/mapServices";

export default function BattleMap({ userId, campaignId, mapId }) {
  const map = useMap(userId, campaignId, mapId);
  const cellsData = useMapCells(userId, campaignId, mapId);
  const [draggedToken, setDraggedToken] = useState(null);

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
              style={{
                width: 50,
                height: 50,
                border: "1px solid #555",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#eee",
                pointerEvents: "auto",
              }}
            >
              {cell?.tokenId && (
                <Token
                  tokenId={cell.tokenId}
                  x={x}
                  y={y}
                  onDragStart={handleDragStart}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
