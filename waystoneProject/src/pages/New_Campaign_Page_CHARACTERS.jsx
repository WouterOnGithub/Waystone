import React, { useState } from "react";
import "./pages-css/CSS.css";
import "./pages-css/Main_Page.css";
import "./pages-css/New_Campaign_Page_CAMPAIGN.css";
import Footer from "../components/UI/Footer";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";

function New_Campaign_Page_CHARACTERS() {
  const [players, setPlayers] = useState([
    { name: "Player_1", level: 3, hp: 19 },
    { name: "Player_2", level: 1, hp: 15 },
  ]);

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

  return (
    <div className="campaign-page">
      <Sidebar />
      <div className="campaign-main">
        <Header title="New Campaign" />
        <div className="campaign-body">
          <div className="campaign-tabs">
            <button className="campaign-tab">Campaign</button>
            <button className="campaign-tab">Map Builder</button>
            <button className="campaign-tab active">Characters</button>
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
                  <button className="edit-button">edit</button>
                </div>
              ))}
              <button className="add-button" onClick={addNpc}>add NPC</button>
            </div>

            <div className="character-section">
              <h4>Custom Enemies</h4>
              {enemies.map((enemy, index) => (
                <div key={index} className="character-row">
                  <span>{enemy.name} | CR {enemy.cr} | HP {enemy.hp}</span>
                  <button className="edit-button">edit</button>
                </div>
              ))}
              <button className="add-button" onClick={addEnemy}>add enemy</button>
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
