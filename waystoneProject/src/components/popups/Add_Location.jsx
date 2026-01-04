import React, { useRef } from "react";
import "../../pages/pages-css/CSS.css";
import "../../pages/pages-css/Add_View.css";
import UploadIMG_Logo from "../../assets/PlaceholderImage.jpg";
import Required_Logo from "../../assets/Required_Logo.webp";

function Add_Location() 
{
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="addview-page">
    <div id="addview-box">

      <p id="addview-title">Add Location</p>

      <div id="addview-content">

        <form id="input-box-gray">
            <img
              src={UploadIMG_Logo}
              alt="UploadIMG_Logo"
              id="UploadIMG_Logo"
              className="addview-uploadimg"
              onClick={handleUploadClick}
            />
            <input
              type="file"
              id="upload-img"
              ref={fileInputRef}
              hidden
            />
            <br />
            <label htmlFor="name-location"><b>Name</b></label> <br />
            <input type="text" id="name-location"/>
            <br /><br />
            
            <div id="addview-description">
                <label htmlFor="description-location"><b>Description</b> (max. 120 characters)</label><br />
                <textarea name="description-location" id="description-location" maxlength="120"></textarea>
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

export default Add_Location;