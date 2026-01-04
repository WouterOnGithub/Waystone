import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/New_Campaign_Page_CAMPAIGN.css";
import Footer from "../components/UI/Footer";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";

function New_Campaign_Page_CHARACTERS() 
{
  const {campaignId} = useParams()
  const navigate = useNavigate();

  const handleAddPlayer = () => {
    navigate(`/user/${campaignId}/Add_Character`);
  };

  const handleEditPlayer = (playerId) => {
    navigate(`/user/${campaignId}/Add_Character/${playerId}`);
  };

  const [npcs, setNpcs] = useState([
    { name: "NPC_1", job: "blacksmith" },
    { name: "NPC_2", job: "librarian" },
  ]);

  const [enemies, setEnemies] = useState([
    { name: "Enemy", cr: 5, hp: 12 },
    { name: "Enemy", cr: 3, hp: 15 },
  ]);

  const addPlayer = () => {
    setPlayers([...players, { name: `Player_${players.length + 1}`, level: 1, hp: 10 }]);
  };

  const addNpc = () => {
    setNpcs([...npcs, { name: `NPC_${npcs.length + 1}`, job: "" }]);
  };

  const addEnemy = () => {
    setEnemies([...enemies, { name: "Enemy", cr: 1, hp: 10 }]);
  };

  const [players, setPlayers] = useState([
    { name: "Player_1", level: 1, hp: 10 },
    { name: "Player_2", level: 2, hp: 15 },
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
              <b>Players</b>
              {players.map((player, index) => (
                
                /* The player bar */
                <div key={index} className="character-row">
                  <span>{player.name} | LVL {player.level} | HP {player.hp}</span>
                  <button id="button-gray" onClick={handleEditPlayer}>edit</button>
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
                  <button id="button-gray">edit</button>
                </div>

              ))}
              {/* To add another npc */}
              <button id="button-green" onClick={addNpc}>add NPC</button>
            </div>

            {/* The custom enemies */}
            <div className="character-section">
              <b>Custom enemies</b>
              {enemies.map((enemy, index) => (

                /* The npc bar */
                <div key={index} className="character-row">
                  <span>{enemy.name} | CR {enemy.cr} | HP {enemy.hp}</span>
                  <button id="button-gray">edit</button>
                </div>

              ))}
              {/* To add another npc */}
              <button id="button-green" onClick={addEnemy}>add enemy</button>
            </div>

            <div className="campaign-actions">
              <button id="button-green">Save and Continue</button>
            </div>
          </div>

        </div>

        <Footer />

      </div>
    </div>
  );
}

export default New_Campaign_Page_CHARACTERS;