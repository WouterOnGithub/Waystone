import React from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Add_View.css";
import Required_Logo from "../assets/Required_Logo.webp";

function Game_Settings_SAVEGAME() 
{
  return (
    <div id="addview-page">
    <div id="addview-box">

      <p id="addview-title">Save Game</p>

      <div id="addview-content">

        <form id="input-box-gray" className="game-settings-content">
            <br /><br />

            <label htmlFor="name-savegame"><b>Name</b></label> <img src={Required_Logo} alt="Required_Logo" id="Required_Logo" /> <br />
            <input type="text" id="name-savegame"/> 
            
            <br /><br />
                        
            <div id="addview-discription">
                <label htmlFor="discription-savegame"><b>Discription</b> (max. 150 characters)</label> <br />
                <textarea name="discription-savegame" id="discription-savegame" maxlength="150"></textarea>
            </div>

            <br /><br />
                <button id="button-green">Save</button>
                <button id="button-green">Back</button>
            <br /><br />
            <br /><br />
        </form>

      </div>
    </div>
    </div>
  );
}

export default Game_Settings_SAVEGAME;