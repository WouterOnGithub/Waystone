import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllCampaigns, updateCampaignInfo } from "../api/userCampaigns";
import "./pages-css/CSS.css";
import "./pages-css/My_Campaigns_Page.css";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import Sidebar from "../components/UI/Sidebar";

// Static dummy data for free campaigns (kept as-is)
const freeCampaignSection = {
  title: "Free Campaigns",
  items: [
    { name: "Project__Name", color: "#E7D665" },
    { name: "Project__Name", color: "#447DC9" },
  ],
};

// Helper to normalise Firestore / ISO dates
const getCampaignSortDate = (campaign) => {
  const value = campaign.lastUpdatedAt || campaign.createdAt || null;
  if (!value) return 0;

  // Firestore Timestamp
  if (value && typeof value === "object" && typeof value.toDate === "function") {
    return value.toDate().getTime();
  }

  // ISO string or anything Date can parse
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

function My_Campaigns_Page() 
{
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCampaigns = async () => {
      if (!user?.uid) return;
      setLoading(true);
      setError(null);
      try {
        const campaigns = await getAllCampaigns(user.uid);

        // Sort by most recently edited (lastUpdatedAt), fallback to createdAt
        const sorted = [...campaigns].sort(
          (a, b) => getCampaignSortDate(b) - getCampaignSortDate(a)
        );

        setAllCampaigns(sorted);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
        setError("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [user]);

  const archivedCampaigns = allCampaigns.filter(campaign => campaign.isArchived);

  const dynamicSections = [
    {
      title: "Archived Campaigns",
      items: archivedCampaigns.map((c, idx) => ({
        id: c.id,
        name: c.name || "Unnamed campaign",
        color: ["#303030", "#303030", "#303030"][idx % 3],
      })),
    },
  ];

  const handleOpenCampaign = (campaignId) => {
    if (!campaignId) return;
    navigate(`/user/New_Campaign_Page_CAMPAIGN/${campaignId}`);
  };

  const handleUnarchiveCampaign = async (campaignId) => {
    if (!campaignId || !user?.uid) return;
    
    try {
      await updateCampaignInfo(user.uid, campaignId, { isArchived: false });
      // Refresh campaigns list
      const campaigns = await getAllCampaigns(user.uid);
      const sorted = [...campaigns].sort(
        (a, b) => getCampaignSortDate(b) - getCampaignSortDate(a)
      );
      setAllCampaigns(sorted);
    } catch (err) {
      console.error("Failed to unarchive campaign:", err);
      setError("Failed to unarchive campaign");
    }
  };

  return (
    <div>
      
      <Sidebar />

      <div id="main">
      
      <Header title="Archived Campaigns" />

        <div id="content">
          {loading && <p>Loading campaigns...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {dynamicSections.map((section) => (

            <section key={section.title}>

              {/* The title per section of campaigns */}
              <b>{section.title}</b>

              {/* The area that holds the campaign boxes */}
              <div id="box-section">
                {section.items.map((item, idx) => (
                  /* A campaigns box */
                  <div id="box-text" 
                       key={item.id ? item.id : `${section.title}-${idx}`}
                  >
                    
                    {/* The campaigns project name */}
                    <p>{item.name}&#10240;</p>
                    
                    {/* The bottom part of the box (the white) which contains the archive button */}
                    <div id="box">
                      <button
                          onClick={(e) => {
                          e.stopPropagation();
                          handleUnarchiveCampaign(item.id);
                          }}
                      >
                        Unarchive
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </section>
          ))}
        </div>

        <Footer />

      </div>
    </div>
  );
}

export default My_Campaigns_Page;