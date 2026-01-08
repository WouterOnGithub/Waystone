import React from "react";

const CampaignBox = ({ 
  item, 
  idx, 
  sectionTitle, 
  onOpenCampaign, 
  onPublishCampaign, 
  onArchiveCampaign 
}) => {
  return (
    <div id="box-text" 
         key={item.id ? item.id : `${sectionTitle}-${idx}`}
         onClick={() => onOpenCampaign(item.id)}
         style={item.id ? { cursor: "pointer" } : undefined}
    >
      
      {/* The campaigns project name */}
      <p>{item.name}&#10240;</p>
      
      {/* The bottom part of the box (the white) which contains the buttons */}
      <div id="box">
        {sectionTitle === "All Campaigns" ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPublishCampaign(item.id, item.name, item.published);
              }}
            >
              {item.published ? "Unpublish" : "Publish"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchiveCampaign(item.id, item.name);
              }}
            >
              Archive
            </button>
          </>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchiveCampaign(item.id, item.name);
            }}
          >
            Archive
          </button>
        )}
      </div>

    </div>
  );
};

export default CampaignBox;
