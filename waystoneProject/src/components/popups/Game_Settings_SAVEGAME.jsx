import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../pages/pages-css/CSS.css";
import "../pages/pages-css/Add_View.css";

function Game_Settings_SAVEGAME() 
{
  const navigate = useNavigate();
  const { campaignId } = useParams();
  
  const [saveName, setSaveName] = useState("");
  const [saveDescription, setSaveDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!saveName.trim()) {
      alert("Please enter a name for your save game.");
      return;
    }

    setIsSaving(true);

    try {
      // Create save data object
      const saveData = {
        name: saveName,
        description: saveDescription,
        campaignId: campaignId,
        timestamp: new Date().toISOString(),
        // Add any other game state data you need to save
        // Example: currentLocation, playerPositions, sessionNotes, etc.
      };

      // TODO: Implement your save logic here
      // Example: 
      // const userId = user?.uid;
      // await saveCampaignState(userId, campaignId, saveData);
      // Or use your existing API functions
      
      console.log("Saving game:", saveData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert("Game saved successfully!");
      
      // Navigate back to the map after successful save
      navigate(`/user/Map_Main/${campaignId}`);
      
    } catch (error) {
      console.error("Failed to save game:", error);
      alert("Failed to save game. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    const hasUnsavedChanges = saveName.trim() || saveDescription.trim();
    
    if (hasUnsavedChanges) {
      const confirmBack = window.confirm("Discard unsaved changes?");
      if (!confirmBack) return;
    }
    
    // Navigate back to settings
    navigate(`/user/Game_Settings/${campaignId}`);
  };

  return (
    <div id="addview-page">
      <div id="addview-box">

        <p id="addview-title">Save Game</p>

        <div id="addview-content">

          <form id="input-box-gray" className="game-settings-content" onSubmit={handleSave}>
            <br /><br />

            <label htmlFor="name-savegame"><b>Name</b></label><br />
            <input 
              type="text" 
              id="name-savegame"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="e.g., Session 5 - The Dragon's Lair"
              maxLength="50"
              required
              disabled={isSaving}
            /> 
            
            <br /><br />
                        
            <div id="addview-discription">
              <label htmlFor="discription-savegame">
                <b>Description</b> (max. 150 characters)
              </label> <br />
              <textarea 
                name="discription-savegame" 
                id="discription-savegame" 
                maxLength="150"
                value={saveDescription}
                onChange={(e) => setSaveDescription(e.target.value)}
                placeholder="Brief notes about where you left off..."
                disabled={isSaving}
              ></textarea>
              <small style={{
                display: 'block', 
                textAlign: 'right', 
                marginTop: '5px', 
                color: '#888',
                fontSize: '12px'
              }}>
                {saveDescription.length}/150
              </small>
            </div>

            <br />
            <button 
              id="button-green" 
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button 
              id="button-green" 
              type="button"
              onClick={handleBack}
              disabled={isSaving}
            >
              Back
            </button>
                
          </form>

        </div>
      </div>
    </div>
  );
}

export default Game_Settings_SAVEGAME;