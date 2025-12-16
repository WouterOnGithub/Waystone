/*I am unique*/
import React from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Add_View.css";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import UploadIMG_Logo from "../assets/PlaceholderImage.jpg";
import Required_Logo from "../assets/Required_Logo.webp";
import Delete_Logo from "../assets/Delete_Logo.webp";
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
                    {/* hp, lvl, exp, status */}
                    <div id="view-stats-main-box">
                        <div className="view-side-by-side">
                            <div><b id="view-stats-main-title" className="view-stats-main-title-1">HP</b></div>
                            <div><p id="view--stats-main-body">20 </p> <p>/ 20</p></div> {/* the HP later replaced by real value */}
                        </div>
                        <div className="view-side-by-side">
                            <div><b id="view-stats-main-title" className="view-stats-main-title-2">LVL</b></div>
                            <div><p id="view--stats-main-body">1 </p></div> {/* the LVL later replaced by real value */}
                        </div>
                        <div className="view-side-by-side">
                            <div><b id="view-stats-main-title" className="view-stats-main-title-3">EXP</b></div>
                            <div><p id="view--stats-main-body">0 </p></div> {/* the EXP later replaced by real value */}
                        </div>
                        <div className="view-side-by-side">
                            <div><b id="view-stats-main-title" className="view-stats-main-title-4">STATUS</b></div>
                            <div><p id="view--stats-main-body">0 </p></div> {/* the EXP later replaced by real value */}
                        </div>
                    </div>
                </div>

                <div>
                    {/* inventory */}
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