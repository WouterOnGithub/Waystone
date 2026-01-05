import React from "react";
import BattleMap from "./battleMap";
import TokenSidebar from "./tokenSidebar";
import  useMapCells  from "../../hooks/subcribeToCell";
import { useAvailablePlayers } from "../../hooks/useAvailablePlayers";

export default function BattleMapWithSidebar({ userId, campaignId, mapId }) {
  const cellsData = useMapCells(userId, campaignId, mapId);
  const availablePlayers = useAvailablePlayers(userId, campaignId, cellsData);

  const handleDragStart = (player) => {
    console.log("Dragging player:", player.id);
  };

  return (
    <div className="battlemap-page" style={{ display: "flex", gap: "10px" }}>
      <TokenSidebar players={availablePlayers} onDragStart={handleDragStart} />
      <BattleMap userId={userId} campaignId={campaignId} mapId={mapId} />
    </div>
  );
}
