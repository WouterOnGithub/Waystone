  import React, { useState, useEffect } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import "./pages-css/CSS.css";
  import "./pages-css/Main_Page.css";
  import "./pages-css/New_Campaign_Page_CAMPAIGN.css";
  import Footer from "../components/UI/Footer";
  import Header from "../components/UI/Header";
  import Sidebar from "../components/UI/Sidebar";
  import Waystone_Logo from "../assets/PlaceholderImage.jpg";
  import UploadIMG_Logo from "../assets/PlaceholderImage.jpg";
  import Required_Logo from "../assets/Required_Logo.webp";
  import Delete_Logo from "../assets/Delete_Logo.webp";
  import Add_Logo from "../assets/Add_Logo.webp";
  import Placeholder from "../assets/PlaceholderImage.jpg";

  import { db } from "../firebase/firebase";
  import { doc } from "firebase/firestore";
  import { useAuth } from "../context/AuthContext";
  import { getPlayersByCampaign, deletePlayerAndSubCollections } from "../api/players";
  import { getEntitiesByType } from "../api/npcs";
  import { useCampaign } from "../hooks/useCampaign";
  import { getCampaign } from "../api/userCampaigns";

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
    const handleEditNpc = (npcId) => {
      navigate(`/user/${campaignId}/Add_NPC/${npcId}`);
    };

    const handleAddEnemy = () => {
      navigate(`/user/${campaignId}/Add_Enemy`);
    }
    const handleEditEnemy = (enemyId) => {
      navigate(`/user/${campaignId}/Add_Enemy/${enemyId}`);
    }

    const handleDeletePlayer = async (playerId) => {
      if (!window.confirm("Are you sure you want to delete this player?")) return;

      try {
        const playerRef = doc(db, "Users", userId, "Campaigns", campaignId, "Players", playerId);
        await deletePlayerAndSubCollections(playerRef);
        setPlayers(players.filter(player => player.id !== playerId));
      } catch (error) {
        console.error("Error deleting player:", error);
      }
    };


    useEffect(() => {
      if (!userId || !campaignId) return;
      const fetchData = async () => {
        try {
          //playerss
          const playerData = await getPlayersByCampaign(userId, campaignId);
          const npcData =await getEntitiesByType(userId, campaignId,"npc");
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

    const [players, setPlayers] = useState([]);
    const [npcs, setNPCs] = useState([]);
    const [enemies, setEnemies] = useState([]);

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-wrapper">
        <div id="main">

        <Header
          title={
              isNewCampaign
                ? "New Campaign" : data?.name ? `${data.name}` : "Campaign"
          } />
        </div>

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
                <h4>Players</h4>
                {players.map((player, index) => (
                  <div key={index} className="character-row">
                    <span>{player.name} | lvl {player.level} | Hp  {player.HpCurrent}/{player.HpMax}</span>
                    <button className="edit-button" onClick={() => handleEditPlayer(player.id)}>edit</button>
                    <button className="delete-button" onClick={() => handleDeletePlayer(player.id)}>delete</button>
                  </div>
                ))}
                <button className="add-button" onClick={handleAddPlayer}>add Player</button>
              </div>

            {/* The npc's */}
              <div className="character-section">
                <b>NPC's</b>
                {npcs.map((npc) => (

                /* The npc bar */
                  <div key={npc.id} className="character-row">
                    <span>{npc.name} | race: {npc.race}</span>
                    <button id="edit-button" onClick={() => handleEditNpc(npc.id)}>edit</button>
                  </div>

                ))}
              {/* To add another npc */}
                <button id="button-green" onClick={handleAddNpc}>add NPC</button>
              </div>

              <div className="character-section">
                <h4>Custom Enemies</h4>
                {enemies.map((enemy) => (
                  <div key={enemy.id} className="character-row">
                    <span>{enemy.name} | CR {enemy.cr} | HP {enemy.hp}</span>
                    <button className="edit-button" onClick={() => handleEditEnemy(enemy.id)}>edit</button>
                  </div>
                ))}
                <button className="button-green" onClick={handleAddEnemy}>add enemy</button>
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
    </div>
  );
}

  export default New_Campaign_Page_CHARACTERS;
