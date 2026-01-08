import React from "react";
import { useParams } from "react-router-dom";
import BattleMap from "../components/map/battleMap";
import BattleMapWithSidebar from "../components/map/battleMapWithSidebar";

function Map_Battle_View_DM() {
  const { campaignId, eventMapId } = useParams();
  
  // If no campaignId or eventMapId provided, use fallback values for backward compatibility
  const userId = "6v5VMJwiBgQjsAMLc42PBe7Krmd2";
  const finalCampaignId = campaignId || "gFOfbenj1aCJX46ZuJm8";
  const finalMapId = eventMapId || "abcdefg";
  
  return <BattleMapWithSidebar userId={userId} campaignId={finalCampaignId} mapId={finalMapId} />;
}

export default Map_Battle_View_DM; 