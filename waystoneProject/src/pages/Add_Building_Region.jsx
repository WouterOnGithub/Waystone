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

function Add_Building_Region() 
{
  return (
    <div id="addview-page">
    <div id="addview-box">

      <p id="addview-title">Add Building/Region</p>

      <div id="addview-content">

        <form id="input-box-gray">
            <label htmlFor="upload-img">
                <img src={UploadIMG_Logo} alt="UploadIMG_Logo" id="UploadIMG_Logo" className="addview-uploadimg" />
            </label>
            <input type="file" id="upload-img" hidden/>
            <br />
            <label htmlFor="name-buildingregion"><b>Name</b></label> <img src={Required_Logo} alt="Required_Logo" id="Required_Logo" /> <br />
            <input type="text" id="name-buildingregion" defaultValue="Building/Region#0452"/>
            <br /><br />
            
            <div id="addview-discription">
                <label htmlFor="discription-buildingregion"><b>Discription</b> (max. 120 characters)</label><br />
                <textarea name="discription-buildingregion" id="discription-buildingregion" maxlength="120"></textarea>
            </div>

            <br />
            <button id="button-green">Save</button>
            <button id="button-green">Back</button>
            <br /><br />
        </form>

      </div>
    </div>
    </div>
  );
}

export default Add_Building_Region;