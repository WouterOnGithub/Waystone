import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCampaign, updateCampaignInfo, getItems, deleteItem } from "../api/userCampaigns";
import { useCampaign } from "../hooks/useCampaign";
import { useUserId } from "../hooks/useUserId";
import "./pages-css/CSS.css";
import "./pages-css/New_Campaign_Page_CAMPAIGN.css";
import Footer from "../components/UI/Footer";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";
import Add_Item from "../components/popups/Add_Item";

function New_Campaign_Page_CAMPAIGN() 
{
  const {campaignId} = useParams()
  const navigate = useNavigate();

  const userId = useUserId();
  
  const isNewCampaign = !campaignId;
  const { data } = useCampaign(
    isNewCampaign? null : userId, 
    isNewCampaign? null : campaignId
  );
  const [draft, setDraft] = useState({
    name:"",
    genre:"",
    backstory:""
  });
  const [showAddItemPopup, setShowAddItemPopup] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const formData = isNewCampaign ? draft : data;

  // Load items for this campaign
  useEffect(() => {
    const loadItems = async () => {
      if (!userId || !campaignId) return;
      try {
        const list = await getItems(userId, campaignId);
        setItems(list || []);
      } catch (err) {
        console.error("Failed to load items:", err);
      }
    };

    // Initial load
    loadItems();

    // Reload when the window gets focus again (e.g. after closing popup)
    const handleFocus = () => {
      loadItems();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [userId, campaignId]);

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowAddItemPopup(true);
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Delete item "${item.name || "Unnamed Item"}"?`)) {
      return;
    }
    if (!userId || !campaignId) return;
    
    try {
      const success = await deleteItem(userId, campaignId, item.id);
      if (success) {
        const list = await getItems(userId, campaignId);
        setItems(list || []);
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleItemPopupClose = async () => {
    setShowAddItemPopup(false);
    setEditingItem(null);
    // Reload items to reflect any changes
    if (userId && campaignId) {
      try {
        const list = await getItems(userId, campaignId);
        setItems(list || []);
      } catch (err) {
        console.error("Failed to reload items:", err);
      }
    }
  };

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
    <div className="full-page">

      <Sidebar />

      <div id="main">

        <Header
          title={
            isNewCampaign
              ? "New Campaign" : data?.name ? `${data.name}` : "Campaign"
          } />

        <div>

          {/* The buttons (campaign, mapbuilder, character)*/}
          <div id="campaign-tabs">

            {/* The campaign button */}
            <button id="campaign-tab-active" disabled={!campaignId}
                    onClick={() => navigate(`/user/New_Campaign_Page_CAMPAIGN/${campaignId}`)}>
              Campaign
            </button>

            {/* The map builder button */}
            <button id="campaign-tab" disabled={!campaignId}
                    onClick={() => navigate(`/user/New_Campaign_Page_MAPBUILDER/${campaignId}`)}>
              Map Builder
            </button>

            {/* The characters button */}
            <button id="campaign-tab" disabled={!campaignId}
                    onClick={() => navigate(`/user/New_Campaign_Page_CHARACTERS/${campaignId}`)}>
              Characters
            </button>
            
          </div>

          {/* The campaign textboxes*/}
          <div id="content">

            {/* The campaign name */}
            <div id="input-box-white">
              <br></br>
              <label htmlFor="campaign-name"><b>Campaign Name</b></label><br />
              <input id="campaign-name" placeholder="Enter text here..."
                     value={formData?.name || ""}
                     onChange={(e) => setDraft({...draft, name: e.target.value})}
              />
            </div>

            <br />

            {/* The campaign genre / style */}
            <div id="input-box-white">
              <label htmlFor="campaign-genre"><b>Genre / Style</b></label><br />
              <input id="campaign-genre" placeholder="Enter text here..."
                     value={formData?.genre || ""}
                     onChange={(e) => setDraft({...draft, genre: e.target.value})}
              />
            </div>

            <br />

            {/* The campaign backstory */}
            <div id="input-box-white">
              <label htmlFor="campaign-story"><b>Backstory</b></label><br />
              <textarea id="campaign-story" placeholder={`Enter text here...`}
                        value={formData?.backstory || ""}
                        onChange={(e) => setDraft({...draft, backstory: e.target.value})}
              />
            </div>

            <br />

            {/* The add and show item buttons */}
            <div>
              <button id="button-green" onClick={() => setShowAddItemPopup(true)}>Add Item</button>
              <button
                id="button-blue"
                onClick={async () => {
                  const next = !showItems;
                  setShowItems(next);
                  if (next && userId && campaignId) {
                    try {
                      const list = await getItems(userId, campaignId);
                      setItems(list || []);
                    } catch (err) {
                      console.error("Failed to load items:", err);
                    }
                  }
                }}
                disabled={!campaignId || !userId}
              >
                {showItems ? "Hide Current Item(s)" : "Show Current Item(s)"}
              </button>
            </div>

            {/* Display current items */}
            {showItems && (
              <div className="character-section">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="character-row">
                      <div>
                        <div style={{ flex: 1 }}>
                          <b>{item.name || "Unnamed Item"}</b>
                          {item.description && (
                            <div><span>{item.description}</span></div>
                          )}
                          {(item.value !== undefined || item.weight !== undefined) && (
                            <div>
                              <span>{item.value !== undefined && `Value: ${item.value}`}</span>
                              <span>{item.value !== undefined && item.weight !== undefined && " | "}</span>
                              <span>{item.weight !== undefined && `Weight: ${item.weight}`}</span>
                            </div>
                          )}
                          {item.effects && item.effects.length > 0 && (
                            <div><span>Effects: {item.effects.join(", ")}</span></div>
                          )}
                          {item.bonusEffects && item.bonusEffects.length > 0 && (
                            <div><span>Bonus: {item.bonusEffects.join(", ")}</span></div>
                          )}
                        </div>
                        <div>
                          <button
                            id="button-blue"
                            type="button"
                            onClick={() => handleEditItem(item)}
                          >
                            edit
                          </button>
                          <button
                            type="button"
                            id="delete-button"
                            onClick={() => handleDeleteItem(item)}
                          >
                            delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    No items found. Create your first item!
                  </div>
                )}
              </div>
            )}

            {/* The Save and continue, and enter button */}
            <div className="campaign-actions">
              <button id="button-blue" onClick={handleSave} >Save and Continue</button>
              <button id="button-green" onClick={() => navigate(`/user/Map_Main/${campaignId}`)} disabled={!campaignId}>Enter</button>
            </div>

          </div>

        </div>

        <Footer />

      </div>

      {showAddItemPopup && (
        <Add_Item 
          onClose={handleItemPopupClose} 
          campaignId={campaignId}
          item={editingItem}
        />
      )}

    </div>
  );
}

export default New_Campaign_Page_CAMPAIGN;