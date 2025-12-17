import React from "react";
import { useNavigate } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Main_Page.css";
import "./pages-css/New_Campaign_Page_CAMPAIGN.css";
import Footer from "../components/UI/Footer";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import UploadIMG_Logo from "../assets/PlaceholderImage.jpg";
import Required_Logo from "../assets/Required_Logo.webp";
import Delete_Logo from "../assets/Delete_Logo.webp";
import Add_Logo from "../assets/Add_Logo.webp";
import Placeholder from "../assets/PlaceholderImage.jpg";

import {useCampaign} from "../hooks/useCampaign";
import { useAuth } from "../context/AuthContext";
import { updateCampaignInfo } from "../api/firestore";

function New_Campaign_Page_CAMPAIGN() {
  const navigate = useNavigate();

  const {user} = useAuth();
  
  const userId = user?.uid;
  const campaignId = "currentCampaignId"; // bijv. uit route params of state TO DO !!!
  
  const { data, loading, error, setData } = useCampaign(userId, campaignId);

  const handleSave = async () => {
    if(!userId || !campaignId) return;
    try {
      await updateCampaignInfo(userId, campaignId, {
        name: data.name,
        genre: data.genre,
        backstory: data.backstory
      });
      alert("Campaign info saved successfully!");
    } catch (err) {
      console.error("Failed to save campaign info:", err);
      alert("Failed to save campaign info. Please try again.");
    }
  };

  return (
    <div className="campaign-page">
      <Sidebar />
      <div className="campaign-main">
        <Header title="New Campaign" />
        <div className="campaign-body">
          <div className="campaign-tabs">
            <button className="campaign-tab active">Campaign</button>
            <button
              className="campaign-tab"
              onClick={() => navigate("/user/New_Campaign_Page_MAPBUILDER")}
            >
              Map Builder
            </button>
            <button
              className="campaign-tab"
              onClick={() => navigate("/user/New_Campaign_Page_CHARACTERS")}
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
                value={data?.name || ""}
                onChange={(e) => setData({...data, name: e.target.value})}
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
                value={data?.genre || ""}
                onChange={(e) => setData({...data, genre: e.target.value})}
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
                value={data?.backstory || ""}
                onChange={(e) => setData({...data, backstory: e.target.value})}
              />
            </div>

            <div className="campaign-pill-row">
              <button className="campaign-pill">Add Items</button>
              <button className="campaign-pill">Show Current Items</button>
            </div>

            <div className="campaign-actions">
              <button className="campaign-save">Save and continue</button>
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
