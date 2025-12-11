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

function View_Item() 
{
  return (
    <div id="addview-page">
    <div id="addview-box">

      <p id="addview-title">Small stick</p>

      <div id="addview-content">

        <form id="input-box-gray">
            <br />
            <p>
                Small, not very sturdy
            </p>
            <br /><br />

            {/* Examples of an effect */}
            <div id="addview-green-bar">
                <b>Effect_name</b> <button id="button-icons"><img src={Delete_Logo} alt="Delete_Logo" id="Delete_Logo"/></button>
            </div>
            <div id="addview-green-bar">
                <b>Effect_name</b> <button id="button-icons"><img src={Delete_Logo} alt="Delete_Logo" id="Delete_Logo"/></button>
            </div>
            <br /><br />

            {/* Examples of a bonus effect */}
            <div id="addview-green-bar">
                <b>Bonus-Effect_name</b> <button id="button-icons"><img src={Delete_Logo} alt="Delete_Logo" id="Delete_Logo"/></button>
            </div>
            <div id="addview-green-bar">
                <b>Bonus-Effect_name</b> <button id="button-icons"><img src={Delete_Logo} alt="Delete_Logo" id="Delete_Logo"/></button>
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

export default View_Item;