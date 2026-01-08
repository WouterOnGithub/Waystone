import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllCampaigns, updateCampaignInfo, deleteCampaign } from "../api/userCampaigns";
import "./pages-css/CSS.css";
import "./pages-css/My_Campaigns_Page.css";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import Sidebar from "../components/UI/Sidebar";
import CampaignBox from "../components/CampaignBox";

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

  const handleDeleteCampaign = async (campaignId, campaignName) => {
    if (!campaignId || !user?.uid) return;
    
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${campaignName}"? This action cannot be undone.`);
    if (!confirmed) return;
    
    try {
      await deleteCampaign(user.uid, campaignId);
      // Refresh campaigns list
      const campaigns = await getAllCampaigns(user.uid);
      const sorted = [...campaigns].sort(
        (a, b) => getCampaignSortDate(b) - getCampaignSortDate(a)
      );
      setAllCampaigns(sorted);
    } catch (err) {
      console.error("Failed to delete campaign:", err);
      setError("Failed to delete campaign");
    }
  };

  return (
    <div className="full-page">
      
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
                  <CampaignBox
                    key={item.id ? item.id : `${section.title}-${idx}`}
                    item={item}
                    idx={idx}
                    sectionTitle={section.title}
                    onOpenCampaign={handleOpenCampaign}
                    onPublishCampaign={() => {}} // No publish for archived
                    onArchiveCampaign={handleDeleteCampaign}
                    onAddToMyCampaigns={() => {}} // No add for archived
                  />
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