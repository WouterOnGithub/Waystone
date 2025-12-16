/*I am unique*/
import React from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Add_View.css";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import UploadIMG_Logo from "../assets/PlaceholderImage.jpg";
import Required_Logo from "../assets/Required_Logo.webp";
import Delete_Logo from "../assets/Delete_Logo.webp";
import Minus_Logo from "../assets/Minus_Logo.png";
import Add_Logo from "../assets/Add_Logo.webp";
import Placeholder from "../assets/PlaceholderImage.jpg";

function View_Character() 
{
  return (
    <div id="addview-page">
    <div id="addview-box">

      <p id="addview-title">John Doe</p>

      <div id="addview-content">

        <form id="input-box-gray">
            <div id="addview-stats">
                <div>
                    <div>
                        <div id="addview-stats" className="view-stats-main">
                            <div><b id="view-stats-main-title" className="view-stats-main-title-1">HP</b></div>
                            <div><p className="view-hp">20 <b>/20</b></p></div> {/* the HP later replaced by real value */}
                        </div>
                        <div id="addview-stats" className="view-stats-main">
                            <div><b id="view-stats-main-title" className="view-stats-main-title-2">LVL</b></div>
                            <div><p>1 </p></div> {/* the LVL later replaced by real value */}
                        </div>
                        <div id="addview-stats" className="view-stats-main">
                            <div><b id="view-stats-main-title" className="view-stats-main-title-3">EXP</b></div>
                            <div><p>0 </p></div> {/* the EXP later replaced by real value */}
                        </div>
                        <div id="addview-stats" className="view-stats-main">
                            <div>
                                <b id="view-stats-main-title" className="view-stats-main-title-4">STATUS</b>
                                <p id="view-status-body">Effect_Name</p> {/* the STATUS later replaced by real value */}
                                {/* Example of second effect, to be deleted later when functionality is added */}
                                <p id="view-status-body">Effect_Name </p> {/* the STATUS later replaced by real value */}
                            </div> 
                        </div>
                    </div>
                </div>

                <div id="view-paragraph-section" >
                    {/* Required_Logo is here functioning as an Info_Logo, clicking on it should open the View_Item */}
                    <b>INVENTORY</b> <button id="button-icons"><img src={Add_Logo} alt="Add_Logo" id="Add_Logo"/></button>
                    <div id="addview-stats">
                        <div><p>A small stick</p></div> 
                        <div><button id="button-icons"><img src={Required_Logo} alt="Required_Logo" id="Required_Logo" className="view-required-logo"/></button> <button id="button-icons"><img src={Minus_Logo} alt="Minus_Logo" id="Minus_Logo"/></button></div>
                    </div>
                    {/* Example of second item, to be deleted later when functionality is added */}
                    <div id="addview-stats">
                        <div><p>[Item_placeholder]</p></div> 
                        <div><button id="button-icons"><img src={Required_Logo} alt="Required_Logo" id="Required_Logo" className="view-required-logo"/></button> <button id="button-icons"><img src={Minus_Logo} alt="Minus_Logo" id="Minus_Logo"/></button></div>
                    </div>
                </div>

            </div>

            <div id="addview-linebreak"></div>
            
            <div id="addview-stats">
                <div>
                    <div id="view-title-box">
                        <b id="view-title">STRENGTH</b>
                    </div>
                    <p id="view-body" className="view-body-tocenter">0</p>

                    <div id="view-title-box">
                        <b id="view-title">DEXTERITY</b>
                    </div>
                    <p id="view-body" className="view-body-tocenter">0</p>

                    <div id="view-title-box">
                        <b id="view-title">CONSITUTION</b>
                    </div>
                    <p id="view-body" className="view-body-tocenter">0</p>
                </div>
                <div>
                    <div id="view-title-box">
                        <b id="view-title">INTELLIGENCE</b>
                    </div>
                    <p id="view-body" className="view-body-tocenter">0</p>

                    <div id="view-title-box">
                        <b id="view-title">WISDOM</b>
                    </div>
                    <p id="view-body" className="view-body-tocenter">0</p>

                    <div id="view-title-box">
                        <b id="view-title">CHARISMA</b>
                    </div>
                    <p id="view-body" className="view-body-tocenter">0</p>
                </div>
            </div>

            <div id="addview-linebreak"></div>

            <div>
                {/* class, sub-class, race, alignment, background */}
                <div id="view-title-box" className="">
                        <b id="view-title">STRENGTH</b>
                    </div>
                    <p id="view-body">0</p>
            </div>
            
            <br /><br />
                <button id="button-green">Back</button>
            <br /><br />
        </form>

      </div>
    </div>
    </div>
  );
}

export default View_Character;