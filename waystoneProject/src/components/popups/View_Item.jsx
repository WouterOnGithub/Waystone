import React from "react";
import { Link } from "react-router-dom";
import "../../pages/pages-css/CSS.css";
import "../../pages/pages-css/Add_View.css";

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
            <br />

            <div id="view-title-box">
                <b id="view-title">EFFECTS</b>
            </div>
            {/* Examples of an effect */}
            <p id="view-body">Effect_name</p>
            <p id="view-body">Effect_name</p> {/* All except 1 later deleted */}
            <p id="view-body">Effect_name</p> {/* All except 1 later deleted */}

            <br />

            <div id="view-title-box">
                <b id="view-title">BONUS - EFFECTS</b>
            </div>
            {/* Examples of a bonus effect */}
            <p id="view-body">Bonus-Effect_name</p>
            <p id="view-body">Bonus-Effect_name</p> {/* All except 1 later deleted */}
            <p id="view-body">Bonus-Effect_name</p> {/* All except 1 later deleted */}

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