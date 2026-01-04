import React from "react";
import { Link } from "react-router-dom";
import "../../pages/pages-css/CSS.css";
import "../../pages/pages-css/Add_View.css";

function Game_Settings() 
{
  return (
    <div id="addview-page">
    <div id="addview-box">

      <p id="addview-title">Game Settings</p>

      <div id="addview-content">

        <form id="input-box-gray" className="game-settings-content">
            <div id="game-settings-options">
                {/* Functionality still needs to be added */}
                {/* The buttons of the game settings */}
                                                {/* onClick navigates back 1 page */}
                <br /><button id="button-icons" onClick={() => navigate(-1)}>Resume Game</button>
                <br /><Link to="/user/Game_Settings_SAVEGAME"><button id="button-icons">Save Game</button></Link>
                <br /><button id="button-icons">New Player</button>
                {/* I'm not sure if help & tutorial is still supposed to be included, can be deleted if not */}
                <br /><button id="button-icons">Help & Tutorial</button>
            </div>

            <br />
                <button id="button-green">Return to Main Menu</button>
        </form>

      </div>
    </div>
    </div>
  );
}

export default Game_Settings;