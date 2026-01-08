  import React, { useState, useEffect } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import { db } from "../firebase/firebase";
  import { doc } from "firebase/firestore";
  import { useAuth } from "../context/AuthContext.jsx";
  import { getPlayersByCampaign, deletePlayerAndSubCollections } from "../api/players";
  import { getEntitiesByType, deleteEntityAndSubCollections } from "../api/npcs";
  import { useCampaign } from "../hooks/useCampaign";
  import { getCampaign } from "../api/userCampaigns";
  import "./pages-css/CSS.css";
  import "./pages-css/Main_Page.css";
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

    const [players, setPlayers] = useState([]);
    const [npcs, setNPCs] = useState([]);
    const [enemies, setEnemies] = useState([]);

    useEffect(() => {
    if (!userId || !campaignId) return;

    const fetchData = async () => {
      try {
        const playerData = await getPlayersByCampaign(userId, campaignId);
        const npcData = await getEntitiesByType(userId, campaignId, "npc");
        const enemyData = await getEntitiesByType(userId, campaignId, "enemy");

        setPlayers(playerData);
        setNPCs(npcData);
        setEnemies(enemyData);
      } catch (error) {
        console.error("Error loading characters: ", error);
      }
    };

    fetchData();
    }, [userId, campaignId]);

    const handleAddPlayer = () => {
      navigate(`/user/${campaignId}/Add_Character`);
    };
    const handleEditPlayer = (playerId) => {
      navigate(`/user/${campaignId}/Add_Character/${playerId}`);
    };

    const handleAddNpc = () => {
      navigate(`/user/${campaignId}/Add_NPC`);
    };
    const handleEditNpc = (npcId) => {
      navigate(`/user/${campaignId}/Add_NPC/${npcId}`);
    };

    const handleAddEnemy = () => {
      navigate(`/user/${campaignId}/Add_Enemy`);
    }
    const handleEditEnemy = (enemyId) => {
      navigate(`/user/${campaignId}/Add_Enemy/${enemyId}`);
    }

    const handleDeleteNpc = async (npcId) => {
      if (!window.confirm("Are you sure you want to delete this NPC?")) return;

      try {
        const npcRef = doc(db, "Users", userId, "Campaigns", campaignId, "Entities", npcId);
        await deleteEntityAndSubCollections(npcRef);
        setNPCs(npcs.filter(npc => npc.id !== npcId));
      } catch (error) {
        console.error("Error deleting NPC:", error);
      }
    };

    const handleDeleteEnemy = async (enemyId) => {
      if (!window.confirm("Are you sure you want to delete this Enemy?")) return;

      try {
        const enemyRef = doc(db, "Users", userId, "Campaigns", campaignId, "Entities", enemyId);
        await deleteEntityAndSubCollections(enemyRef);
        setEnemies(enemies.filter(enemy => enemy.id !== enemyId));
      } catch (error) {
        console.error("Error deleting Enemy:", error);
      }
    };


    


    return (
      <div className="full-page">

          <Sidebar />

          <div id="main">

          <Header
            title={
                isNewCampaign
                  ? "New Campaign" : data?.name ? `${data.name}` : "Campaign"
            } />

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

                <div className="character-section">
                  <b>Players</b>
                  <br />
                  {players.map((player, index) => (
                    <div key={index} className="character-row">
                      <span>{player.name} | lvl {player.level} | HP  {player.HpCurrent} / {player.HpMax}</span>
                      <div>
                        <button id="button-gray" onClick={() => handleEditPlayer(player.id)}>edit</button>
                        <button id="button-gray" onClick={() => handleDeletePlayer(player.id)}>delete</button>
                      </div>
                    </div>
                  ))}
                  <button id="button-green" onClick={handleAddPlayer}>add Player</button>
                </div>

              {/* The npc's */}
                <div className="character-section">
                  <b>NPC's</b>
                  <br />
                  {npcs.map((npc) => (

                  /* The npc bar */
                    <div key={npc.id} className="character-row">
                      <span>{npc.name} | Race: {npc.race}</span>
                      <div>
                        <button id="button-gray" onClick={() => handleEditNpc(npc.id)}>edit</button>
                        <button id="button-gray" onClick={() => handleDeleteNpc(npc.id)}>delete</button>
                      </div>
                    </div>

                  ))}
                {/* To add another npc */}
                  <button id="button-green" onClick={handleAddNpc}>add NPC</button>
                </div>

                <div className="character-section">
                  <b>Custom Enemies</b>
                  <br />
                  {enemies.map((enemy) => (
                    <div key={enemy.id} className="character-row">
                      <span>{enemy.name} | CR {enemy.cr} | HP {enemy.hp}</span>
                      <div>
                        <button id="button-gray" onClick={() => handleEditEnemy(enemy.id)}>edit</button>
                        <button id="button-gray" onClick={() => handleDeleteEnemy(enemy.id)}>delete</button>
                      </div>
                    </div>
                  ))}
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