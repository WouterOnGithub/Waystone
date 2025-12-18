import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import "./pages-css/CSS.css";
import "./pages-css/Main_Page.css";
import "./pages-css/New_Campaign_Page_CAMPAIGN.css";
import Footer from "../components/UI/Footer";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";


import { createCampaign, updateCampaignInfo } from "../api/userCampaigns";
import { useCampaign } from "../hooks/useCampaign";
import { useAuth } from "../context/AuthContext";

function New_Campaign_Page_CAMPAIGN() {
  const {campaignId} = useParams()
  const navigate = useNavigate();

  const New_Campaign_Page_CAMPAIGN= () => {
    const isCreateMode = !campaignId;
    const isEditMode = Boolean(campaignId);
  };
  

  const {user} = useAuth();
  const userId = user ? user.uid : null;
  
  const isNewCampaign = !campaignId;
  const { data, loading, error, setData } = useCampaign(
    isNewCampaign? null : userId, 
    isNewCampaign? null : campaignId
  );
  const [draft, setDraft] = useState({
    name:"",
    genre:"",
    backstory:""
  });
  const formData = isNewCampaign ? draft : data;
  const setFormData = isNewCampaign ? setDraft : setData;

  const handleSave = async () => {
    if(!userId) return;
    
    if (!formData.name) {
    alert("Campaign name is required");
    return;
  }

    try {
      if (isNewCampaign) {
        const newCampaign = await createCampaign(userId, 
          {...draft,
          createdAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
          originalCreator: userId
        });
        navigate(`/user/New_Campaign_Page_CAMPAIGN/${newCampaign.id}`);
      }else {
        await updateCampaignInfo(userId, campaignId, {
          name: formData.name,
          genre: formData.genre,
          backstory: formData.backstory,
          lastUpdatedAt: new Date().toISOString()
        });
        alert("Campaign info saved successfully");
      }
        }
    catch (error) {
      console.error("Error saving campaign:", error);
      alert("Failed to save campaign. Please try again.");
    }
  };

  return (
    <div className="campaign-page">
      <Sidebar />
      <div className="campaign-main">
        <Header title="New Campaign" />
        <div className="campaign-body">
          <div className="campaign-tabs">
            <button 
              className="campaign-tab active"
              disabled={!campaignId}
              onClick={() => navigate(`/user/New_Campaign_Page_CAMPAIGN/${campaignId}`)}
            >
              Campaign
            </button>

            <button
              className="campaign-tab"
              disabled={!campaignId}
              onClick={() => navigate(`/user/New_Campaign_Page_MAPBUILDER/${campaignId}`)}
            >
              Map Builder
            </button>

            <button
              className="campaign-tab"
              disabled={!campaignId}
              onClick={() => navigate(`/user/New_Campaign_Page_CHARACTERS/${campaignId}`)}
            >
              Characters
            </button>
          </div>

          <div className="campaign-card">
            <div className="campaign-field">
              <label className="campaign-label" htmlFor="campaign-name">
                Campaign name
              </label>
              <input
                id="campaign-name"
                className="campaign-input"
                placeholder="Enter text here..."
                value={formData?.name || ""}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="campaign-field">
              <label className="campaign-label" htmlFor="campaign-genre">
                Genre/Style 
              </label>
              <input
                id="campaign-genre"
                className="campaign-input"
                placeholder="Enter text here..."
                value={formData?.genre || ""}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
              />
            </div>

            <div className="campaign-field">
              <label className="campaign-label" htmlFor="campaign-story">
                Backstory
              </label>
              <textarea
                id="campaign-story"
                className="campaign-textarea"
                placeholder={`Enter text here...`}
                value={formData?.backstory || ""}
                onChange={(e) => setFormData({...formData, backstory: e.target.value})}
              />
            </div>

            <div className="campaign-pill-row">
              <button className="campaign-pill">Add Items</button>
              <button className="campaign-pill">Show Current Items</button>
            </div>

            <div className="campaign-actions">
              <button className="campaign-save" onClick={handleSave} >
                Save and continue
              </button>
              <button className="campaign-enter">Enter</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default New_Campaign_Page_CAMPAIGN;
