import React from "react";
import "../../pages/pages-css/CSS.css";
import "../../pages/pages-css/Add_View.css";
import UploadIMG_Logo from "../../assets/PlaceholderImage.jpg";
import Required_Logo from "../../assets/Required_Logo.webp";

function Add_Location() 
{
  return (
    <div id="addview-page">
    <div id="addview-box">

      <p id="addview-title">Add Location</p>

      <div id="addview-content">

        <form id="input-box-gray">
            <label htmlFor="upload-img">
                <img src={UploadIMG_Logo} alt="UploadIMG_Logo" id="UploadIMG_Logo" className="addview-uploadimg" />
            </label>
            <input type="file" id="upload-img" hidden/>
            <br />
            <label htmlFor="name-location"><b>Name</b></label> <img src={Required_Logo} alt="Required_Logo" id="Required_Logo" /> <br />
            <input type="text" id="name-location" defaultValue="Location#0452"/>
            <br /><br />
            
            <div id="addview-description">
                <label htmlFor="description-location"><b>Description</b> (max. 120 characters)</label><br />
                <textarea name="description-location" id="description-location" maxlength="120"></textarea>
            </div>

            <br />
            <button id="button-green">Save</button>
            <br /><br />
        </form>

      </div>
    </div>
    </div>
  );
}

export default Add_Location;