import React from "react";
import { useState } from "react";
import BattleMap from "./battleMap";
import TokenSidebar from "./tokenSidebar";
import  useMapCells  from "../../hooks/subcribeToCell";
import { useAvailablePlayers } from "../../hooks/useAvailablePlayers";
import {useEntitiesByType } from "../../hooks/useEntitiesByType";
import { useContainers } from "../../hooks/useContainers";
import Game_Settings from "../popups/Game_Settings";

export default function BattleMapWithSidebar({ userId, campaignId, mapId }) {
  const cellsData = useMapCells(userId, campaignId, mapId);
  const availablePlayers = useAvailablePlayers(userId, campaignId, cellsData);
  const [draggedToken, setDraggedToken] = useState(null);
  const enemies = useEntitiesByType(userId, campaignId, "enemy",cellsData);
  const npcs = useEntitiesByType(userId, campaignId, "npc",cellsData);
  const containers = useContainers(userId, campaignId, cellsData);

  const handleDragStart = (player) => {
  setDraggedToken({ tokenId: player.tokenId});
};

  return (
    
    <div className="battlemap-page" style={{ display: "flex", justifyContent: "center", gap: "10px", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <BattleMap
          userId={userId}
          campaignId={campaignId}
          mapId={mapId}
          draggedToken={draggedToken}
          setDraggedToken={setDraggedToken}
        />
      </div>
      <TokenSidebar
         players={availablePlayers}
        enemies = {enemies}
        npcs = {npcs}
        onDragStart={handleDragStart}
        userId={userId}
        containers={containers}
        campaignId={campaignId}
        mapId={mapId}
        mapCells={cellsData}
      />
    </div>
  );
}

