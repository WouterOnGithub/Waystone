import React from "react";
import "../../pages/pages-css/CSS.css";
import "../../pages/pages-css/Add_View.css";
import Required_Logo from "../../assets/Required_Logo.webp";
import Delete_Logo from "../../assets/Delete_Logo.webp";
import Add_Logo from "../../assets/Add_Logo.webp";

function Add_Container() 
{
  return (
    <div id="addview-page">
    <div id="addview-box">

      <p id="addview-title">Add Container</p>

      <div id="addview-content">

        <form id="input-box-gray">
            <br />
            <label htmlFor="name-buildingregion"><b>Name</b></label> <br />
            <input type="text" id="name-buildingregion" defaultValue="Container#0528"/> 
            <br /><br />

            {/* A way to add an item by pressing the ADD icon */}
            <label htmlFor="name-item"><b>Items</b></label> <button id="button-icons"><img src={Add_Logo} alt="Add_Logo" id="Add_Logo"/></button> <br />
            <input type="text" id="name-item" hidden/>
            {/* Examples of an item */}
            <div id="addview-green-bar">
                <b>Item_name</b> <button id="button-icons"><img src={Delete_Logo} alt="Delete_Logo" id="Delete_Logo"/></button>
            </div>
            <div id="addview-green-bar">
                <b>Item_name</b> <button id="button-icons"><img src={Delete_Logo} alt="Delete_Logo" id="Delete_Logo"/></button>
            </div>
            <br /><br />

            {/* A way to add a location by pressing the ADD icon */}
            <label htmlFor="name-location"><b>Locations</b> <button id="button-icons"><img src={Add_Logo} alt="Add_Logo" id="Add_Logo"/></button> </label>
            <input type="text" id="name-location" hidden/><br />
            {/* Examples of a location */}
            <div id="addview-green-bar">
                <b>Location_name</b> <button id="button-icons"><img src={Delete_Logo} alt="Delete_Logo" id="Delete_Logo"/></button>
            </div>
            <div id="addview-green-bar">
                <b>Location_name</b> <button id="button-icons"><img src={Delete_Logo} alt="Delete_Logo" id="Delete_Logo"/></button>
            </div>

            <br /><br />
                <button id="button-green">Save</button>
            <br /><br />
        </form>

      </div>
    </div>
    </div>
  );
}

export default Add_Container;