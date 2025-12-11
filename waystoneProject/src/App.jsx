import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/* Not completed */
import Settings_Page from "./pages/Settings_Page"
import Login_Page from "./pages/Login_Page"; 
import Register_Page from "./pages/Register_Page"; 

import Main_Page from "./pages/Main_Page";
import Account_Page from "./pages/Account_Page"
import Account_Page_EDIT from "./pages/Account_Page_EDIT"
import My_Campaigns_Page from "./pages/My_Campaigns_Page"

import New_Campaign_Page_CAMPAIGN from "./pages/New_Campaign_Page_CAMPAIGN"
{/* import New_Campaign_Page_EVENTS from "./pages/New_Campaign_Page_EVENTS" */}
{/* import New_Campaign_Page_CHARACTERS from "./pages/New_Campaign_Page_CHARACTERS" */}
import New_Campaign_Page_MAPBUILDER from "./pages/New_Campaign_Page_MAPBUILDER" 

import Add_Building_Region from "./pages/Add_Building_Region"
import Add_Location from "./pages/Add_Location"
import Add_Container from "./pages/Add_Container"
import Add_Item from "./pages/Add_Item" 
{/* import Add_Character from "./pages/Add_Character" */}
{/* import Add_NPC from "./pages/Add_NPC" */}
{/* import Add_Enemy from "./pages/Add_Enemy" */}

{/* import View_Character from "./pages/View_Character" */}
{/* import View_Item from "./pages/View_Item" */}

{/* import Game_Settings from "./pages/Game_Settings" */}
{/* import Game_Settings_SAVEGAME from "./pages/Game_Settings_SAVEGAME" */}

{/* import Map_Main from "./pages/Map_Main" */}
{/* import Map_Location from "./pages/Map_Location" */}
{/* import Map_Building_Region from "./pages/Map_Building_Region" */}
{/* import Map_Battle_View from "./pages/Map_Battle_View" */}


/* (temporary) TO VISIT A PAGE: http://localhost:5173/user/[PAGE NAME] */


function App() 
{
  return (
    <Router>
        <div className="App">
            <Routes>
                <Route path="/user/Settings_Page" element={<Settings_Page />} />
                { <Route path="/user/Login_Page" element={<Login_Page />} /> }
                { <Route path="/user/Register_Page" element={<Register_Page />} /> }
                
                <Route path="/" element={<Main_Page />} /> {/* Opens the site on this page, later the login page ! */}
                <Route path="/user/Account_Page" element={<Account_Page />} />
                <Route path="/user/Account_Page_EDIT" element={<Account_Page_EDIT />} />
                <Route path="/user/My_Campaigns_Page" element={<My_Campaigns_Page />} />
                
                <Route path="/user/New_Campaign_Page_CAMPAIGN" element={<New_Campaign_Page_CAMPAIGN />} />
                {/* <Route path="/user/New_Campaign_Page_EVENTS" element={<New_Campaign_Page_EVENTS />} /> */}
                {/* <Route path="/user/New_Campaign_Page_CHARACTERS" element={<New_Campaign_Page_CHARACTERS />} /> */}
                <Route path="/user/New_Campaign_Page_MAPBUILDER" element={<New_Campaign_Page_MAPBUILDER />} />
                
                <Route path="/user/Add_Building_Region" element={<Add_Building_Region />} /> 
                <Route path="/user/Add_Location" element={<Add_Location />} /> 
                <Route path="/user/Add_Container" element={<Add_Container />} />
                <Route path="/user/Add_Item" element={<Add_Item />} />
                {/* <Route path="/user/Add_Character" element={<Add_Character />} /> */}
                {/* <Route path="/user/Add_NPC" element={<Add_NPC />} /> */}
                {/* <Route path="/user/Add_Enemy" element={<Add_Enemy />} /> */}
                
                {/* <Route path="/user/View_Character" element={<View_Character />} /> */}
                {/* <Route path="/user/View_Item" element={<View_Item />} /> */}
                
                {/* <Route path="/user/Game_Settings" element={<Game_Settings />} /> */}
                {/* <Route path="/user/Game_Settings_SAVEGAME" element={<Game_Settings_SAVEGAME />} /> */}
                
                {/* <Route path="/user/Map_Main" element={<Map_Main />} /> */}
                {/* <Route path="/user/Map_Location" element={<Map_Location />} /> */}
                {/* <Route path="/user/Map_Building_Region" element={<Map_Building_Region />} /> */}
                {/* <Route path="/user/Map_Battle_View" element={<Map_Battle_View />} /> */}
            </Routes>
        </div>
    </Router>
  );
}

export default App;