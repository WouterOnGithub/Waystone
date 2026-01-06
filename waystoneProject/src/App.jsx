import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

/* IMPORTS OF ALL THE PAGES OF THE WEBSITE */
import Settings_Page from "./pages/Settings_Page"
import Login_Page from "./pages/Login_Page"; 
import Join_Session from "./pages/Join_Session"; 
import Register_Page from "./pages/Register_Page"; 

import Main_Page from "./pages/Main_Page";
import Account_Page from "./pages/Account_Page"
import Account_Page_EDIT from "./pages/Account_Page_EDIT"
import My_Campaigns_Page from "./pages/My_Campaigns_Page"
import Archived_Campaigns from "./pages/Archived_Campaigns"
import HelpPage from "./pages/HelpPage"

import New_Campaign_Page_CAMPAIGN from "./pages/New_Campaign_Page_CAMPAIGN"
//import New_Campaign_Page_EVENTS from "./pages/New_Campaign_Page_EVENTS"
import New_Campaign_Page_CHARACTERS from "./pages/New_Campaign_Page_CHARACTERS"
import New_Campaign_Page_MAPBUILDER from "./pages/New_Campaign_Page_MAPBUILDER" 

import Add_Building_Region from "./components/popups/Add_Building_Region"
import Add_Location from "./components/popups/Add_Location"
import Add_Container from "./components/popups/Add_Container"
import Add_Item from "./components/popups/Add_Item" 
import Add_Character from "./pages/Add_Character" 
import Add_NPC from "./pages/Add_NPC" 
import Add_Enemy from "./pages/Add_Enemy"

import View_Character from "./components/popups/View_Character" 
import View_Item from "./components/popups/View_Item"

import Game_Settings from "./components/popups/Game_Settings"
import Game_Settings_SAVEGAME from "./components/popups/Game_Settings_SAVEGAME" 

import Map_Main from "./pages/Map_Main"
import Map_Location from "./pages/Map_Location"
import Map_Building_Region from "./pages/Map_Building_Region"
// import Map_Battle_View from "./pages/Map_Battle_View"

import BattleMapTest from './pages/battleMapTest';

/* (temporary, to be removed later) 
    TO VISIT A PAGE: http://localhost:5173/user/[PAGE NAME] */
  
function App() 
{
  return (
    <Router>

        <div>
            <Routes>
                <Route path="/" element={<Login_Page />} />
                {/* Login and Register */}
                <Route path="/user/Login_Page" element={<Login_Page />} />
                <Route path="/user/Register_Page" element={<Register_Page />} />
                 <Route path="/user/Join_Session" element={<Join_Session />} />

                {/* Main page or Home page */}
                <Route path="/user/Main_Page" element={<Main_Page />} />

                {/* Settings page */}
                <Route path="/user/Settings_Page" element={<Settings_Page />} />

                {/* User account page (and editing page) */}
                <Route path="/user/Account_Page" element={<Account_Page />} />
                <Route path="/user/Account_Page_EDIT" element={<Account_Page_EDIT />} />

                {/* All the campaigns */}
                <Route path="/user/My_Campaigns_Page" element={<My_Campaigns_Page />} />
                <Route path="/user/Archived_Campaigns" element={<Archived_Campaigns />} />
                <Route path ="/user/HelpPage" element={<HelpPage/>}/>
                
                {/* CAMPAIGNS */}
                {/* Making a new campaign */}
                <Route path="/user/New_Campaign_Page_CAMPAIGN" element={<New_Campaign_Page_CAMPAIGN />} />
                {/* An existing campaign */}
                <Route path="/user/New_Campaign_Page_CAMPAIGN/:campaignId" element={<New_Campaign_Page_CAMPAIGN/>} />

                {/* Routing using the campaignID */}
                <Route path="/user/New_Campaign_Page_CHARACTERS/:campaignId" element={<New_Campaign_Page_CHARACTERS />} />
                <Route path="/user/New_Campaign_Page_MAPBUILDER/:campaignId" element={<New_Campaign_Page_MAPBUILDER />} />

                {/* <Route path="/user/New_Campaign_Page_EVENTS" element={<New_Campaign_Page_EVENTS />} /> */}
                <Route path="/user/New_Campaign_Page_CHARACTERS" element={<New_Campaign_Page_CHARACTERS />} />
                
                {/* MAPS */}
                {/* Making a new map */}
                <Route path="/user/New_Campaign_Page_MAPBUILDER" element={<New_Campaign_Page_MAPBUILDER />} />
                {/* An existing map */}
                <Route path="/user/New_Campaign_Page_MAPBUILDER/:mapId" element={<New_Campaign_Page_MAPBUILDER />} />
                
                {/* Add pop-ups */}
                <Route path="/user/Add_Building_Region" element={<Add_Building_Region />} /> 
                <Route path="/user/Add_Location" element={<Add_Location />} /> 
                <Route path="/user/Add_Container" element={<Add_Container />} />
                <Route path="/user/Add_Item" element={<Add_Item />} />

                {/* Routes to create characters */}
                <Route path='/user/:campaignId/Add_Character' element={<Add_Character/>} />
                <Route path='/user/:campaignId/Add_Character/:CharacterId' element={<Add_Character/>} />
                
                {/* Routes to create npc's */}
                <Route path='/user/:campaignId/Add_NPC' element={<Add_NPC/>} />
                <Route path='/user/:campaignId/Add_NPC/:npcId' element={<Add_NPC/>} />

                {/* Routes to create enemies */}
                <Route path='/user/:campaignId/Add_Enemy' element={<Add_Enemy/>} />
                <Route path='/user/:campaignId/Add_Enemy/:enemyId' element={<Add_Enemy/>} />
                  
                
                {/* View pop-ups */}
                <Route path="/user/View_Character" element={<View_Character />} /> 
                <Route path="/user/View_Item" element={<View_Item />} />
                
                {/* Game_Settings pop-ups */}
                <Route path="/user/Game_Settings" element={<Game_Settings />} /> 
                <Route path="/user/Game_Settings_SAVEGAME" element={<Game_Settings_SAVEGAME />} />
                
                {/* MAP SECTIONS */}
                {/* <Route path="/user/Map_Main" element={<Map_Main />} /> */}
                {/* <Route path="/user/Map_Location" element={<Map_Location />} /> */}
                {/* <Route path="/user/Map_Building_Region" element={<Map_Building_Region />} /> */}
                <Route path="/user/Map_Main" element={<Map_Main />} />
                <Route path="/user/Map_Main/:campaignId" element={<Map_Main />} />
                <Route path="/user/Map_Location" element={<Map_Location />} />
                <Route path="/user/Map_Location/:campaignId" element={<Map_Location />} />
                <Route path="/user/Map_Location/:campaignId/:locationId" element={<Map_Location />} />
                <Route path="/user/Map_Building_Region" element={<Map_Building_Region />} />
                <Route path="/user/Map_Building_Region/:campaignId" element={<Map_Building_Region />} />
                <Route path="/user/Map_Building_Region/:campaignId/:buildingId" element={<Map_Building_Region />} /> 
                {/* <Route path="/user/Map_Battle_View" element={<Map_Battle_View />} /> */}

                {/* TEST - To be removed later */}
                <Route path="/battleMapTest" element={<BattleMapTest/>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>

    </Router>
  );
}

export default App;