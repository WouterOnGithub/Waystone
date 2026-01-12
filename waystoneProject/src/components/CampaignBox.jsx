import React from "react";
import { useAuth } from "../context/AuthContext";

const CampaignBox = ({ 
  item, 
  sectionTitle, 
  onOpenCampaign, 
  onPublishCampaign, 
  onArchiveCampaign,
  onUnarchiveCampaign,
  onAddToMyCampaigns
}) => {
  const { user } = useAuth();
  const isFreeCampaign = sectionTitle === "Free Campaigns";
  const isArchivedCampaign = sectionTitle === "Archived Campaigns";
  
  // Check if this is someone else's free campaign
  const isOtherFreeCampaign = isFreeCampaign && user?.uid && item.ownerId !== user.uid;
  
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
              className="campaign-button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToMyCampaigns(item.id);
              }}
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
                onUnarchiveCampaign(item.id);
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
