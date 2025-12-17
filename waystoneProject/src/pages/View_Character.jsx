/*I am unique*/
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Add_View.css";
import Required_Logo from "../assets/Required_Logo.webp"; {/* Als here as the Info_Logo */}
import Minus_Logo from "../assets/Minus_Logo.png";
import Add_Logo from "../assets/Add_Logo.webp";

function View_Character() 
{
  {/* For the collapsing sections */}
  const [isCollapsed1, setIsCollapsed1] = useState(false);
  const [isCollapsed2, setIsCollapsed2] = useState(false);
  const [isCollapsed3, setIsCollapsed3] = useState(false);
  const [isCollapsed4, setIsCollapsed4] = useState(false);
  const [isCollapsed5, setIsCollapsed5] = useState(false);
  const [isCollapsed6, setIsCollapsed6] = useState(false);

  return (
    <div id="addview-page">
    <div id="addview-box">

      <p id="addview-title">John Doe</p> {/* the name later replaced by real value*/}

      <div id="addview-content">
        <form id="input-box-gray">
            <div id="addview-stats">
                <div>
                {/* HP, LVL, EXP, STATUS */}
                    <div>
                        <div id="addview-stats" className="view-stats-main">
                            <div><b id="view-stats-main-title" className="view-stats-main-title-1">HP</b></div>
                            <div><p className="view-hp">20 <b>/20</b></p></div> {/* the HP later replaced by real value */} {/* /Max HP that can be adjusted by the DM in Add_Character */}
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
                                                                          {/* Should have a character limit in order to not effect the layout */}
                            </div> 
                        </div>
                    </div>
                </div>

                {/* INVENTORY */}
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
            
            <button type="button" id="view-collapsable-sections-button" onClick={() => setIsCollapsed1(!isCollapsed1)}>
                <div id="view-hide-show">{isCollapsed1 ? "Show " : "Hide "}</div>
                    Ability Scores
            </button>

            <div id="view-collapsable-sections-content"
             style={{
                        /* if isCollapsed = true => 0px, otherwise => 200px */
                        maxHeight: isCollapsed1 ? "0px" : "1000px",
                        overflow: "hidden",
                        transition: "max-height 0.5s ease-in-out",
                    }}>
                {/* THE CONTENT HERE */}
                    {/* Ability Scores */}
                    {/* STRENGTH, DEXTERITY, CONSITUTION, INTELLIGENCE, WISDOM, CHARISMA */}
                    <div id="addview-stats">

                    <div>
                        <div id="view-title-box">
                            <b id="view-title">STRENGTH</b>
                        </div>
                        <p id="view-body" className="view-body-tocenter">0</p> {/* later replaced by real value */}

                        <div id="view-title-box">
                            <b id="view-title">DEXTERITY</b>
                        </div>
                        <p id="view-body" className="view-body-tocenter">0</p> {/* later replaced by real value */}

                        <div id="view-title-box">
                            <b id="view-title">CONSITUTION</b>
                        </div>
                        <p id="view-body" className="view-body-tocenter">0</p> {/* later replaced by real value */}
                    </div>

                    <div>
                        <div id="view-title-box">
                            <b id="view-title">INTELLIGENCE</b>
                        </div>
                        <p id="view-body" className="view-body-tocenter">0</p> {/* later replaced by real value */}

                        <div id="view-title-box">
                            <b id="view-title">WISDOM</b>
                        </div>
                        <p id="view-body" className="view-body-tocenter">0</p> {/* later replaced by real value */}

                        <div id="view-title-box">
                            <b id="view-title">CHARISMA</b>
                        </div>
                        <p id="view-body" className="view-body-tocenter">0</p> {/* later replaced by real value */}
                    </div>

                    </div>

            </div>

            <div id="addview-linebreak"></div>

            <button type="button" id="view-collapsable-sections-button" onClick={() => setIsCollapsed2(!isCollapsed2)}>
                <div id="view-hide-show">{isCollapsed2 ? "Show " : "Hide "}</div>
                    Character Details
            </button>

            <div id="view-collapsable-sections-content"
             style={{
                        /* if isCollapsed = true => 0px, otherwise => 200px */
                        maxHeight: isCollapsed2 ? "0px" : "1000px",
                        overflow: "hidden",
                        transition: "max-height 0.5s ease-in-out",
                    }}>
                {/* THE CONTENT HERE */}
                    {/* Character Details */}
                    {/* CLASS, SUB-CLASS, RACE, ALIGNMENT, BACKGROUND */}
                    <div>

                        <div id="addview-stats">
                            <div id="view-title-box"><b id="view-title">Class</b></div>
                            <div><p id="view-body">[Class_Placeholder]</p></div> {/* later replaced by real value */}
                        </div>
                        <br />
                        <div id="addview-stats">
                            <div id="view-title-box"><b id="view-title">Sub-Class</b></div>
                            <div><p id="view-body">[Sub-Class_Placeholder]</p></div> {/* later replaced by real value */}
                        </div>
                        <br />
                        <div id="addview-stats">
                            <div id="view-title-box"><b id="view-title">Race</b></div>
                            <div><p id="view-body">[Race_Placeholder]</p></div> {/* later replaced by real value */}
                        </div>
                        <br />
                        <div id="addview-stats">
                            <div id="view-title-box"><b id="view-title">Alignment</b></div>
                            <div><p id="view-body">[Alignment_Placeholder]</p></div> {/* later replaced by real value */}
                        </div>
                        <br />
                        <div id="addview-stats">
                            <div id="view-title-box"><b id="view-title">Background</b></div>
                            <div><p id="view-body">[Background_Placeholder]</p></div> {/* later replaced by real value */}
                        </div>

                    </div>

            </div>

            <div id="addview-linebreak"></div>

            <button type="button" id="view-collapsable-sections-button" onClick={() => setIsCollapsed3(!isCollapsed3)}>
                <div id="view-hide-show">{isCollapsed3 ? "Show " : "Hide "}</div>
                    Combat Statistics
            </button>

            <div id="view-collapsable-sections-content"
             style={{
                        /* if isCollapsed = true => 0px, otherwise => 200px */
                        maxHeight: isCollapsed3 ? "0px" : "1000px",
                        overflow: "hidden",
                        transition: "max-height 0.5s ease-in-out",
                    }}>
                {/* THE CONTENT HERE */}
                    {/* Combat Statistics */}
                    {/* ARMOR CLASS, MAX HP, INITIATIVE, SPEED, HIT DICE, SAVING THROW PROFECIENCIES */}
                    <div>

                        <div id="addview-stats">
                            <div id="view-title-box"><b id="view-title">Armor Class</b></div>
                            <div><p id="view-body">[Armor_Class_Placeholder]</p></div> {/* later replaced by real value */}
                        </div>
                        <br />
                        <div id="addview-stats">
                            <div id="view-title-box"><b id="view-title">Max HP</b></div>
                            <div><p id="view-body">[Max_HP_Placeholder]</p></div> {/* later replaced by real value */}
                        </div>
                        <br />
                        <div id="addview-stats">
                            <div id="view-title-box"><b id="view-title">Initiative</b></div>
                            <div><p id="view-body">[Initiative_Placeholder]</p></div> {/* later replaced by real value */}
                        </div>
                        <br />
                        <div id="addview-stats">
                            <div id="view-title-box"><b id="view-title">Speed</b></div>
                            <div><p id="view-body">[Speed_Placeholder]</p></div> {/* later replaced by real value */}
                        </div>
                        <br />
                        <div id="addview-stats">
                            <div id="view-title-box"><b id="view-title">Hit Dice</b></div>
                            <div><p id="view-body">[Hit_Dice_Placeholder]</p></div> {/* later replaced by real value */}
                        </div>
                        <br />
                        {/* SAVING THROW PROFECIENCIES */}
                        <div>
                            <div className="view-title-box-long"><b id="view-title">Saving Throw Profeciencies</b></div>
                            <div><p id="view-body">[Saving_Throw_Profeciencies_Placeholder]</p></div> {/* later replaced by real value */}
                        </div>

                    </div>

            </div>

            <div id="addview-linebreak"></div>

            <button type="button" id="view-collapsable-sections-button" onClick={() => setIsCollapsed4(!isCollapsed4)}>
                <div id="view-hide-show">{isCollapsed4 ? "Show " : "Hide "}</div>
                    Skills & Features
            </button>

            <div id="view-collapsable-sections-content"
             style={{
                        /* if isCollapsed = true => 0px, otherwise => 200px */
                        maxHeight: isCollapsed4 ? "0px" : "1000px",
                        overflow: "hidden",
                        transition: "max-height 0.5s ease-in-out",
                    }}>
                {/* THE CONTENT HERE */}
                    {/* Skills & Features */}
                    {/* SKILLS, RACIAL TRAITS, CLASS FEATURES, BACKGROUND FEATURES */}
                    <div>

                        <div>
                            <div className="view-title-box-long"><b id="view-title">Skills</b></div>
                            <div> &#160;&#160; {/* Empty space */}
                                <i>[Skill_Placeholder], &#160;</i>
                                {/* Example of multiple skills, to be deleted later when functionality is added */}
                                <i>[Skill_Placeholder], &#160;</i>
                                <i>[Skill_Placeholder], &#160;</i> 
                                <i>[Skill_Placeholder], &#160;</i> 
                                <i>[Skill_Placeholder], &#160;</i>
                            </div> {/* later all replaced by real value */}
                        </div>
                        <br />
                        <div>
                            <div className="view-title-box-long"><b id="view-title">Racial Traits</b></div>
                            <div> &#160;&#160; {/* Empty space */}
                                <i>[Trait_Placeholder], &#160;</i>
                                {/* Example of multiple racial traits, to be deleted later when functionality is added */}
                                 <i>[Trait_Placeholder], &#160;</i>
                                 <i>[Trait_Placeholder], &#160;</i> 
                                 <i>[Trait_Placeholder], &#160;</i> 
                                 <i>[Trait_Placeholder], &#160;</i>
                            </div> {/* later all replaced by real value */}
                        </div>
                        <br />
                        <div>
                            <div className="view-title-box-long"><b id="view-title">Class Features</b></div>
                            <div> {/* &#8209_ is - */}
                                <p id="view-body"><b>&#8209; [Feature_Placeholder]</b> <i>[Very short description]</i></p>
                                {/* Example of multiple class features, to be deleted later when functionality is added */}
                                 <p id="view-body"><b>&#8209; [Feature_Placeholder]</b> <i>[Very short description]</i></p>
                                 <p id="view-body"><b>&#8209; [Feature_Placeholder]</b> <i>[Very short description]</i></p>
                            </div> {/* later all replaced by real value */}
                        </div>
                        <br />
                        <div>
                            <div className="view-title-box-long"><b id="view-title">Background Features</b></div>
                            <div> {/* &#8209_ is - */}
                                <p id="view-body"><b>&#8209; [Feature_Placeholder]</b> <i>[Very short description]</i></p>
                                {/* Example of multiple class features, to be deleted later when functionality is added */}
                                 <p id="view-body"><b>&#8209; [Feature_Placeholder]</b> <i>[Very short description]</i></p>
                                 <p id="view-body"><b>&#8209; [Feature_Placeholder]</b> <i>[Very short description]</i></p>
                            </div> {/* later all replaced by real value */}
                        </div>

                    </div>
            </div>

            <div id="addview-linebreak"></div>

            <button type="button" id="view-collapsable-sections-button" onClick={() => setIsCollapsed5(!isCollapsed5)}>
                <div id="view-hide-show">{isCollapsed5 ? "Show " : "Hide "}</div>
                    Spells
            </button>

            <div id="view-collapsable-sections-content"
             style={{
                        /* if isCollapsed = true => 0px, otherwise => 200px */
                        maxHeight: isCollapsed5 ? "0px" : "1000px",
                        overflow: "hidden",
                        transition: "max-height 0.5s ease-in-out",
                    }}>
                {/* THE CONTENT HERE */}
                    {/* Spells */}
                    {/* SPELL-CASTING ABILITY, SPELL ATTACK BONUS, SPELL SAVE DICE, KNOWN SPELLS */}
                    <div>

                        <div id="addview-stats">
                            <div id="view-title-box"><b id="view-title">Spell-Casting Ability</b></div>
                            <div><p id="view-body">[Ability_Placeholder]</p></div> {/* later replaced by real value */}
                        </div>
                        <br />
                        <div id="addview-stats">
                            <div id="view-title-box"><b id="view-title">Spell Attack Bonus</b></div>
                            <div><p id="view-body">[Attack_Bonus_Placeholder]</p></div> {/* later replaced by real value */}
                        </div>
                        <br />
                        <div id="addview-stats">
                            <div id="view-title-box"><b id="view-title">Spell Save Dice</b></div>
                            <div><p id="view-body">[Save_Dice_Placeholder]</p></div> {/* later replaced by real value */}
                        </div>
                        <br />
                        <div>
                            <div className="view-title-box-long"><b id="view-title">Known Spells</b></div>
                            <div> {/* &#8209_ is - */}
                                <p id="view-body"><b>&#8209; [Spell_Placeholder]</b> <i>[Very short description]</i></p>
                                {/* Example of multiple spells, to be deleted later when functionality is added */}
                                <p id="view-body"><b>&#8209; [Spell_Placeholder]</b> <i>[Very short description]</i></p>
                                 <p id="view-body"><b>&#8209; [Spell_Placeholder]</b> <i>[Very short description]</i></p>
                            </div> {/* later all replaced by real value */}
                        </div>

                    </div>

            </div>

            <div id="addview-linebreak"></div>

            <button type="button" id="view-collapsable-sections-button" onClick={() => setIsCollapsed6(!isCollapsed6)}>
                <div id="view-hide-show">{isCollapsed6 ? "Show " : "Hide "}</div>
                    Personality & Story
            </button>

            <div id="view-collapsable-sections-content"
             style={{
                        /* if isCollapsed = true => 0px, otherwise => 200px */
                        maxHeight: isCollapsed6 ? "0px" : "1000px",
                        overflow: "hidden",
                        transition: "max-height 0.5s ease-in-out",
                    }}>
                {/* THE CONTENT HERE */}
                    {/* Personality & Story */}
                    {/* PERSONALITY TRAITS, IDEALS, BONDS, BACKSTORY, NOTES */}
                    <div>

                        <div className="view-title-box-long"><b id="view-title">Personality Traits</b></div>
                        <div> {/* &#8209_ is - */}
                            <p id="view-body"><b>&#8209; [Trait_Placeholder]</b> <i>[Very short description]</i></p>
                            {/* Example of multiple spells, to be deleted later when functionality is added */}
                             <p id="view-body"><b>&#8209; [Trait_Placeholder]</b> <i>[Very short description]</i></p>
                             <p id="view-body"><b>&#8209; [Trait_Placeholder]</b> <i>[Very short description]</i></p>
                        </div> {/* later all replaced by real value */}
                        <br />
                        <div>
                            <div className="view-title-box-long"><b id="view-title">Ideals</b></div>
                         <div id="view-body">
                                <p>
                                    [This text tells John Doe's ideals, this text will be repeated. 
                                    This text tells John Doe's ideals, this text will be repeated.
                                    This text tells John Doe's ideals, this text will be repeated.]</p>
                            </div> {/* later all replaced by real value */}
                        </div>
                        <br />
                        <div>
                            <div className="view-title-box-long"><b id="view-title">Bonds</b></div>
                            <div id="view-body">
                                <p>
                                    [This text tells John Doe's bonds, this text will be repeated. 
                                    This text tells John Doe's bonds, this text will be repeated.]</p>
                            </div> {/* later all replaced by real value */}
                        </div>
                        <br />
                        <div>
                            <div className="view-title-box-long"><b id="view-title">Backstory</b></div>
                            <div id="view-body">
                                <p>
                                    [This text tells John Doe's backstory, this text will be repeated. 
                                    This text tells John Doe's backstory, this text will be repeated.
                                    This text tells John Doe's backstory, this text will be repeated.
                                    This text tells John Doe's backstory, this text will be repeated.
                                    This text tells John Doe's backstory, this text will be repeated.
                                    This text tells John Doe's backstory, this text will be repeated.
                                    This text tells John Doe's backstory, this text will be repeated.]</p>
                            </div> {/* later all replaced by real value */}
                        </div>
                        <br />
                        <div>
                            <div className="view-title-box-long"><b id="view-title">Notes</b></div>
                            <div id="view-body">
                                <p>
                                    [This text displays notes made by the DM or John Doe, this text will be repeated.
                                    This text displays notes made by the DM or John Doe, this text will be repeated.
                                    This text displays notes made by the DM or John Doe, this text will be repeated. ]</p>
                            </div> {/* later all replaced by real value */}
                        </div>

                    </div>

            </div>

            <div id="addview-linebreak"></div>
            
            <button id="button-green">Back</button>
            <br /><br />

        </form>
      </div>
      
    </div>
    </div>
  );
}

export default View_Character;