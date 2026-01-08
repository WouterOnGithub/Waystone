import React from "react";

const CampaignBox = ({ 
  item, 
  idx, 
  sectionTitle, 
  onOpenCampaign, 
  onPublishCampaign, 
  onArchiveCampaign 
}) => {
  const isFreeCampaign = sectionTitle === "Free Campaigns";
  
  return (
    <div className="campaign-box-container">
      {/* Campaign name area */}
      <div className="campaign-name-area">
        <h3>{item.name}</h3>
      </div>
      
      {/* Campaign map area */}
      <div 
        className="campaign-map-area"
        onClick={() => item.id && onOpenCampaign(item.id)}
        style={item.id ? { cursor: "pointer" } : undefined}
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
        {!isFreeCampaign && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPublishCampaign(item.id, item.name, item.published);
            }}
            className="campaign-button publish-button"
          >
            {item.published ? "Unpublish" : "Publish"}
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onArchiveCampaign(item.id, item.name);
          }}
          className="campaign-button archive-button"
        >
          Archive
        </button>
      </div>
    </div>
  );
};

export default CampaignBox;
