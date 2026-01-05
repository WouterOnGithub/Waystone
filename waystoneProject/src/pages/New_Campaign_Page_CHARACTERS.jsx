import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPlayersByCampaign } from "../api/players";
import { useCampaign } from "../hooks/useCampaign";
import { getCampaign } from "../api/userCampaigns";
import "./pages-css/CSS.css";
import "./pages-css/New_Campaign_Page_CAMPAIGN.css";
import Footer from "../components/UI/Footer";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";

function New_Campaign_Page_CHARACTERS() 
{
  const {campaignId} = useParams()
  const navigate = useNavigate();
  const {user} = useAuth();
  const userId = user ? user.uid : null;
  
  const isNewCampaign = !campaignId;
  const { data, loading, error, setData } = useCampaign(
    isNewCampaign? null : userId, 
    isNewCampaign? null : campaignId
  );

  const handleAddPlayer = () => {
    navigate(`/user/${campaignId}/Add_Character`);
  };
  const handleEditPlayer = (playerId) => {
    navigate(`/user/${campaignId}/Add_Character/${playerId}`);
  };

  const handleAddNpc = () => {
    navigate(`/user/${campaignId}/Add_NPC`);
  };
  const handleEditNpc = () => {
    navigate(`/user/${campaignId}/Add_NPC/${npcId}`);
  };

  const handleAddEnemy = () => {
    navigate(`/user/${campaignId}/Add_Enemy`);
  }
  const handleEditEnemy = () => {
    navigate(`/user/${campaignId}/Add_Enemy/${enemyId}`);
  }

  useEffect(() => {
    if (!userId || !campaignId) return;
    const fetchPlayers = async () => {
      try {
        const playerData = await   getPlayersByCampaign(userId, campaignId);
        setPlayers(playerData);
      } catch (error) {
        console.error("Error loading players: ", error);
      }
  };
    fetchPlayers();
  }, [userId, campaignId]);


  const [players, setPlayers] = useState([]);

  const [npcs] = useState([
    { name: "NPC_1", job: "blacksmith" },
    { name: "NPC_2", job: "librarian" },
  ]);

  const [enemies] = useState([
    { name: "Enemy", cr: 5, hp: 12 },
    { name: "Enemy", cr: 3, hp: 15 },
  ]);

  return (
    <div>

      <Sidebar />

      <div id="main">

        <Header title="New Campaign" />

        <div>

          {/* The buttons (campaign, mapbuilder, character)*/}
          <div id="campaign-tabs">

            {/* The campaign button */}
            <button id="campaign-tab" disabled={!campaignId}
                    onClick={() => navigate(`/user/New_Campaign_Page_CAMPAIGN/${campaignId}`)}>
              Campaign
            </button>

            {/* The map builder button */}
            <button id="campaign-tab" disabled={!campaignId}
                    onClick={() => navigate(`/user/New_Campaign_Page_MAPBUILDER/${campaignId}`)}>
              Map Builder
            </button>

            {/* The characters button */}
            <button id="campaign-tab-active" disabled={!campaignId}
                    onClick={() => navigate(`/user/New_Campaign_Page_CHARACTERS/${campaignId}`)}>
              Characters
            </button>

          </div>

          {/* The characters players, npc's and custom enemies */}
          <div id="content">

            {/* The characters */}
            <div className="character-section">
              <b>Players</b><br />
              {players.map((player, index) => (
                
                /* The player bar */
                <div key={index} className="character-row">
                  <span>{player.name} | lvl {player.level} | HP {player.HpCurrent}/{player.HpMax}</span>
                  <button id="button-gray" onClick={() => handleEditPlayer(player.id)}>edit</button>
                </div>

              ))}
              {/* To add another player */}
              <button id="button-green" onClick={handleAddPlayer}>add player</button>
            </div>

            {/* The npc's */}
            <div className="character-section">
              <b>NPC's</b>
              {npcs.map((npc, index) => (

                /* The npc bar */
                <div key={index} className="character-row">
                  <span>{npc.name} | Job: {npc.job}</span>
                  <button id="button-gray" onClick={() => handleEditNpc()}>edit</button>
                </div>

              ))}
              {/* To add another npc */}
              <button id="button-green" onClick={handleAddNpc}>add NPC</button>
            </div>

            {/* The custom enemies */}
            <div className="character-section">
              <b>Custom enemies</b>
              {enemies.map((enemy, index) => (

                /* The npc bar */
                <div key={index} className="character-row">
                  <span>{enemy.name} | CR {enemy.cr} | HP {enemy.hp}</span>
                  <button id="button-gray" onClick={() => handleEditEnemy()}>edit</button>
                </div>

              ))}
              {/* To add another npc */}
              <button id="button-green" onClick={handleAddEnemy}>add enemy</button>
            </div>

            <div className="campaign-actions">
              <button id="button-green">Save and Continue</button>
              <button 
                id="button-gray"
                onClick={() => navigate(`/user/Map_Main/${campaignId}`)}
                disabled={!campaignId}
              >
                Enter
              </button>
            </div>
          </div>

        </div>

        <Footer />

      </div>
    </div>
  );
}

export default New_Campaign_Page_CHARACTERS;
