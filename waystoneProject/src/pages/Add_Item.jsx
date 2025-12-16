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

function Add_Item() 
{
  return (
    <div id="addview-page">
    <div id="addview-box">

      <p id="addview-title">Add Item</p>

      <div id="addview-content">

        <form id="input-box-gray">
            <br />
            <label htmlFor="name-item"><b>Name</b></label> <img src={Required_Logo} alt="Required_Logo" id="Required_Logo" /> <br />
            <input type="text" id="name-item" defaultValue="Small stick"/> 
            <br /><br />
            
            <div id="addview-discription">
                <label htmlFor="discription-item"><b>Short Discription</b> (max. 80 characters)</label> <img src={Required_Logo} alt="Required_Logo" id="Required_Logo" /> <br />
                <textarea name="discription-item" id="discription-item" defaultValue="Small, not very sturdy." maxlength="80"></textarea>
            </div>
            <br />

            {/* A way to add an effect by pressing the ADD icon */}
            <label htmlFor="effects-item"><b>Effects</b></label> <button id="button-icons"><img src={Add_Logo} alt="Add_Logo" id="Add_Logo"/></button> <br />
            <input type="text" id="effects-item" hidden/>
            {/* Examples of an effect */}
            <div id="addview-green-bar">
                <b>Effect_name</b> <button id="button-icons"><img src={Delete_Logo} alt="Delete_Logo" id="Delete_Logo"/></button>
            </div>
            <div id="addview-green-bar">
                <b>Effect_name</b> <button id="button-icons"><img src={Delete_Logo} alt="Delete_Logo" id="Delete_Logo"/></button>
            </div>
            <br /><br />

            {/* A way to add a bonus effect by pressing the ADD icon */}
            <label htmlFor="effects-bonus-item"><b>Bonus-effects</b> <button id="button-icons"><img src={Add_Logo} alt="Add_Logo" id="Add_Logo"/></button> </label>
            <input type="text" id="effects-bonus-item" hidden/><br />
            {/* Examples of a bonus effect */}
            <div id="addview-green-bar">
                <b>Bonus-Effect_name</b> <button id="button-icons"><img src={Delete_Logo} alt="Delete_Logo" id="Delete_Logo"/></button>
            </div>
            <div id="addview-green-bar">
                <b>Bonus-Effect_name</b> <button id="button-icons"><img src={Delete_Logo} alt="Delete_Logo" id="Delete_Logo"/></button>
            </div>

            <br /><br />
                <button id="button-green">Save</button>
                <button id="button-green">Back</button>
            <br /><br />
        </form>

      </div>
    </div>
    </div>
  );
}

export default Add_Item;