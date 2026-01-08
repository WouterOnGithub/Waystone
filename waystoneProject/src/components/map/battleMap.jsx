import React, { useState } from "react";
import useMapCells from "../../hooks/subcribeToCell"; // adjust if named export
import {useMap} from "../../hooks/subcribeToCell";       // adjust if named export
import { generateGrid } from "../../utils/generateGrid";
import Token from "../character/token";
import { moveToken } from "../../services/mapServices";
import TokenMenu from "../character/tokenMenu";
import { doc, setDoc} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "./battleMap.css"
import TurnPanel from "../turn/TurnPanel";

export default function BattleMap({ userId, campaignId, mapId, draggedToken, setDraggedToken}) {
  const map = useMap(userId, campaignId, mapId);
  const cellsData = useMapCells(userId, campaignId, mapId);
  const [selectedToken, setSelectedToken] = useState(null);
   const cellSize = 80;
  if (!map) return <div>Loading map...</div>;

  const grid = generateGrid(cellsData, map.width, map.height);

  const handleDragStart = (tokenId, x, y) => {
    setDraggedToken({ tokenId, x, y });

  };

  const handleDrop = async (x, y) => {
    if (!draggedToken) return;

    if (  draggedToken.type === "new") {
      // New sidebar token
      const newCell = doc(db, "Users", userId, "Campaigns", campaignId, "Maps", mapId, "Cells", `${x}_${y}`);
      await setDoc(newCell, { tokenId: draggedToken.tokenId });
    } else {
      // Existing token
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
    }

    setDraggedToken(null);
  };


  const handleTokenClick = (tokenId, data, x, y) => {
    if (selectedToken?.tokenId === tokenId) {
      setSelectedToken(null);
    } else {
      setSelectedToken({
        tokenId,
        data,
        position: { x: x * cellSize, y: y * cellSize },
        gridPosition: { x , y  }
      });
    }
  };

 return (
  <>
      {/* === TURN BAR (Sticky Floating UI) === */}
      <TurnPanel userId={userId} campaignId={campaignId} mapId={mapId} />

      <div
        className="battlemap-wrapper"
        style={{
          width: map.width * cellSize,
          height: map.height * cellSize,
        }}
      >
        <img
          src={map.imageUrl}
          alt="Battle Map"
          className="battlemap-image"
          draggable={false}
        />

    {/* Grid overlay */}
    <div className="grid-container">
      {grid.map((row, y) => (
        <div key={y} className="grid-row">
          {row.map((cell, x) => (
            <div
              key={x}
              className="grid-cell"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(x, y)}
            >
              {cell?.tokenId && (
                <Token
                  userId={userId}
                  tokenId={cell.tokenId}
                  campaignId={campaignId}
                  x={x}
                  y={y}
                  onDragStart={handleDragStart}
                  onClick={(tokenId, data) =>
                    handleTokenClick(tokenId, data, x, y)
                  }
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>

    {selectedToken && (
      <TokenMenu
        userId={userId}
        playerId={selectedToken.tokenId}
        campaignId={campaignId}
        mapId={mapId}
        data={selectedToken.data} 
        tokenId={selectedToken.tokenId}
        position={selectedToken.position}
        posX={selectedToken.gridPosition.x}
        posY={selectedToken.gridPosition.y}
        onClose={() => setSelectedToken(null)}
      />
    )}
  </div>
  </>
);

}
