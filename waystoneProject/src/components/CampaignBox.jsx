import React from "react";
import { useAuth } from "../context/AuthContext";

const CampaignBox = ({ 
  item, 
  idx, 
  sectionTitle, 
  onOpenCampaign, 
  onPublishCampaign, 
  onArchiveCampaign,
  onAddToMyCampaigns,
  onUnarchiveCampaign
}) => {
  const { user } = useAuth();
  const isFreeCampaign = sectionTitle === "Free Campaigns";
  const isArchivedCampaign = sectionTitle === "Archived Campaigns";
  
  // Check if this is the user's own campaign that was published to free campaigns
  const isOwnPublishedCampaign = isFreeCampaign && user?.uid && item.ownerId === user.uid;
  
  // Check if this is someone else's free campaign
  const isOtherFreeCampaign = isFreeCampaign && user?.uid && item.ownerId !== user.uid;
  
  const handleAddToMyCampaigns = async () => {
    if (!item.id || !user?.uid) return;
    
    try {
      const { copyFreeCampaignToUser } = await import("../api/userCampaigns");
      await copyFreeCampaignToUser(user.uid, item.id);
      // Refresh the campaigns list
      window.location.reload();
    } catch (error) {
      console.error("Error adding campaign to my campaigns:", error);
      alert("Failed to add campaign to your campaigns");
    }
  };
  
  return (
    <div className="campaign-box-container">
      {/* Campaign name area */}
      <div className="campaign-name-area">
        <h3>{item.name}</h3>
      </div>
      
      {/* Campaign map area */}
      <div 
        className={`campaign-map-area ${isFreeCampaign || isArchivedCampaign ? 'unclickable' : ''}`}
        onClick={() => !isFreeCampaign && !isArchivedCampaign && item.id && onOpenCampaign(item.id)}
        style={!isFreeCampaign && !isArchivedCampaign && item.id ? { cursor: "pointer" } : undefined}
      >
        {item.mainMapUrl ? (
          <img 
            src={item.mainMapUrl} 
            alt={`${item.name} map`}
            className="campaign-map-image"
          />
        ) : (
          <div className="campaign-map-placeholder">
            <span>No Map Available</span>
          </div>
        )}
      </div>
      
      {/* Buttons area */}
      <div className="campaign-buttons-area">
        {isFreeCampaign ? (
          // Free campaigns logic - hide user's own campaigns
          isOtherFreeCampaign ? (
            <button
              onClick={handleAddToMyCampaigns}
              className="campaign-button add-button"
            >
              Add to my campaigns
            </button>
          ) : (
            <button className="campaign-button disabled-button" disabled>
              This is your campaign
            </button>
          )
        ) : isArchivedCampaign ? (
          // Archived campaigns - unarchive and delete buttons
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUnarchiveCampaign(item.id, item.name);
              }}
              className="campaign-button unarchive-button"
            >
              Unarchive
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchiveCampaign(item.id, item.name);
              }}
              className="campaign-button delete-button"
            >
              Delete
            </button>
          </>
        ) : (
          // Regular campaigns logic
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPublishCampaign(item.id, item.name, item.published);
              }}
              className="campaign-button publish-button"
            >
              {item.published ? "Unpublish" : "Publish"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchiveCampaign(item.id, item.name);
              }}
              className="campaign-button archive-button"
            >
              Archive
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignBox;
