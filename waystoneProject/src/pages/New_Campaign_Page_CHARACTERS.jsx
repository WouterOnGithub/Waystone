import React, { useState } from "react";
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

function New_Campaign_Page_CHARACTERS() {
  const {campaignId} = useParams()
  const navigate = useNavigate();

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

  const [players, setPlayers] = useState([
    { name: "Player_1", level: 3, hp: 19 },
    { name: "Player_2", level: 1, hp: 15 },
  ]);

  const [npcs] = useState([
    { name: "NPC_1", job: "blacksmith" },
    { name: "NPC_2", job: "librarian" },
  ]);

  const [enemies] = useState([
    { name: "Enemy", cr: 5, hp: 12 },
    { name: "Enemy", cr: 3, hp: 15 },
  ]);

  return (
    <div className="campaign-page">
      <Sidebar />
      <div className="campaign-main">
        <Header title="New Campaign" />
        <div className="campaign-body">
          <div className="campaign-tabs">
            <button 
              className="campaign-tab"
              disabled={!campaignId}
              onClick={() => navigate(`/user/New_Campaign_Page_CAMPAIGN/${campaignId}`)}
            >
              Campaign
            </button>

            <button
              className="campaign-tab"
              disabled={!campaignId}
              onClick={() => navigate(`/user/New_Campaign_Page_MAPBUILDER/${campaignId}`)}
            >
              Map Builder
            </button>

            <button
              className="campaign-tab active"
              disabled={!campaignId}
              onClick={() => navigate(`/user/New_Campaign_Page_CHARACTERS/${campaignId}`)}
            >
              Characters
            </button>
          </div>

          <div className="campaign-card">
            <h3>Characters</h3>

            <div className="character-section">
              <h4>Players</h4>
              {players.map((player, index) => (
                <div key={index} className="character-row">
                  <span>{player.name} | lvl {player.level} | HP {player.hp}</span>
                  <button className="edit-button">edit</button>
                </div>
              ))}
              <button className="add-button" onClick={addPlayer}>add Player</button>
            </div>

            <div className="character-section">
              <h4>NPCs</h4>
              {npcs.map((npc, index) => (
                <div key={index} className="character-row">
                  <span>{npc.name} | Job: {npc.job}</span>
                  <button className="edit-button" onClick={handleEditNpc}>edit</button>
                </div>
              ))}
              <button className="add-button" onClick={handleAddNpc}>add NPC</button>
            </div>

            <div className="character-section">
              <h4>Custom Enemies</h4>
              {enemies.map((enemy, index) => (
                <div key={index} className="character-row">
                  <span>{enemy.name} | CR {enemy.cr} | HP {enemy.hp}</span>
                  <button className="edit-button" onClick={handleEditEnemy}>edit</button>
                </div>
              ))}
              <button className="add-button" onClick={handleAddEnemy}>add enemy</button>
            </div>

            <div className="campaign-actions">
              <button className="campaign-save">Save and Continue</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default New_Campaign_Page_CHARACTERS;
