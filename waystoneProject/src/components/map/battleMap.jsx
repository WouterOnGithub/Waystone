import React, { useState } from "react";
import useMapCells from "../../hooks/subcribeToCell"; // adjust if named export
import {useMap} from "../../hooks/subcribeToCell";       // adjust if named export
import { generateGrid } from "../../utils/generateGrid";
import Token from "../character/token";
import { moveToken } from "../../services/mapServices";

export default function BattleMap({ userId, campaignId, mapId }) {
  const map = useMap(userId, campaignId, mapId);
  const cellsData = useMapCells(userId, campaignId, mapId);
  const [selectedToken, setSelectedToken] = useState(null);

  // Wait for map to load before creating grid
  if (!map) return <div>Loading map...</div>;
    if (!cellsData) return <div>Loading cells…</div>;


    console.log("Map:", map);
console.log("Cells data:", cellsData);

  // generateGrid(cellsData, width, height)
  const grid = generateGrid(cellsData, map.height, map.width);  
  console.log("Grid:", grid);

  

  const handleCellClick = async (x, y, cell) => {
    if (selectedToken) {
      // Move selected token to clicked cell
      await moveToken(
        userId,
        campaignId,
        mapId,
        selectedToken.tokenId,
        selectedToken.x,
        selectedToken.y,
        x,
        y
      );
      setSelectedToken(null);
    } else if (cell?.tokenId) {
      // Select token in this cell
      setSelectedToken({ tokenId: cell.tokenId, x, y });
    }
  };


console.log("Grid:", grid);

  return (
    <div className="grid-container">
      {grid.map((row, y) => (
        <div key={y} className="grid-row" style={{ display: "flex" }}>
          {row.map((cell, x) => (
            <div
              key={x}
              onClick={() => handleCellClick(x, y, cell)}
              className="grid-cell"
              style={{
                width: 50,
                height: 50,
                border: "1px solid #555",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  selectedToken && selectedToken.x === x && selectedToken.y === y
                    ? "#ffd"
                    : "#eee",
              }}
            >
              {cell?.tokenId && <Token tokenId={cell.tokenId} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}