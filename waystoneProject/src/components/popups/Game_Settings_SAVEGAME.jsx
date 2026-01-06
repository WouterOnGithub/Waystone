import React from "react";
import { Link } from "react-router-dom";
import "../../pages/pages-css/CSS.css";
import "../../pages/pages-css/Add_View.css";

function Game_Settings_SAVEGAME() 
{
  return (
    <div id="addview-page">
    <div id="addview-box">

      <p id="addview-title">Save Game</p>

      <div id="addview-content">

        <form id="input-box-gray" className="game-settings-content">
            <br /><br />

            <label htmlFor="name-savegame"><b>Name</b></label><br />
            <input type="text" id="name-savegame"/> 
            
            <br /><br />
                        
            <div id="addview-discription">
                <label htmlFor="discription-savegame"><b>Discription</b> (max. 150 characters)</label> <br />
                <textarea name="discription-savegame" id="discription-savegame" maxlength="150"></textarea>
            </div>

            <br />
                <button id="button-green">Save</button>
                <button id="button-green">Back</button>
                
        </form>

      </div>
    </div>
    </div>
  );
}

export default Game_Settings_SAVEGAME;