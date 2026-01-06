import React from "react";
import { useState } from "react";
import BattleMap from "./battleMap";
import TokenSidebar from "./tokenSidebar";
import  useMapCells  from "../../hooks/subcribeToCell";
import { useAvailablePlayers } from "../../hooks/useAvailablePlayers";

export default function BattleMapWithSidebar({ userId, campaignId, mapId }) {
  const cellsData = useMapCells(userId, campaignId, mapId);
  const availablePlayers = useAvailablePlayers(userId, campaignId, cellsData);
  const [draggedToken, setDraggedToken] = useState(null);

  const handleDragStart = (player) => {
  console.log("Dragging player:", player);
  console.log("player.id:", player.tokenId);
  setDraggedToken({ playerId: player.tokenId});
};

  return (
    <div className="battlemap-page" style={{ display: "flex", gap: "10px" }}>
      <TokenSidebar
  players={availablePlayers}
  onDragStart={handleDragStart}  // pass the function, don’t redefine inline
/>

      <BattleMap
        userId={userId}
        campaignId={campaignId}
        mapId={mapId}
        draggedToken={draggedToken}
        setDraggedToken={setDraggedToken}
      />
    </div>
  );
}

